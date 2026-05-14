import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function AniProvider() {
  const location = useLocation();

  useEffect(() => {
    const aniItems = Array.from(document.querySelectorAll(".ani"));

    if (!aniItems.length) return;

    const isInView = (el) => {
      const rect = el.getBoundingClientRect();

      return (
        rect.top < window.innerHeight * 0.85 &&
        rect.bottom > 0
      );
    };

    // 페이지 바뀌거나 새로고침됐을 때 기존 active 제거
    aniItems.forEach((item) => {
      item.classList.remove("active");
    });

    // 처음 화면 안에 보이는 애들
    const firstViewItems = aniItems.filter((item) => isInView(item));

    // 처음 화면 밖에 있는 애들
    const scrollItems = aniItems.filter((item) => !isInView(item));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
      }
    );

    // 화면 밖에 있는 애들은 바로 감시 시작
    // 그래서 스크롤할 때는 딜레이 없음
    scrollItems.forEach((item) => {
      observer.observe(item);
    });

    // 처음 보이는 애들만 0.3초 후 active
    const timer = setTimeout(() => {
      firstViewItems.forEach((item) => {
        item.classList.add("active");
      });
    }, 300);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [location.pathname]);

  return null;
}

export default AniProvider;