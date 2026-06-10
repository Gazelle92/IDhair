import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Lenis from "lenis";
import { getPageItems, magazinePageSettings, galleryItems } from "./magazineConfig";

const CATEGORY = "id-gallery";
const ITEMS = galleryItems(
  CATEGORY,
  "id GALLERY layout",
  magazinePageSettings[CATEGORY].totalItems
);
const ZOOM_IN_DURATION = 1.2;
const ZOOM_OUT_DURATION = 1.2;
const ZOOM_STAGGER_AMOUNT = 0.2;

const getViewerImageTarget = () => {
  const isMobile = window.innerWidth <= 1024;
  const width = isMobile ? window.innerWidth * 0.76 : Math.min(window.innerWidth * 0.375, 620);
  const height = isMobile ? window.innerHeight * 0.6 : Math.min(window.innerHeight * 0.78, 720);
  const centerX = isMobile
    ? window.innerWidth * 0.5
    : window.innerWidth * 0.326 + (window.innerWidth - window.innerWidth * 0.326 - window.innerWidth * 0.109) / 2;
  const centerY = window.innerHeight * 0.5;

  return { width, height, centerX, centerY };
};

const getViewerImageStackTarget = (stackElement) => {
  if (!stackElement) return getViewerImageTarget();

  const rect = stackElement.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
    left: rect.left,
    top: rect.top,
  };
};

