import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { fetchPlayPosts, formatNewsDate, getNewsImageUrl } from "../../lib/sanityNews";

const CATEGORY = "id-play";
const LOAD_COUNT = 9;
const PLAY_ZOOM_DURATION = 1.05;

const getYoutubeId = (url) => {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (host.endsWith("youtube.com")) {
      if (parsedUrl.pathname.startsWith("/shorts/") || parsedUrl.pathname.startsWith("/embed/")) {
        return parsedUrl.pathname.split("/").filter(Boolean)[1] || "";
      }

      return parsedUrl.searchParams.get("v") || "";
    }
  } catch {
    return "";
  }

  return "";
};

const getYoutubeEmbedUrl = (url) => {
  const id = getYoutubeId(url);

  if (!id) return "";

  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${id}&controls=0&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&cc_load_policy=0`;
};

const getPlayVideoUrl = (item) => item?.youtubeUrl || item?.videoUrl || item?.url || "";

const mapPlayMedia = (post, media, mediaIndex) => {
  const youtubeUrl = getPlayVideoUrl(media);
  const youtubeEmbedUrl = getYoutubeEmbedUrl(youtubeUrl);
  const displayType = media.displayType || getTypeClass(null, mediaIndex);

  if (youtubeEmbedUrl) {
    return {
      id: `${post._id}-${media._key || mediaIndex}`,
      parentId: post._id,
      category: CATEGORY,
      date: formatNewsDate(post.publishedAt),
      title: media.title || post.title || "id PLAY",
      displayType,
      mediaType: "youtube",
      youtubeUrl,
      embedUrl: youtubeEmbedUrl,
    };
  }

  const imageUrl = getNewsImageUrl(media, 1600);

  if (!imageUrl) return null;

  return {
    id: `${post._id}-${media._key || mediaIndex}`,
    parentId: post._id,
    category: CATEGORY,
    date: formatNewsDate(post.publishedAt),
    title: post.title || "id PLAY",
    displayType,
    mediaType: "image",
    img: imageUrl,
  };
};

const renderPlayMedia = (item, alt = "Magazine Image") => {
  if (item.mediaType === "youtube") {
    return (
      <iframe
        className="play_media play_media_youtube"
        src={item.embedUrl}
        title={item.title || "YouTube video"}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

  return <img className="play_media" src={item.img} alt={alt} />;
};

const getTypeClass = (item, index = 0) => {
  if (item?.displayType === "type-a" || item?.displayType === "type-b") {
    return item.displayType;
  }

  return index % 2 === 0 ? "type-a" : "type-b";
};

const getPlayAspect = (item, index = 0) => {
  return getTypeClass(item, index) === "type-a" ? "9 / 16" : "16 / 9";
};

function IdPlay() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [visibleCount, setVisibleCount] = useState(LOAD_COUNT);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeAspect, setActiveAspect] = useState(getPlayAspect(null, 0));
  const [activeViewerItems, setActiveViewerItems] = useState([]);
  const items = posts
    .map((post) => {
      const mediaItems = (post.images || [])
        .map((media, mediaIndex) => mapPlayMedia(post, media, mediaIndex))
        .filter(Boolean);
      const thumbnail = mediaItems[0];

      if (!thumbnail) return null;

      return {
        id: post._id,
        category: CATEGORY,
        date: formatNewsDate(post.publishedAt),
        title: post.title || "id PLAY",
        displayType: thumbnail.displayType,
        img: thumbnail.img,
        mediaType: thumbnail.mediaType,
        embedUrl: thumbnail.embedUrl,
        youtubeUrl: thumbnail.youtubeUrl,
        images: mediaItems,
      };
    })
    .filter(Boolean);
  const pageItems = items.slice(0, visibleCount);
  const viewerItems = activeViewerItems;
  const hasMoreItems = visibleCount < items.length;
  const viewerFrameRef = useRef(null);
  const cloneRef = useRef(null);
  const activeSourceImageRef = useRef(null);
  const playItemRefs = useRef([]);
  const viewerSlideRefs = useRef([]);
  const timelineRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    fetchPlayPosts()
      .then((items) => {
        if (!isMounted) return;

        setPosts(items);
        setStatus("ready");
      })
      .catch((error) => {
        if (!isMounted) return;

        console.error("Failed to load Sanity play posts", error);
        setErrorMessage(error?.message || "Unknown error");
        setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
    setVisibleCount((count) => Math.min(count + LOAD_COUNT, items.length));

    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("scroll"));
    });
  };

  const openViewer = (event, index) => {
    const sourceMedia = event.currentTarget.querySelector(".play_media");
    if (!sourceMedia) return;

    const sourceRect = sourceMedia.getBoundingClientRect();
    const clone = sourceMedia.cloneNode(true);

    timelineRef.current?.kill();
    removeClone();
    showSourceImage();

    clone.className = "play_transition_clone";
    document.body.appendChild(clone);
    cloneRef.current = clone;
    activeSourceImageRef.current = sourceMedia;

    gsap.set(clone, {
      left: sourceRect.left,
      top: sourceRect.top,
      width: sourceRect.width,
      height: sourceRect.height,
    });
    gsap.set(sourceMedia, { visibility: "hidden" });

    document.body.classList.add("play-viewer-locked", "play-viewer-zooming");
    document.body.classList.add("play-viewer-animating");
    window.lenis?.stop?.();
    flushSync(() => {
      const selectedViewerItems = pageItems[index]?.images?.length ? pageItems[index].images : [pageItems[index]].filter(Boolean);

      setActiveViewerItems(selectedViewerItems);
      setActiveIndex(0);
      setActiveAspect(getPlayAspect(selectedViewerItems[0], 0));
      setViewerReady(false);
      setViewerOpen(true);
    });
    swiperRef.current?.update();
    swiperRef.current?.slideTo(0, 0, false);

    requestAnimationFrame(() => {
      swiperRef.current?.update();
      swiperRef.current?.slideTo(0, 0, false);

      requestAnimationFrame(() => {
        swiperRef.current?.update();
        swiperRef.current?.slideTo(0, 0, false);

        requestAnimationFrame(() => {
          const targetSlide = viewerSlideRefs.current[0];
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
    const sourceImage = originalSourceImage;

    if (!sourceImage || !target) {
      showSourceImage();
      setActiveViewerItems([]);
      setViewerOpen(false);
      setViewerReady(false);
      document.body.classList.remove("play-viewer-locked", "play-viewer-zooming", "play-viewer-animating");
      window.lenis?.start?.();
      return;
    }

    const sourceRect = sourceImage.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const activeItem = viewerItems[activeIndex];
    const clone = activeItem
      ? document.createElement(activeItem.mediaType === "youtube" ? "iframe" : "img")
      : null;
    if (!clone) return;

    timelineRef.current?.kill();
    removeClone();

    if (activeItem.mediaType === "youtube") {
      clone.src = activeItem.embedUrl;
      clone.setAttribute("title", activeItem.title || "YouTube video");
      clone.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
    } else {
      clone.src = activeItem.img;
      clone.alt = "";
    }
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
        setActiveViewerItems([]);
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

  if (status === "loading") {
    return <div className="mg_state body-m loading"></div>;
  }

  if (status === "error") {
    return <div className="mg_state body-m">Play posts could not be loaded. {errorMessage}</div>;
  }

  if (!items.length) {
    return <div className="mg_state body-m">No play posts yet.</div>;
  }

  return (
    <>
      <ul className="mg_list mg_list_play b-t init_ani">
        {pageItems.map((item, index) => (
          <li
            className={`mg_li ani ${getTypeClass(item, index)}`}
            key={item.id}
            ref={(element) => {
              playItemRefs.current[index] = element;
            }}
          >
            <button type="button" className="mg_a" onClick={(event) => openViewer(event, index)}>
              {renderPlayMedia(item)}
            </button>
          </li>
        ))}
      </ul>
      {hasMoreItems && (
        <div className="md_body_b b-t b-c-gray ani">
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
        <div className="play_viewer_bg" aria-hidden="true"></div>
        <div className="play_viewer_stage">
          <Swiper
            className="play_viewer_swiper"
            slidesPerView="auto"
            centeredSlides
            direction={window.innerWidth <= 1024 ? "vertical" : "horizontal"}
            initialSlide={0}
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
              swiper.slideTo(0, 0);
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.activeIndex);
              setActiveAspect(getPlayAspect(viewerItems[swiper.activeIndex], swiper.activeIndex));
            }}
          >
            {viewerItems.map((item, index) => (
              <SwiperSlide
                className={`play_viewer_slide ${getTypeClass(item, index)}`}
                key={item.id}
                ref={(element) => {
                  viewerSlideRefs.current[index] = element;
                }}
              >
                <button type="button" className="play_viewer_slide_btn">
                  {renderPlayMedia(item, item.title)}
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
