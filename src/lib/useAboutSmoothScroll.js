import { useEffect, useState } from "react";

const FRAME_RATE = 150;
const ANIMATION_TIME = 1600;
const DEFAULT_STEP_SIZE = 80;
const SAFARI_STEP_SIZE = 80;
const MAX_COMBINED_SCROLL = 4;
const PULSE_SCALE = 4;
const ACCELERATION_DELTA = 60;
const ACCELERATION_MAX = 1;
const ARROW_SCROLL = 50;
const MOBILE_VERTICAL_QUERY = "(max-width: 1024px)";
const TRACK_SELECTOR = "[data-about-horizontal-track]";
const ABOUT_HORIZONTAL_SCROLL_EVENT = "about-horizontal-scroll";
const PINNED_SECTION_SELECTOR = ".as_3";
const HORIZONTAL_ANI_SELECTOR = ".ani_x";
const TEXT_MOTION_WRAP_SELECTOR = ".t_m_w";
const SECTION_PROGRESS_SELECTOR = ".as_6_1";
const SECTION_PROGRESS_WRAP_SELECTOR = ".as_6";
const SECTION_PROGRESS_BG_SELECTOR = ".as_6_bg_w";
const SECTION_PROGRESS_TEXT_SELECTOR = ".as_6_text";
const SECTION_FIXED_LAYER_SELECTOR = ".as_4";
const SECTION_FIXED_LAYER_EL_SELECTOR = ".as_4_bg_1";
const BACKGROUND_MOTION_WRAP_SELECTOR = ".t_m_bg_w";
const BACKGROUND_MOTION_EL_SELECTOR = ".t_m_bg_el";
const BACKGROUND_MOTION_SPEED = 0.7;
const CARD_IMAGE_WRAP_SELECTOR = ".card_w, .as_8 .img_w";
const CARD_IMAGE_SELECTOR = ":scope > img";
const CARD_IMAGE_MAX_MOVE = 20;
const BACKGROUND_MOTION_ITEMS = [
  {
    wrapSelector: BACKGROUND_MOTION_WRAP_SELECTOR,
    elSelector: BACKGROUND_MOTION_EL_SELECTOR,
    speed: BACKGROUND_MOTION_SPEED,
  },
];
const TEXT_MOTION_ITEMS = [
  { selector: ".t_m_1", speed: 0.08 },
  { selector: ".t_m_2", speed: 0.14 },
  { selector: ".t_m_3", speed: 0.2 },
  { selector: ".t_m_4", speed: 0.26 },
  { selector: ".t_m_5", speed: 0.32 },
  { selector: ".t_m_6", speed: 0.38 },
];

const KEY_CODES = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  spacebar: 32,
  pageup: 33,
  pagedown: 34,
  end: 35,
  home: 36,
};

function isEditableElement(element) {
  if (!element) return false;

  const tagName = element.tagName?.toLowerCase();

  return (
    element.isContentEditable ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
  );
}

function pulse(value, normalizerRef) {
  let scaledValue = value * PULSE_SCALE;
  let pulsed;

  if (scaledValue < 1) {
    pulsed = scaledValue - (1 - Math.exp(-scaledValue));
  } else {
    const start = Math.exp(-1);
    scaledValue -= 1;
    pulsed = start + (1 - Math.exp(-scaledValue)) * (1 - start);
  }

  return pulsed * normalizerRef.current;
}

function pulseEase(value, normalizerRef) {
  if (value >= 1) return 1;
  if (value <= 0) return 0;

  if (normalizerRef.current === 1) {
    normalizerRef.current /= pulse(1, { current: 1 });
  }

  return pulse(value, normalizerRef);
}

