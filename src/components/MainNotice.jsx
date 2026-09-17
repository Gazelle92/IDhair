import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay } from "swiper/modules";
import { fetchMainBanners } from "../lib/sanityNews";
import "swiper/css";

const safeLink = (value) => {
  if (!value) return undefined;
  try {
    const url = new URL(value, window.location.origin);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) ? url.href : undefined;
  } catch { return undefined; }
};

export default function MainNotice() {
  const previewEmptyNotice = import.meta.env.DEV
    && new URLSearchParams(window.location.search).get("previewNotice") === "1";
  const [banners, setBanners] = useState([]);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const swiperRef = useRef(null);

  useEffect(() => {
    let active = true;
    fetchMainBanners().then((items) => {
      if (active) setBanners(Array.isArray(items) ? items : []);
    }).catch((error) => console.error("Failed to load main banners", error));
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motion.matches);
    motion.addEventListener("change", updateMotion);
    return () => { active = false; motion.removeEventListener("change", updateMotion); };
  }, []);

  const visibleBanners = previewEmptyNotice
    ? [{ _id: "local-preview", title: "\u00a0", content: "\u00a0" }]
    : banners;

  if (!visibleBanners.length) return null;

  return (
    <div className="main_story_notice" role="region" aria-label="메인 공지 배너"
      onFocusCapture={() => swiperRef.current?.autoplay?.stop()}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget) && !reducedMotion && visibleBanners.length > 1) swiperRef.current?.autoplay?.start();
      }}>
      <Swiper className="main_notice_slider" modules={[A11y, Autoplay]}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        slidesPerView={1} loop={visibleBanners.length > 1} speed={reducedMotion ? 0 : 1500}
        autoplay={!reducedMotion && visibleBanners.length > 1 ? { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}>
        {visibleBanners.map((banner) => {
          const href = safeLink(banner.url);
          const Tag = href ? "a" : "div";
          return <SwiperSlide key={banner._id}>
            <Tag className="main_notice_slide" href={href}>
              <strong className="body-m fw-sb">{banner.title}</strong>
              <span className="caption-m fw-r">{banner.content}</span>
            </Tag>
          </SwiperSlide>;
        })}
      </Swiper>
      <div className="main_story_notice_arrow">
        <button type="button" aria-label="다음 배너" onClick={() => swiperRef.current?.slideNext()}><img src="/img/arrow_right_s.svg" alt="" /></button>
        <button type="button" aria-label="이전 배너" onClick={() => swiperRef.current?.slidePrev()}><img src="/img/arrow_right_s.svg" alt="" /></button>
      </div>
    </div>
  );
}
