import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function AniProvider() {
  const location = useLocation();

  useLayoutEffect(() => {
    const isMagazineTabMove = location.state?.fromMagazineTab === true;
    const aniItems = Array.from(document.querySelectorAll(".ani"));
    const scAniItems = Array.from(document.querySelectorAll(".sc_ani"));
    const initAniItems = Array.from(document.querySelectorAll(".init_ani"));

    if (!aniItems.length && !scAniItems.length && !initAniItems.length) return;

    let canStart = false;

    if (!isMagazineTabMove) {
      aniItems.forEach((item) => {
        if (item.hasAttribute("data-keep-active-on-route") && item.classList.contains("active")) return;
        item.classList.remove("active");
      });

      scAniItems.forEach((item) => {
        item.classList.remove("active");
      });

      initAniItems.forEach((item) => {
        item.classList.remove("active");
      });
    }

    const runExtraAnimation = (item) => {
      if (item.classList.contains("svg")) {
        const animate = item.querySelector("animate");
        if (animate) animate.beginElement();
      }

      if (item.classList.contains("count")) {
        const value = parseInt(item.getAttribute("data-count"), 10);
        let current = 0;
        const duration = 600;
        const step = value / (duration / 10);

        const animateCount = () => {
          current += step;

          if (current < value) {
            item.textContent = Math.ceil(current);
            setTimeout(animateCount, 10);
          } else {
            item.textContent = value;
          }
        };

        animateCount();
      }
    };

    const activeAnimation = (items) => {
      const windowBottom = window.scrollY + window.innerHeight;

      items.forEach((item) => {
        const aniPoint =
          item.getBoundingClientRect().top +
          window.scrollY +
          window.innerHeight / 4;

        if (windowBottom > aniPoint) {
          if (!item.classList.contains("active")) {
            item.classList.add("active");
            runExtraAnimation(item);
          }
        }
      });
    };

    const checkAniAnimation = () => {
      if (!canStart) return;
      activeAnimation(aniItems);
    };

    const checkScAnimation = () => {
      if (!canStart) return;
      activeAnimation(scAniItems);
    };

    const initTimer = setTimeout(() => {
      initAniItems.forEach((item) => {
        item.classList.add("active");
        runExtraAnimation(item);
      });
    }, 1000);

    const timer = setTimeout(() => {
      canStart = true;
      checkAniAnimation();
      checkScAnimation();
    }, 1000);

    window.addEventListener("scroll", checkAniAnimation);
    window.addEventListener("resize", checkAniAnimation);

    window.addEventListener("scroll", checkScAnimation);
    window.addEventListener("resize", checkScAnimation);

    return () => {
      clearTimeout(timer);
      clearTimeout(initTimer);

      window.removeEventListener("scroll", checkAniAnimation);
      window.removeEventListener("resize", checkAniAnimation);

      window.removeEventListener("scroll", checkScAnimation);
      window.removeEventListener("resize", checkScAnimation);
    };
  }, [location.pathname, location.state]);

  return null;
}

export default AniProvider;