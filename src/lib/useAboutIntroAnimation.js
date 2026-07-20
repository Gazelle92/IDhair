import { useEffect } from "react";

const START_YEAR = 1988;
const INTRO_DURATION = 1000;
const INTRO_START_DELAY = 500;
const INTRO_START_DELAY_1 = 10;
const PAGE_SELECTOR = ".page_about";
const INTRO_SELECTOR = ".about_intro";
const INTRO_VIDEO_SELECTOR = ".about_intro video";
const YEARS_WRAP_SELECTOR = ".years_w";
const YEARS_NUMBER_SELECTOR = ".years_num";
const INTRO_ANI_SELECTOR = ".about_intro [data-about-intro-ani]";
const INTRO_ANI_1_SELECTOR = ".about_intro [data-about-intro-ani-1]";
const INTRO_LOADING_CLASS = "intro_loading";
const INTRO_DONE_CLASS = "intro_done";

export default function useAboutIntroAnimation(introVideoUrl) {
  useEffect(() => {
    if (typeof window === "undefined" || !introVideoUrl) return undefined;

    let frameId = null;
    let cancelled = false;
    let started = false;
    let startTimer = null;
    let startTimer1 = null;
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

    function waitForVideo() {
      const video = document.querySelector(INTRO_VIDEO_SELECTOR);

      if (!video || video.readyState >= 3) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        const handleReady = () => {
          cleanup();
          resolve();
        };
        const cleanup = () => {
          video.removeEventListener("canplaythrough", handleReady);
          video.removeEventListener("loadeddata", handleReady);
          video.removeEventListener("error", handleReady);
        };

        video.addEventListener("canplaythrough", handleReady, { once: true });
        video.addEventListener("loadeddata", handleReady, { once: true });
        video.addEventListener("error", handleReady, { once: true });
        video.load();
      });
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
        const displayYear = Math.round(START_YEAR + (currentYear - START_YEAR) * progress);
        const x = targetX * progress;

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
      introElement?.classList.add(INTRO_DONE_CLASS);
      frameId = window.requestAnimationFrame(animateYears);
    }

    function scheduleStartAnimation() {
      if (cancelled || started || startTimer) return;

      startTimer = window.setTimeout(() => {
        startTimer = null;
        activateIntroAni();
        startAnimation();
      }, INTRO_START_DELAY);
    }

    function scheduleIntroAni1() {
      if (cancelled || startTimer1) return;

      startTimer1 = window.setTimeout(() => {
        startTimer1 = null;
        activateIntroAni1();
      }, INTRO_START_DELAY_1);
    }

    async function prepareIntro() {
      introElement = document.querySelector(INTRO_SELECTOR);
      introElement?.classList.add(INTRO_LOADING_CLASS);
      resetIntroAni();

      await waitForVideo();
      await waitForImages();

      if (cancelled) return;

      introElement?.classList.remove(INTRO_LOADING_CLASS);
      scheduleStartAnimation();
      scheduleIntroAni1();
    }

    function activateIntroAni() {
      const aniItems = Array.from(document.querySelectorAll(INTRO_ANI_SELECTOR));

      aniItems.forEach((item) => {
        item.classList.add("active");
      });
    }

    function resetIntroAni() {
      document.querySelectorAll(`${INTRO_ANI_SELECTOR}, ${INTRO_ANI_1_SELECTOR}`).forEach((item) => {
        item.classList.remove("active");
      });
    }

    function activateIntroAni1() {
      document.querySelectorAll(INTRO_ANI_1_SELECTOR).forEach((item) => {
        item.classList.add("active");
      });
    }

    prepareIntro();

    return () => {
      cancelled = true;
      if (startTimer) {
        window.clearTimeout(startTimer);
      }
      if (startTimer1) {
        window.clearTimeout(startTimer1);
      }
      cancelFrame();
      introElement?.classList.remove(INTRO_LOADING_CLASS);
    };
  }, [introVideoUrl]);
}
