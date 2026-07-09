import { useEffect } from "react";

const START_YEAR = 1988;
const INTRO_DURATION = 1000;
const PAGE_SELECTOR = ".page_about";
const INTRO_SELECTOR = ".about_intro";
const YEARS_WRAP_SELECTOR = ".years_w";
const YEARS_NUMBER_SELECTOR = ".years_num";
const INTRO_ANI_SELECTOR = ".about_intro .ani";
const INTRO_LOADING_CLASS = "intro_loading";

function ease(value) {
  return 1 - Math.pow(1 - value, 2);
}

export default function useAboutIntroAnimation() {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    let frameId = null;
    let cancelled = false;
    let observer = null;
    let started = false;
    let introElement = null;

    function waitForImages() {
      const pageElement = document.querySelector(PAGE_SELECTOR);
      const images = Array.from(pageElement?.querySelectorAll("img") || []);
      const pendingImages = images.filter((image) => !image.complete);

      if (!pendingImages.length) {
        return Promise.resolve();
      }

      return Promise.all(
        pendingImages.map(
          (image) =>
            new Promise((resolve) => {
              image.addEventListener("load", resolve, { once: true });
              image.addEventListener("error", resolve, { once: true });
            }),
        ),
      );
    }

    function cancelFrame() {
      if (!frameId) return;
      window.cancelAnimationFrame(frameId);
      frameId = null;
    }

    function animateYears() {
      const yearsWrap = document.querySelector(YEARS_WRAP_SELECTOR);
      const yearsNumber = document.querySelector(YEARS_NUMBER_SELECTOR);
      const yearsText = yearsNumber?.querySelector("h2");

      if (!yearsWrap || !yearsNumber || !yearsText) return;

      const currentYear = new Date().getFullYear();
      const targetX = Math.max(0, yearsWrap.clientWidth - yearsNumber.offsetWidth);
      const startTime = performance.now();

      yearsText.textContent = String(START_YEAR);
      yearsNumber.style.transform = "translate3d(0, 0, 0)";
      yearsNumber.style.willChange = "transform";

      function tick(now) {
        if (cancelled) return;

        const progress = Math.min(1, (now - startTime) / INTRO_DURATION);
        const easedProgress = ease(progress);
        const displayYear = Math.round(START_YEAR + (currentYear - START_YEAR) * easedProgress);
        const x = targetX * easedProgress;

        yearsText.textContent = String(displayYear);
        yearsNumber.style.transform = `translate3d(${x}px, 0, 0)`;

        if (progress < 1) {
          frameId = window.requestAnimationFrame(tick);
        } else {
          yearsText.textContent = String(currentYear);
          yearsNumber.style.transform = `translate3d(${targetX}px, 0, 0)`;
          yearsNumber.style.willChange = "";
        }
      }

      frameId = window.requestAnimationFrame(tick);
    }

    function startAnimation() {
      if (cancelled || started) return;

      started = true;
      introElement = document.querySelector(INTRO_SELECTOR);
      introElement?.classList.add("intro_start");
      observer?.disconnect();
      frameId = window.requestAnimationFrame(animateYears);
    }

    async function prepareIntro() {
      introElement = document.querySelector(INTRO_SELECTOR);
      introElement?.classList.add(INTRO_LOADING_CLASS);

      await waitForImages();

      if (cancelled) return;

      introElement?.classList.remove(INTRO_LOADING_CLASS);
      watchIntroAniActive();
    }

    function watchIntroAniActive() {
      const aniItems = Array.from(document.querySelectorAll(INTRO_ANI_SELECTOR));

      if (!aniItems.length || aniItems.some((item) => item.classList.contains("active"))) {
        startAnimation();
        return;
      }

      observer = new MutationObserver(() => {
        if (aniItems.some((item) => item.classList.contains("active"))) {
          startAnimation();
        }
      });

      aniItems.forEach((item) => {
        observer.observe(item, { attributes: true, attributeFilter: ["class"] });
      });
    }

    prepareIntro();

    return () => {
      cancelled = true;
      cancelFrame();
      observer?.disconnect();
      introElement?.classList.remove(INTRO_LOADING_CLASS);
      introElement?.classList.remove("intro_start");
    };
  }, []);
}
