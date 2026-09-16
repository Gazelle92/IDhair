import { gsap } from "gsap";

// Read the destination throughout the zoom so rotation cannot leave a stale rectangle.
export function animatePlayRect(timeline, clone, sourceRect, getTarget) {
  const motion = { progress: 0 };
  timeline.to(motion, {
    progress: 1,
    onUpdate: () => {
      const rect = getTarget()?.getBoundingClientRect();
      if (!rect) return;
      const values = {};
      for (const key of ["left", "top", "width", "height"]) {
        values[key] = sourceRect[key] + (rect[key] - sourceRect[key]) * motion.progress;
      }
      gsap.set(clone, values);
    },
  });
}

export function resizePlayViewer(swiper) {
  requestAnimationFrame(() => {
    if (swiper.destroyed) return;
    swiper.update();
    swiper.slideTo(swiper.activeIndex, 0, false);
  });
}