function IdGallery({ currentPage = 1 }) {
  const [isGalleryViewerOpen, setIsGalleryViewerOpen] = useState(false);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);
  const [viewerCurrentIndex, setViewerCurrentIndex] = useState(0);
  const [activeViewerItems, setActiveViewerItems] = useState([]);
  const zoomedItemRef = useRef(null);
  const zoomTimelineRef = useRef(null);
  const transitionCloneRef = useRef(null);
  const viewerScrollRef = useRef(null);
  const viewerContentRef = useRef(null);
  const viewerImageStackRef = useRef(null);
  const viewerLayerRefs = useRef([]);
  const viewerThumbRefs = useRef([]);
  const viewerThumbsWrapRef = useRef(null);
  const viewerThumbsRef = useRef(null);
  const viewerFrameRef = useRef(null);
  const viewerTitleRef = useRef(null);
  const viewerLenisRef = useRef(null);
  const backdropTimerRef = useRef(null);
  const controlsTimerRef = useRef(null);
  const pageItems = getPageItems(ITEMS, currentPage, CATEGORY);
  const isFirstPage = currentPage === 1;
  const featuredItem = isFirstPage ? pageItems[0] : null;
  const normalItems = isFirstPage ? pageItems.slice(1) : pageItems;
  const viewerItems = activeViewerItems;
  const viewerItem = viewerItems[viewerCurrentIndex] || viewerItems[0];

  const getGalleryDomItems = () => {
    return [...document.querySelectorAll(".mg_list_gallery_featured .mg_li, .mg_list_gallery .mg_li")];
  };

  const getGalleryZoomImage = (item) => {
    return item?.querySelector(".thumb") || item?.querySelector("img");
  };

  const removeTransitionClone = () => {
    transitionCloneRef.current?.remove();
    transitionCloneRef.current = null;
  };

  const clearGalleryBackdropTimer = () => {
    if (!backdropTimerRef.current) return;

    window.clearTimeout(backdropTimerRef.current);
    backdropTimerRef.current = null;
  };

  const clearGalleryControlsTimer = () => {
    if (!controlsTimerRef.current) return;

    window.clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = null;
  };

  const hideGalleryBackdrop = () => {
    clearGalleryBackdropTimer();
    document.body.classList.remove("gallery-backdrop-active");
  };

  const hideGalleryControls = () => {
    clearGalleryControlsTimer();
    document.body.classList.remove("gallery-controls-active");
  };

  const showZoomedSourceImage = () => {
    const sourceImage = getGalleryZoomImage(zoomedItemRef.current);
    if (sourceImage) {
      gsap.set(sourceImage, { clearProps: "visibility" });
    }
  };

  const resetGalleryZoom = () => {
    const items = getGalleryDomItems();
    const images = items.map(getGalleryZoomImage).filter(Boolean);
    const currentItem = zoomedItemRef.current;
    const currentImage = getGalleryZoomImage(currentItem);

    zoomTimelineRef.current?.kill();
    removeTransitionClone();
    hideGalleryBackdrop();
    hideGalleryControls();
    zoomedItemRef.current?.classList.remove("is_zoomed");
    zoomedItemRef.current = null;
    setIsGalleryViewerOpen(false);
    document.body.classList.remove("gallery-viewer-open");
    setActiveViewerItems([]);

    if (currentImage) {
      const viewerTarget = getViewerImageStackTarget(viewerImageStackRef.current);
      const rect = currentImage.getBoundingClientRect();
      const clone = currentImage.cloneNode(true);
      const startLeft = viewerTarget.left ?? viewerTarget.centerX - viewerTarget.width / 2;
      const startTop = viewerTarget.top ?? viewerTarget.centerY - viewerTarget.height / 2;

      transitionCloneRef.current = clone;
      clone.className = "gallery_transition_clone";
      document.body.appendChild(clone);

      gsap.set(clone, {
        left: startLeft,
        top: startTop,
        width: viewerTarget.width,
        height: viewerTarget.height,
        visibility: "visible",
      });

      zoomTimelineRef.current = gsap.timeline({
        defaults: {
          duration: ZOOM_OUT_DURATION,
          ease: "expo.inOut",
        },
        onComplete: () => {
          gsap.set(currentImage, { clearProps: "visibility" });
          removeTransitionClone();
          document.body.classList.remove("gallery-zooming");
          document.body.classList.remove("gallery-scroll-locked");
          document.body.classList.remove("gallery-viewer-open");
          document.documentElement.style.removeProperty("--gallery-viewer-image-width");
          document.documentElement.style.removeProperty("--gallery-viewer-image-height");
          window.lenis?.start?.();
          gsap.set([...items, ...images], { clearProps: "opacity,scale,scaleX,scaleY,x,y,zIndex,willChange" });
        },
      });

      zoomTimelineRef.current
        .to(clone, { left: rect.left, top: rect.top, width: rect.width, height: rect.height }, 0)
        .to(items, { opacity: 1, scale: 1 }, 0);

      return;
    }

    zoomTimelineRef.current = gsap.timeline({
      defaults: {
        duration: ZOOM_OUT_DURATION,
        ease: "expo.inOut",
      },
      onComplete: () => {
        document.body.classList.remove("gallery-zooming");
        document.body.classList.remove("gallery-scroll-locked");
        document.body.classList.remove("gallery-viewer-open");
        document.documentElement.style.removeProperty("--gallery-viewer-image-width");
        document.documentElement.style.removeProperty("--gallery-viewer-image-height");
        window.lenis?.start?.();
        gsap.set([...items, ...images], { clearProps: "opacity,scale,scaleX,scaleY,x,y,zIndex,willChange" });
      },
    });

    zoomTimelineRef.current
      .to(images, { scaleX: 1, scaleY: 1, x: 0, y: 0 }, 0)
      .to(items, { opacity: 1, scale: 1 }, 0);
  };

  const clearGalleryZoom = () => {
    const items = getGalleryDomItems();
    const images = items.map(getGalleryZoomImage).filter(Boolean);

    zoomTimelineRef.current?.kill();
    removeTransitionClone();
    hideGalleryBackdrop();
    hideGalleryControls();
    showZoomedSourceImage();
    zoomedItemRef.current?.classList.remove("is_zoomed");
    zoomedItemRef.current = null;
    setActiveViewerItems([]);
    document.body.classList.remove("gallery-zooming");
    document.body.classList.remove("gallery-scroll-locked");
    document.body.classList.remove("gallery-viewer-open");
    document.documentElement.style.removeProperty("--gallery-viewer-image-width");
    document.documentElement.style.removeProperty("--gallery-viewer-image-height");
    window.lenis?.start?.();
    gsap.set([...items, ...images], { clearProps: "opacity,scale,scaleX,scaleY,x,y,zIndex,willChange" });
  };

  const handleGalleryItemClick = (event) => {
    const item = event.currentTarget.closest(".mg_li");
    const list = item?.closest(".mg_list");
    const image = getGalleryZoomImage(item);

    if (!item || !list || !image) return;

    if (zoomedItemRef.current === item) {
      setIsGalleryViewerOpen(false);
      resetGalleryZoom(list);
      return;
    }

    if (zoomedItemRef.current) {
      clearGalleryZoom(list);
    }

    const initialViewerTarget = getViewerImageStackTarget(viewerImageStackRef.current);
    document.documentElement.style.setProperty("--gallery-viewer-image-width", `${initialViewerTarget.width}px`);
    document.documentElement.style.setProperty("--gallery-viewer-image-height", `${initialViewerTarget.height}px`);

    document.body.classList.add("gallery-zooming");
    document.body.classList.add("gallery-scroll-locked");
    clearGalleryBackdropTimer();
    backdropTimerRef.current = window.setTimeout(() => {
      document.body.classList.add("gallery-backdrop-active");
      backdropTimerRef.current = null;
    }, 500);
    window.lenis?.stop?.();

    const rect = image.getBoundingClientRect();
    const clone = image.cloneNode(true);
    const galleryItems = getGalleryDomItems();
    const otherItems = galleryItems.filter((li) => li !== item);
    const itemId = Number(event.currentTarget.dataset.itemId);
    const selectedItem = pageItems.find((pageItem) => pageItem.id === itemId);
    const selectedViewerItems = selectedItem?.images?.length ? selectedItem.images : [selectedItem].filter(Boolean);

    removeTransitionClone();
    transitionCloneRef.current = clone;
    clone.className = "gallery_transition_clone";
    document.body.appendChild(clone);

    gsap.set(clone, {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });
    gsap.set(image, { visibility: "hidden" });

    gsap.killTweensOf([item, image, otherItems, clone]);
    zoomTimelineRef.current?.kill();
    zoomedItemRef.current = item;
    item.classList.add("is_zoomed");
    setActiveViewerItems(selectedViewerItems);
    setViewerStartIndex(0);
    setViewerCurrentIndex(0);
    setIsGalleryViewerOpen(false);

    requestAnimationFrame(() => {
      const viewerTarget = getViewerImageStackTarget(viewerImageStackRef.current);
      const targetLeft = viewerTarget.left ?? viewerTarget.centerX - viewerTarget.width / 2;
      const targetTop = viewerTarget.top ?? viewerTarget.centerY - viewerTarget.height / 2;

      zoomTimelineRef.current = gsap.timeline({
        defaults: {
          duration: ZOOM_IN_DURATION,
          ease: "expo.inOut",
        },
        onComplete: () => {
          document.body.classList.add("gallery-viewer-open");
          setIsGalleryViewerOpen(true);
          clearGalleryControlsTimer();
          controlsTimerRef.current = window.setTimeout(() => {
            document.body.classList.add("gallery-controls-active");
            controlsTimerRef.current = null;
          }, 120);
          window.setTimeout(removeTransitionClone, 80);
        },
      });

      zoomTimelineRef.current
        .set(otherItems, { willChange: "transform, opacity" }, 0)
        .to(clone, { left: targetLeft, top: targetTop, width: viewerTarget.width, height: viewerTarget.height }, 0)
        .to(
          otherItems,
          {
            opacity: 0,
            scale: 0.8,
            stagger: {
              amount: ZOOM_STAGGER_AMOUNT,
              from: "center",
            },
          },
          0
        );
    });
  };

  const closeGalleryViewer = () => {
    const list = zoomedItemRef.current?.closest(".mg_list_gallery");

    setIsGalleryViewerOpen(false);
    document.body.classList.remove("gallery-viewer-open");
    hideGalleryBackdrop();
    hideGalleryControls();
    resetGalleryZoom(list);
  };

  const handleViewerThumbClick = (index) => {
    const scrollTop = index * window.innerHeight;

    viewerLenisRef.current?.scrollTo(scrollTop, {
      duration: 1,
      force: true,
    });
  };

  const updateViewerClipPath = (scrollValue) => {
    const scroller = viewerScrollRef.current;
    if (!scroller || viewerItems.length === 0) return;

    const currentScroll = typeof scrollValue === "number" ? scrollValue : scroller.scrollTop;
    const progress = currentScroll / Math.max(window.innerHeight, 1);
    const clampedProgress = Math.min(viewerItems.length - 1, Math.max(0, progress));
    const nextIndex = Math.min(viewerItems.length - 1, Math.max(0, Math.round(progress)));
    let clippingIndex = nextIndex;

    viewerLayerRefs.current.forEach((layer, index) => {
      if (!layer) return;

      if (index === 0) {
        layer.style.clipPath = "inset(0% 0% 0% 0%)";
        return;
      }

      const revealProgress = Math.min(1, Math.max(0, progress - (index - 1)));
      if (revealProgress > 0 && revealProgress < 1) {
        clippingIndex = index;
      }

      const topInset = (1 - revealProgress) * 100;
      layer.style.clipPath = `inset(${topInset}% 0% 0% 0%)`;
    });

    setViewerCurrentIndex(clippingIndex);

    const thumbs = viewerThumbsRef.current;
    const thumbsWrap = viewerThumbsWrapRef.current;
    const currentThumb = viewerThumbRefs.current[clippingIndex];

    if (thumbs && thumbsWrap && currentThumb) {
      const isMobileThumbs = window.innerWidth <= 1024;
      const fromIndex = Math.floor(clampedProgress);
      const toIndex = Math.min(viewerItems.length - 1, fromIndex + 1);
      const progressBetweenThumbs = clampedProgress - fromIndex;
      const fromThumb = viewerThumbRefs.current[fromIndex] || currentThumb;
      const toThumb = viewerThumbRefs.current[toIndex] || fromThumb;
      const fromCenter = isMobileThumbs
        ? fromThumb.offsetLeft + fromThumb.offsetWidth / 2
        : fromThumb.offsetTop + fromThumb.offsetHeight / 2;
      const toCenter = isMobileThumbs
        ? toThumb.offsetLeft + toThumb.offsetWidth / 2
        : toThumb.offsetTop + toThumb.offsetHeight / 2;
      const thumbCenter = fromCenter + (toCenter - fromCenter) * progressBetweenThumbs;
      const target = isMobileThumbs
        ? thumbsWrap.clientWidth / 2 - thumbCenter
        : thumbsWrap.clientHeight / 2 - thumbCenter;

      gsap.to(thumbs, {
        x: isMobileThumbs ? target : 0,
        y: isMobileThumbs ? 0 : target,
        duration: 0.0,
        ease: "power2.out",
        overwrite: true,
      });
    }
  };

  const handleViewerScroll = () => {
    if (viewerFrameRef.current) return;

    viewerFrameRef.current = requestAnimationFrame(() => {
      viewerFrameRef.current = null;
      updateViewerClipPath();
    });
  };

  useEffect(() => {
    if (!isGalleryViewerOpen) return undefined;

    const scroller = viewerScrollRef.current;
    const content = viewerContentRef.current;
    if (!scroller || !content) return undefined;

    viewerLenisRef.current?.destroy();

    const viewerLenis = new Lenis({
      wrapper: scroller,
      content,
      eventsTarget: scroller,
      autoRaf: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
    });

    viewerLenisRef.current = viewerLenis;
    viewerLenis.on("scroll", ({ scroll }) => {
      updateViewerClipPath(scroll);
    });

    const scrollTop = viewerStartIndex * window.innerHeight;
    viewerLenis.scrollTo(scrollTop, { immediate: true, force: true });
    updateViewerClipPath(scrollTop);

    return () => {
      viewerLenis.destroy();
      if (viewerLenisRef.current === viewerLenis) {
        viewerLenisRef.current = null;
      }
    };
  }, [isGalleryViewerOpen, viewerStartIndex, viewerItems.length]);


  useEffect(() => {
    return () => {
      if (viewerFrameRef.current) {
        cancelAnimationFrame(viewerFrameRef.current);
      }
      viewerLenisRef.current?.destroy();
      zoomTimelineRef.current?.kill();
      removeTransitionClone();
      hideGalleryBackdrop();
      hideGalleryControls();
      document.body.classList.remove("gallery-zooming");
      document.body.classList.remove("gallery-scroll-locked");
      document.body.classList.remove("gallery-viewer-open");
      document.documentElement.style.removeProperty("--gallery-viewer-image-width");
      document.documentElement.style.removeProperty("--gallery-viewer-image-height");
      window.lenis?.start?.();
    };
  }, []);

  return (
    <>
      {featuredItem && (
        <ul className="mg_list mg_list_gallery_featured">
          <li className="mg_li ani" key={featuredItem.id}>
            <button
              type="button"
              className="mg_a"
              data-item-id={featuredItem.id}
              onClick={handleGalleryItemClick}
            >
              <h1 className="display-m apprael_all apprael_ani">
                <span>{featuredItem.date} </span>
                <span>{featuredItem.title}</span>
              </h1>
              <img className="bg" src={featuredItem.img} alt="Magazine Image" />
              <div className="bg_blur"></div>
              <img className="thumb" src={featuredItem.img} alt="Magazine Image" />
            </button>
          </li>
        </ul>
      )}

      <ul className="mg_list mg_list_gallery init_ani">
        {normalItems.map((item) => (
          <li className="mg_li ani" key={item.id}>
              <button
                type="button"
                className="mg_a"
                data-item-id={item.id}
                onClick={handleGalleryItemClick}
              >
              <h1 className="body-l">{item.date} {item.title}</h1>
              <img src={item.img} alt="Magazine Image" />
            </button>
          </li>
        ))}
      </ul>

      <div
        className={`gallery_viewer ${isGalleryViewerOpen ? "active" : ""}`}
        aria-hidden={!isGalleryViewerOpen}
        aria-modal="true"
        role="dialog"
      >
          <div
            className="gallery_viewer_scroll"
            ref={viewerScrollRef}
            onScroll={handleViewerScroll}
          >
            <div
              className="gallery_viewer_space"
              ref={viewerContentRef}
              style={{ height: `${Math.max(viewerItems.length, 1) * 100}vh` }}
            >
              <div className="gallery_viewer_stage">
                <div className="gallery_viewer_left">
                  <button type="button" className="gallery_viewer_close body-m" onClick={closeGalleryViewer}>
                    Close
                  </button>
                  <h2
                    className="gallery_viewer_title apprael display-s apprael_all ani apprael_ani"
                    data-id={viewerItem?.id}
                    data-category={viewerItem?.category}
                    key={activeViewerItems[0]?.parentId || activeViewerItems[0]?.id || "gallery-viewer-title"}
                    ref={viewerTitleRef}
                  >
                    {viewerItem?.date} {viewerItem?.title}
                  </h2>
                  <div className="gallery_viewer_hint body-m">
                    <span>Scroll</span>
                    <span aria-hidden="true">↓</span>
                  </div>
                </div>

                <div className="gallery_viewer_visual">
                  <div className="gallery_viewer_count gallery_viewer_count_start body-m">
                    {String(viewerCurrentIndex + 1).padStart(2, "0")}
                  </div>
                  <div className="gallery_viewer_image_stack" ref={viewerImageStackRef}>
                    {viewerItems.map((item, index) => (
                      <div
                        className="gallery_viewer_layer"
                        key={item.id}
                        ref={(element) => {
                          viewerLayerRefs.current[index] = element;
                        }}
                        style={{ zIndex: index + 1 }}
                      >
                        <img src={item.img} alt="Magazine Image" />
                      </div>
                    ))}
                  </div>
                  <div className="gallery_viewer_count gallery_viewer_count_end body-m">
                    {String(viewerItems.length).padStart(2, "0")}
                  </div>
                </div>

                <div
                  className="gallery_viewer_thumbs_wrap"
                  ref={viewerThumbsWrapRef}
                  aria-label="Gallery thumbnails"
                >
                  <div className="gallery_viewer_thumbs" ref={viewerThumbsRef}>
                    {viewerItems.map((item, index) => (
                      <button
                        type="button"
                        className={`gallery_viewer_thumb ${viewerCurrentIndex === index ? "active" : ""}`}
                        key={item.id}
                        ref={(element) => {
                          viewerThumbRefs.current[index] = element;
                        }}
                        onClick={() => handleViewerThumbClick(index)}
                      >
                        <img src={item.img} alt="" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </>
  );
}

export default IdGallery;