function normalizeStepDelta(value, stepSize) {
  const absValue = Math.abs(value);

  if (absValue >= 100 && absValue < 200) {
    return Math.sign(value) * stepSize;
  }

  return absValue > 1.2 ? value * (stepSize / 120) : value;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function useAboutSmoothScroll() {
  const [isMobileVertical, setIsMobileVertical] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(MOBILE_VERTICAL_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mobileVerticalMedia = window.matchMedia(MOBILE_VERTICAL_QUERY);

    function updateMode(event) {
      setIsMobileVertical(event.matches);
    }

    mobileVerticalMedia.addEventListener("change", updateMode);

    return () => {
      mobileVerticalMedia.removeEventListener("change", updateMode);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const stepSize = isSafari ? SAFARI_STEP_SIZE : DEFAULT_STEP_SIZE;
    const pulseNormalizerRef = { current: 1 };

    let queue = [];
    let animating = false;
    let horizontalX = 0;
    let lastDirection = { x: 0, y: 0 };
    let lastWheelTime = Date.now();
    let frameId = null;
    let previousLenis = null;
    let previousHtmlOverflow = "";
    let previousBodyOverflow = "";
    let previousBodyOverscroll = "";

    function dispatchHorizontalScroll() {
      window.dispatchEvent(
        new CustomEvent(ABOUT_HORIZONTAL_SCROLL_EVENT, {
          detail: { x: horizontalX },
        }),
      );
    }

    function clearTrackTransform() {
      const track = document.querySelector(TRACK_SELECTOR);
      if (track) {
        track.style.transform = "";
      }
    }

    function getTrack() {
      const element = document.querySelector(TRACK_SELECTOR);
      if (!element) return null;

      return {
        element,
        maxX: Math.max(0, element.scrollWidth - window.innerWidth),
      };
    }

    function isScrollable(deltaX, deltaY) {
      const track = getTrack();
      const maxY = document.documentElement.scrollHeight - window.innerHeight;

      return (
        (track && deltaX < 0 && horizontalX > 0) ||
        (track && deltaX > 0 && horizontalX < track.maxX) ||
        (deltaY < 0 && window.scrollY > 0) ||
        (deltaY > 0 && window.scrollY < maxY)
      );
    }

    function applyScroll(deltaX, deltaY) {
      const track = getTrack();

      if (track?.maxX > 0 && deltaX !== 0) {
        horizontalX = Math.min(track.maxX, Math.max(0, horizontalX + deltaX));
        track.element.style.transform = `translate3d(${-horizontalX}px, 0, 0)`;
        applyPinnedSections(track.element);
        applyTextMotion(track.element);
        applyBackgroundMotion(track.element);
        applyCardImageMotion(track.element);
        applySectionFixedLayer(track.element);
        applySectionProgress(track.element);
        applyHorizontalAnimation();
        dispatchHorizontalScroll();
      }

      if (deltaY !== 0) {
        window.scrollBy(0, deltaY);
      }
    }

    function applyPinnedSections(trackElement) {
      trackElement.querySelectorAll(PINNED_SECTION_SELECTOR).forEach((section) => {
        const sectionStartX = section.offsetLeft;
        const sectionWidth = section.offsetWidth;
        const pinStartX = sectionStartX + sectionWidth - window.innerWidth;
        const pinOffset = Math.max(0, horizontalX - pinStartX);

        //section.style.transform = pinOffset > 0 ? `translate3d(${pinOffset}px, 0, 0)` : "";
      });
    }

    function clearPinnedSections() {
      document.querySelectorAll(PINNED_SECTION_SELECTOR).forEach((section) => {
        section.style.transform = "";
      });
    }

    function applyTextMotion(trackElement) {
      const wrappers = Array.from(trackElement.querySelectorAll(TEXT_MOTION_WRAP_SELECTOR));
      const trackRect = trackElement.getBoundingClientRect();

      wrappers.forEach((wrapper) => {
        const wrapperRect = wrapper.getBoundingClientRect();
        const wrapperStartX = wrapperRect.left - trackRect.left;
        const distanceFromStart = wrapperStartX - horizontalX;

        TEXT_MOTION_ITEMS.forEach(({ selector, speed }) => {
          wrapper.querySelectorAll(selector).forEach((item) => {
            if (item.closest(TEXT_MOTION_WRAP_SELECTOR) !== wrapper) return;
            item.style.transform = `translate3d(${distanceFromStart * speed}px, 0, 0)`;
          });
        });
      });
    }

    function clearTextMotion() {
      document
        .querySelectorAll(TEXT_MOTION_ITEMS.map(({ selector }) => selector).join(","))
        .forEach((item) => {
          item.style.transform = "";
        });
    }

    function applyBackgroundMotion(trackElement) {
      const trackRect = trackElement.getBoundingClientRect();

      BACKGROUND_MOTION_ITEMS.forEach(({ wrapSelector, elSelector, speed }) => {
        const wrappers = Array.from(trackElement.querySelectorAll(wrapSelector));

        wrappers.forEach((wrapper) => {
          const wrapperRect = wrapper.getBoundingClientRect();
          const wrapperStartX = wrapperRect.left - trackRect.left;
          const distanceFromLeft = wrapperStartX - horizontalX;
          const moveX = -distanceFromLeft * speed;

          wrapper.querySelectorAll(elSelector).forEach((item) => {
            if (item.closest(wrapSelector) !== wrapper) return;
            item.style.transform = `translate3d(${moveX}px, 0, 0)`;
          });
        });
      });
    }

    function clearBackgroundMotion() {
      BACKGROUND_MOTION_ITEMS.forEach(({ elSelector }) => {
        document.querySelectorAll(elSelector).forEach((item) => {
          item.style.transform = "";
        });
      });
    }

    function applyMobileBackgroundMotion() {
      BACKGROUND_MOTION_ITEMS.forEach(({ wrapSelector, elSelector, speed }) => {
        const wrappers = Array.from(document.querySelectorAll(wrapSelector));

        wrappers.forEach((wrapper) => {
          const wrapperRect = wrapper.getBoundingClientRect();
          const moveY = -wrapperRect.top * speed;

          wrapper.querySelectorAll(elSelector).forEach((item) => {
            if (item.closest(wrapSelector) !== wrapper) return;
            item.style.transform = `translate3d(0, ${moveY}px, 0)`;
          });
        });
      });
    }

    function applyCardImageMotion(trackElement) {
      trackElement.querySelectorAll(CARD_IMAGE_WRAP_SELECTOR).forEach((card) => {
        const rect = card.getBoundingClientRect();
        const progress = clamp((window.innerWidth - rect.left) / window.innerWidth, 0, 1);
        const moveX = -progress * CARD_IMAGE_MAX_MOVE;

        card.querySelectorAll(CARD_IMAGE_SELECTOR).forEach((image) => {
          image.style.transform = `translate3d(${moveX}%, 0, 0)`;
        });
      });
    }

    function clearCardImageMotion() {
      document.querySelectorAll(".card_w > img, .as_8 .img_w > img").forEach((image) => {
        image.style.transform = "";
      });
    }

    function applySectionFixedLayer(trackElement) {
      trackElement.querySelectorAll(SECTION_FIXED_LAYER_SELECTOR).forEach((section) => {
        const rect = section.getBoundingClientRect();

        section.querySelectorAll(SECTION_FIXED_LAYER_EL_SELECTOR).forEach((layer) => {
          layer.style.transform = `translate3d(${-rect.left}px, 0, 0)`;
        });
      });
    }

    function clearSectionFixedLayer() {
      document.querySelectorAll(SECTION_FIXED_LAYER_EL_SELECTOR).forEach((layer) => {
        layer.style.transform = "";
      });
    }

    function applySectionProgress(trackElement) {
      trackElement.querySelectorAll(SECTION_PROGRESS_SELECTOR).forEach((section) => {
        const rect = section.getBoundingClientRect();
        const progress = clamp(-rect.left / rect.width, 0, 1);

        section.querySelectorAll(SECTION_PROGRESS_BG_SELECTOR).forEach((item) => {
          const scale = 1 - progress * 0.5;

          item.style.filter = `grayscale(${progress})`;
          item.style.transform = `translate3d(${-rect.left}px, 0, 0) scale(${scale})`;
        });

        section.querySelectorAll(SECTION_PROGRESS_TEXT_SELECTOR).forEach((item) => {
          item.style.opacity = progress;
          item.style.transform = `translate3d(${-rect.left}px, 0, 0)`;
        });
      });
    }

    function applyMobileSectionProgress() {
      document.querySelectorAll(SECTION_PROGRESS_WRAP_SELECTOR).forEach((section) => {
        const rect = section.getBoundingClientRect();
        const progressDistance = Math.max(1, rect.height - window.innerHeight);
        const progress = clamp(-rect.top / progressDistance, 0, 1);

        section.querySelectorAll(SECTION_PROGRESS_BG_SELECTOR).forEach((item) => {
          const scale = 1 - progress * 0.5;

          item.style.filter = `grayscale(${progress})`;
          item.style.transform = `scale(${scale})`;
        });

        section.querySelectorAll(SECTION_PROGRESS_TEXT_SELECTOR).forEach((item) => {
          item.style.opacity = progress;
          item.style.transform = "";
        });
      });
    }

    function clearSectionProgress() {
      document.querySelectorAll(SECTION_PROGRESS_BG_SELECTOR).forEach((item) => {
        item.style.filter = "";
        item.style.transform = "";
      });

      document.querySelectorAll(SECTION_PROGRESS_TEXT_SELECTOR).forEach((item) => {
        item.style.opacity = "";
        item.style.transform = "";
      });
    }

    function resetHorizontalAnimation() {
      document.querySelectorAll(HORIZONTAL_ANI_SELECTOR).forEach((item) => {
        item.classList.remove("active");
      });
    }

    function applyHorizontalAnimation() {
      const triggerX = window.innerWidth * (5 / 6);

      document.querySelectorAll(HORIZONTAL_ANI_SELECTOR).forEach((item) => {
        if (item.classList.contains("active")) return;

        const rect = item.getBoundingClientRect();
        const isInTriggerRange = rect.left < triggerX && rect.right > 0;

        if (isInTriggerRange) {
          item.classList.add("active");
        }
      });
    }

    function applyVerticalAnimation() {
      const triggerY = window.innerHeight * (5 / 6);

      document.querySelectorAll(HORIZONTAL_ANI_SELECTOR).forEach((item) => {
        if (item.classList.contains("active")) return;

        const rect = item.getBoundingClientRect();
        const isInTriggerRange = rect.top < triggerY && rect.bottom > 0;

        if (isInTriggerRange) {
          item.classList.add("active");
        }
      });
    }

    function scheduleFrame(callback) {
      frameId = window.setTimeout(callback, 1000 / FRAME_RATE + 1);
    }

    function cancelFrame() {
      if (!frameId) return;
      window.clearTimeout(frameId);
      frameId = null;
    }

    function smoothScroll(deltaX, deltaY) {
      const directionX = deltaX > 0 ? 1 : -1;
      const directionY = deltaY > 0 ? 1 : -1;

      if (lastDirection.x !== directionX || lastDirection.y !== directionY) {
        lastDirection = { x: directionX, y: directionY };
        queue = [];
        lastWheelTime = 0;
      }

      if (ACCELERATION_MAX !== 1) {
        const elapsed = Date.now() - lastWheelTime;

        if (elapsed > 0 && elapsed < ACCELERATION_DELTA) {
          const acceleration = Math.min((1 + 50 / elapsed) / 2, ACCELERATION_MAX);
          deltaX *= acceleration;
          deltaY *= acceleration;
        }

        lastWheelTime = Date.now();
      }

      queue.push({
        x: deltaX,
        y: deltaY,
        lastX: deltaX < 0 ? 0.99 : -0.99,
        lastY: deltaY < 0 ? 0.99 : -0.99,
        start: Date.now(),
      });

      if (animating) return;

      const step = () => {
        const now = Date.now();
        let scrollX = 0;
        let scrollY = 0;

        for (let index = 0; index < queue.length; index += 1) {
          const item = queue[index];
          const elapsed = now - item.start;
          const finished = elapsed >= ANIMATION_TIME;
          const progress = finished ? 1 : elapsed / ANIMATION_TIME;
          const easing = pulseEase(progress, pulseNormalizerRef);
          const x = (item.x * easing - item.lastX) >> 0;
          const y = (item.y * easing - item.lastY) >> 0;

          scrollX += x;
          scrollY += y;
          item.lastX += x;
          item.lastY += y;

          if (finished) {
            queue.splice(index, 1);
            index -= 1;
          }
        }

        scrollX = clamp(scrollX, -MAX_COMBINED_SCROLL, MAX_COMBINED_SCROLL);
        scrollY = clamp(scrollY, -MAX_COMBINED_SCROLL, MAX_COMBINED_SCROLL);
        applyScroll(scrollX, scrollY);

        if (queue.length) {
          scheduleFrame(step);
        } else {
          animating = false;
          frameId = null;
        }
      };

      animating = true;
      scheduleFrame(step);
    }

    function normalizeWheel(event) {
      let deltaX = -event.wheelDeltaX || event.deltaX || 0;
      let deltaY = -event.wheelDeltaY || event.deltaY || 0;

      if (!deltaY && !deltaX) {
        deltaY = -event.wheelDelta || 0;
      }

      if (event.deltaMode === 1) {
        deltaX *= 40;
        deltaY *= 40;
      } else if (event.deltaMode === 2) {
        deltaX *= window.innerWidth;
        deltaY *= window.innerHeight;
      }

      deltaX = normalizeStepDelta(deltaX, stepSize);
      deltaY = normalizeStepDelta(deltaY, stepSize);

      return { deltaX, deltaY };
    }

    function onWheel(event) {
      if (event.defaultPrevented || event.ctrlKey || isEditableElement(event.target)) return;

      const { deltaX, deltaY } = normalizeWheel(event);
      const track = getTrack();
      const targetDeltaX = track?.maxX > 0 && Math.abs(deltaY) >= Math.abs(deltaX) ? deltaY : deltaX;
      const targetDeltaY = track?.maxX > 0 ? 0 : deltaY;

      if (!isScrollable(targetDeltaX, targetDeltaY)) return;

      event.preventDefault();
      event.stopPropagation();
      smoothScroll(targetDeltaX, targetDeltaY);
    }

    function onKeyDown(event) {
      if (event.defaultPrevented || isEditableElement(event.target)) return;

      let deltaX;
      let deltaY;
      const track = getTrack();
      const horizontalMode = track?.maxX > 0;

      switch (event.keyCode) {
        case KEY_CODES.up:
        case KEY_CODES.left:
          deltaX = horizontalMode ? -ARROW_SCROLL : 0;
          deltaY = horizontalMode ? 0 : -ARROW_SCROLL;
          break;
        case KEY_CODES.down:
        case KEY_CODES.right:
          deltaX = horizontalMode ? ARROW_SCROLL : 0;
          deltaY = horizontalMode ? 0 : ARROW_SCROLL;
          break;
        case KEY_CODES.spacebar:
        case KEY_CODES.pagedown:
          deltaX = horizontalMode ? window.innerWidth * 0.9 : 0;
          deltaY = horizontalMode ? 0 : window.innerHeight * 0.9;
          break;
        case KEY_CODES.pageup:
          deltaX = horizontalMode ? -window.innerWidth * 0.9 : 0;
          deltaY = horizontalMode ? 0 : -window.innerHeight * 0.9;
          break;
        case KEY_CODES.home:
          deltaX = horizontalMode ? -horizontalX : 0;
          deltaY = horizontalMode ? 0 : -window.scrollY;
          break;
        case KEY_CODES.end:
          deltaX = horizontalMode ? track.maxX - horizontalX : 0;
          deltaY = horizontalMode ? 0 : document.documentElement.scrollHeight;
          break;
        default:
          return;
      }

      if (!isScrollable(deltaX, deltaY)) return;

      event.preventDefault();
      event.stopPropagation();
      smoothScroll(deltaX, deltaY);
    }

    if (isMobileVertical) {
      clearTrackTransform();
      horizontalX = 0;
      dispatchHorizontalScroll();
      clearPinnedSections();
      clearTextMotion();
      clearBackgroundMotion();
      clearCardImageMotion();
      clearSectionFixedLayer();
      clearSectionProgress();
      resetHorizontalAnimation();
      applyVerticalAnimation();
      applyMobileBackgroundMotion();
      applyMobileSectionProgress();

      function applyMobileScrollEffects() {
        applyVerticalAnimation();
        applyMobileBackgroundMotion();
        applyMobileSectionProgress();
      }

      const removeLenisMobileScroll = window.lenis?.on?.("scroll", applyMobileScrollEffects);
      if (!removeLenisMobileScroll) {
        window.addEventListener("scroll", applyMobileScrollEffects, { passive: true });
      }
      window.addEventListener("resize", applyMobileScrollEffects);

      return () => {
        removeLenisMobileScroll?.();
        if (!removeLenisMobileScroll) {
          window.removeEventListener("scroll", applyMobileScrollEffects);
        }
        window.removeEventListener("resize", applyMobileScrollEffects);
        clearBackgroundMotion();
        clearSectionProgress();
      };
    }

    previousLenis = window.lenis;
    previousHtmlOverflow = document.documentElement.style.overflow;
    previousBodyOverflow = document.body.style.overflow;
    previousBodyOverscroll = document.body.style.overscrollBehavior;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    previousLenis?.stop?.();
    resetHorizontalAnimation();

    const initialTrack = getTrack();
    if (initialTrack?.element) {
      applyPinnedSections(initialTrack.element);
      applyTextMotion(initialTrack.element);
      applyBackgroundMotion(initialTrack.element);
      applyCardImageMotion(initialTrack.element);
      applySectionFixedLayer(initialTrack.element);
      applySectionProgress(initialTrack.element);
    }
    applyHorizontalAnimation();
    dispatchHorizontalScroll();

    document.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("keydown", onKeyDown, { passive: false });

    return () => {
      queue = [];
      animating = false;
      cancelFrame();
      document.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscroll;
      horizontalX = 0;
      dispatchHorizontalScroll();
      clearPinnedSections();
      clearTextMotion();
      clearBackgroundMotion();
      clearCardImageMotion();
      clearSectionFixedLayer();
      clearSectionProgress();
      previousLenis?.start?.();
    };
  }, [isMobileVertical]);
}
