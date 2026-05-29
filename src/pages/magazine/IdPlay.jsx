import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { magazinePageSettings, makeMagazineItems } from "./magazineConfig";

const CATEGORY = "id-play";
const ITEMS = makeMagazineItems(
  CATEGORY,
  "id PLAY layout",
  magazinePageSettings[CATEGORY].totalItems
);
const LOAD_COUNT = 9;
const PLAY_ZOOM_DURATION = 1.05;

const getTypeClass = (index) => {
  const types = ["type-a", "type-b"];
  return types[index % types.length];
};

const getPlayAspect = (index) => {
  return getTypeClass(index) === "type-b" ? "9 / 16" : "16 / 9";
};

function IdPlay() {
  const [visibleCount, setVisibleCount] = useState(LOAD_COUNT);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeAspect, setActiveAspect] = useState(getPlayAspect(0));
  const pageItems = ITEMS.slice(0, visibleCount);
  const hasMoreItems = visibleCount < ITEMS.length;
  const viewerFrameRef = useRef(null);
  const cloneRef = useRef(null);
  const activeSourceImageRef = useRef(null);
  const playItemRefs = useRef([]);
  const viewerSlideRefs = useRef([]);
  const timelineRef = useRef(null);
  const swiperRef = useRef(null);

  const removeClone = () => {
    cloneRef.current?.remove();
    cloneRef.current = null;
  };

  const showSourceImage = () => {
    if (activeSourceImageRef.current) {
      gsap.set(activeSourceImageRef.current, { clearProps: "visibility" });
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((count) => Math.min(count + LOAD_COUNT, ITEMS.length));

    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("scroll"));
    });
  };

  const openViewer = (event, index) => {
    const image = event.currentTarget.querySelector("img");
    if (!image) return;

    const sourceRect = image.getBoundingClientRect();
    const clone = image.cloneNode(true);

    timelineRef.current?.kill();
    removeClone();
    showSourceImage();

    clone.className = "play_transition_clone";
    document.body.appendChild(clone);
    cloneRef.current = clone;
    activeSourceImageRef.current = image;

    gsap.set(clone, {
      left: sourceRect.left,
      top: sourceRect.top,
      width: sourceRect.width,
      height: sourceRect.height,
    });
    gsap.set(image, { visibility: "hidden" });

    document.body.classList.add("play-viewer-locked", "play-viewer-zooming");
    document.body.classList.add("play-viewer-animating");
    window.lenis?.stop?.();
    flushSync(() => {
      setActiveIndex(index);
      setActiveAspect(getPlayAspect(index));
      setViewerReady(false);
      setViewerOpen(true);
    });
    swiperRef.current?.update();
    swiperRef.current?.slideTo(index, 0, false);

    requestAnimationFrame(() => {
      swiperRef.current?.update();
      swiperRef.current?.slideTo(index, 0, false);

      requestAnimationFrame(() => {
        swiperRef.current?.update();
        swiperRef.current?.slideTo(index, 0, false);

        requestAnimationFrame(() => {
          const targetSlide = viewerSlideRefs.current[index];
          const targetRect = targetSlide?.getBoundingClientRect() || viewerFrameRef.current?.getBoundingClientRect();

          if (!targetRect) return;

          timelineRef.current = gsap.timeline({
            defaults: {
              duration: PLAY_ZOOM_DURATION,
              ease: "expo.inOut",
            },
          onComplete: () => {
            document.body.classList.remove("play-viewer-zooming");
            document.body.classList.remove("play-viewer-animating");
            setViewerReady(true);
            window.setTimeout(removeClone, 80);
          },
          });

          timelineRef.current.to(clone, {
            left: targetRect.left,
            top: targetRect.top,
            width: targetRect.width,
            height: targetRect.height,
          });
        });
      });
    });
  };

  const closeViewer = () => {
    const target = viewerFrameRef.current;
    const originalSourceImage = activeSourceImageRef.current;
    const currentSourceImage = playItemRefs.current[activeIndex]?.querySelector("img");
    const sourceImage = currentSourceImage || originalSourceImage;

    if (!sourceImage || !target) {
      showSourceImage();
      setViewerOpen(false);
      setViewerReady(false);
      document.body.classList.remove("play-viewer-locked", "play-viewer-zooming", "play-viewer-animating");
      window.lenis?.start?.();
      return;
    }

    const sourceRect = sourceImage.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const clone = ITEMS[activeIndex] ? document.createElement("img") : null;
    if (!clone) return;

    timelineRef.current?.kill();
    removeClone();

    clone.src = ITEMS[activeIndex].img;
    clone.alt = "";
    clone.className = "play_transition_clone";
    document.body.appendChild(clone);
    cloneRef.current = clone;

    if (originalSourceImage && originalSourceImage !== sourceImage) {
      gsap.set(originalSourceImage, { clearProps: "visibility" });
    }

    gsap.set(sourceImage, { visibility: "hidden" });

    gsap.set(clone, {
      left: targetRect.left,
      top: targetRect.top,
      width: targetRect.width,
      height: targetRect.height,
    });

    setViewerOpen(false);
    setViewerReady(false);
    document.body.classList.add("play-viewer-zooming");

    timelineRef.current = gsap.timeline({
      defaults: {
        duration: PLAY_ZOOM_DURATION,
        ease: "expo.inOut",
      },
      onComplete: () => {
        gsap.set(sourceImage, { clearProps: "visibility" });
        activeSourceImageRef.current = null;
        removeClone();
        document.body.classList.remove("play-viewer-locked", "play-viewer-zooming");
        document.body.classList.remove("play-viewer-animating");
        window.lenis?.start?.();
      },
    });

    timelineRef.current.to(clone, {
      left: sourceRect.left,
      top: sourceRect.top,
      width: sourceRect.width,
      height: sourceRect.height,
    });
  };

  return (
    <>
      <ul className="mg_list mg_list_play b-t init_ani">
        {pageItems.map((item, index) => (
          <li
            className={`mg_li ani ${getTypeClass(index)}`}
            key={item.id}
            ref={(element) => {
              playItemRefs.current[index] = element;
            }}
          >
            <button type="button" className="mg_a" onClick={(event) => openViewer(event, index)}>
              <img src={item.img} alt="Magazine Image" />
            </button>
          </li>
        ))}
      </ul>
      {hasMoreItems && (
        <div className="md_body_b b-t ani">
          <button type="button" className="hover_btn" onClick={handleLoadMore}>
            <span className="body-m fw-sb">LOAD MORE</span>
          </button>
        </div>
      )}

      <div className={`play_viewer ${viewerOpen ? "active" : ""} ${viewerReady ? "ready" : ""}`} aria-hidden={!viewerOpen}>
        <button type="button" className="play_viewer_close" onClick={closeViewer} aria-label="Close">
          <span></span>
          <span></span>
        </button>
        <div className="play_viewer_bg" aria-hidden="true">
          {/*<img src={ITEMS[activeIndex]?.img} alt="" />*/}
        </div>
        <div className="play_viewer_stage">
          <Swiper
            className="play_viewer_swiper"
            slidesPerView="auto"
            centeredSlides
            direction={window.innerWidth <= 1024 ? "vertical" : "horizontal"}
            initialSlide={activeIndex}
            speed={800}
            spaceBetween={120}
            breakpoints={{
              0: {
                direction: "vertical",
                
              },
              1025: {
                direction: "horizontal",
                spaceBetween: 120,
              },
            }}
            slideToClickedSlide
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              swiper.slideTo(activeIndex, 0);
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.activeIndex);
              setActiveAspect(getPlayAspect(swiper.activeIndex));
            }}
          >
            {ITEMS.map((item, index) => (
              <SwiperSlide
                className={`play_viewer_slide ${getTypeClass(index)}`}
                key={item.id}
                ref={(element) => {
                  viewerSlideRefs.current[index] = element;
                }}
              >
                <button type="button" className="play_viewer_slide_btn">
                  <img src={item.img} alt={item.title} />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            className="play_viewer_frame"
            ref={viewerFrameRef}
            aria-hidden="true"
            style={{ "--play-viewer-aspect": activeAspect }}
          ></div>
        </div>
      </div>
    </>
  );
}

export default IdPlay;
