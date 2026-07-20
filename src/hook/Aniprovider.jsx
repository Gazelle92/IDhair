import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const MOBILE_ANI_QUERY = "(max-width: 1024px)";
const MANUAL_ANI_SELECTOR = "[data-about-intro-ani], [data-about-intro-ani-1]";

function AniProvider() {
  const location = useLocation();

  useLayoutEffect(() => {
    const isMagazineTabMove = location.state?.fromMagazineTab === true;
    const aniItems = Array.from(document.querySelectorAll(".ani"));
    const scAniItems = Array.from(document.querySelectorAll(".sc_ani"));
    const mobAniItems = Array.from(document.querySelectorAll(".mob_ani"));
    const initAniItems = Array.from(document.querySelectorAll(".init_ani"));
    const mobileAniMedia = window.matchMedia(MOBILE_ANI_QUERY);

    if (!aniItems.length && !scAniItems.length && !mobAniItems.length && !initAniItems.length) return;

    let canStart = false;

    const clearMobAnimation = () => {
      document.querySelectorAll(".mob_ani.active, .mob_ani .active").forEach((item) => {
        item.classList.remove("active");
      });
    };

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

      clearMobAnimation();
    }

    if (isMagazineTabMove) {
      aniItems.forEach((item) => {
        if (item.classList.contains("fade-slice")) {
          item.classList.remove("active");

          // 강제로 브라우저가 active 제거를 인식하게 함
          void item.offsetWidth;
        }
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

    const initTimer = setTimeout(() => {
      initAniItems.forEach((item) => {
        item.classList.add("active");
        runExtraAnimation(item);
      });
    }, 1000);

    const activeAnimation = (items) => {
      const windowBottom = window.scrollY + window.innerHeight;

      items.forEach((item) => {
        if (item.matches(MANUAL_ANI_SELECTOR)) return;

        const aniPoint =
          item.getBoundingClientRect().top +
          window.scrollY +
          window.innerHeight / 6;

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
      activeAnimation(Array.from(document.querySelectorAll(".ani")));
    };

    const checkScAnimation = () => {
      activeAnimation(Array.from(document.querySelectorAll(".sc_ani")));
    };

    const checkMobAnimation = () => {
      if (!canStart || !mobileAniMedia.matches) return;
      activeAnimation(Array.from(document.querySelectorAll(".mob_ani")));
    };

    const handleMobResize = () => {
      clearMobAnimation();
      checkMobAnimation();
    };

    const timer = setTimeout(() => {
      canStart = true;

      aniItems.forEach((item) => {
        if (isMagazineTabMove && item.classList.contains("fade-slice")) {
          item.classList.add("active");
          runExtraAnimation(item);
        }
      });

      checkAniAnimation();
      checkMobAnimation();
    }, 1000);

    window.addEventListener("scroll", checkAniAnimation);
    window.addEventListener("resize", checkAniAnimation);

    window.addEventListener("scroll", checkScAnimation);
    window.addEventListener("resize", checkScAnimation);

    window.addEventListener("scroll", checkMobAnimation);
    window.addEventListener("resize", handleMobResize);

    return () => {
      clearTimeout(timer);
      clearTimeout(initTimer);

      window.removeEventListener("scroll", checkAniAnimation);
      window.removeEventListener("resize", checkAniAnimation);

      window.removeEventListener("scroll", checkScAnimation);
      window.removeEventListener("resize", checkScAnimation);

      window.removeEventListener("scroll", checkMobAnimation);
      window.removeEventListener("resize", handleMobResize);
    };
  }, [location.pathname, location.state]);

  return null;
}

export default AniProvider;
