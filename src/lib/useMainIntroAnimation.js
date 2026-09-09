import { useEffect } from "react";

const INTRO_SCALE_DURATION = 1000;
const INTRO_OPEN_DELAY = 800;
const INTRO_TEXT_START_SCALE = 0.4;

export default function useMainIntroAnimation(sceneRef, ready) {
  useEffect(() => {
    if (!ready || !sceneRef.current) return;

    const scene = sceneRef.current;
    const panel = scene.querySelector(".main_story_panel_1");
    const picture = panel.querySelector(".main_story_background picture");
    const text = panel.querySelector("[data-main-intro-ani]");
    const controller = new AbortController();
    const { signal } = controller;
    let scaleAnimation;
    let openTimer;
    let frameId;

    function waitForEvent(target, events) {
      return new Promise((resolve) => {
        const finish = () => {
          events.forEach((event) => target.removeEventListener(event, finish));
          signal.removeEventListener("abort", finish);
          resolve();
        };
        events.forEach((event) => target.addEventListener(event, finish, { once: true }));
        signal.addEventListener("abort", finish, { once: true });
      });
    }

    async function start() {
      const images = [...scene.closest(".page_main").querySelectorAll("img")];
      await Promise.all([
        document.readyState === "complete" ? Promise.resolve() : waitForEvent(window, ["load"]),
        document.fonts.ready,
        ...images.map(async (image) => {
          if (!image.complete) await waitForEvent(image, ["load", "error"]);
          if (!signal.aborted) await image.decode().catch(() => {});
        }),
      ]);
      if (signal.aborted) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      scaleAnimation = picture.animate(
        [{ transform: "scale(0.3)" }, { transform: "scale(1)" }],
        { duration: reducedMotion ? 0 : INTRO_SCALE_DURATION, easing: "ease", fill: "forwards" },
      );
      function checkScale() {
        if (signal.aborted) return;
        const progress = scaleAnimation.effect.getComputedTiming().progress ?? 0;
        const scale = 0.3 + (1 - 0.3) * progress;

        if (scale >= INTRO_TEXT_START_SCALE) {
          text.classList.add("active");
          openTimer = window.setTimeout(() => {
            if (!signal.aborted) panel.classList.add("open");
          }, INTRO_OPEN_DELAY);
          return;
        }
        frameId = window.requestAnimationFrame(checkScale);
      }
      frameId = window.requestAnimationFrame(checkScale);
    }

    start();
    return () => {
      controller.abort();
      window.clearTimeout(openTimer);
      window.cancelAnimationFrame(frameId);
      scaleAnimation?.cancel();
      text.classList.remove("active");
      panel.classList.remove("open");
    };
  }, [sceneRef, ready]);
}
