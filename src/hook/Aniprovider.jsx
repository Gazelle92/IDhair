import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function AniProvider() {
  const location = useLocation();

  useEffect(() => {
    const aniItems = Array.from(document.querySelectorAll(".ani"));

    if (!aniItems.length) return;

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

    const checkAnimation = () => {
      const windowBottom = window.scrollY + window.innerHeight;

      aniItems.forEach((item) => {
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

    aniItems.forEach((item) => {
      item.classList.remove("active");
    });

    setTimeout(checkAnimation, 300);

    window.addEventListener("scroll", checkAnimation);
    window.addEventListener("resize", checkAnimation);

    return () => {
      window.removeEventListener("scroll", checkAnimation);
      window.removeEventListener("resize", checkAnimation);
    };
  }, [location.pathname]);

  return null;
}

export default AniProvider;