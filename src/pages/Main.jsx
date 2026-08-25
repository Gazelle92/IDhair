import { useEffect, useRef } from "react";
import TransitionLink from "../components/TransitionLink";
import "../styles/main.scss";

const MAIN_STORIES = [
  {
    background: "/img/main_1_1_bg.jpg",
    backgroundAlt: "id HAIR MY IDENTITY campaign",
    cards: ["/img/main_1_1.jpg", "/img/main_1_2.jpg", "/img/main_1_3.jpg"],
    theme: "green",
  },
  {
    background: "/img/main_1_2_bg.jpg",
    backgroundAlt: "id HAIR MY IDENTITY white campaign",
    cards: ["/img/main_2_1.jpg", "/img/main_2_2.jpg", "/img/main_2_3.jpg"],
    theme: "white",
  },
];

const MAIN_NEWS = [
  {
    date: "2026.03.10",
    dateTime: "2026-03-10",
    image: "/img/mg_list_1.jpg",
    title: <>새로운 브랜드 캠페인을 통해 선보이는<br />아이디헤어의 방향성과 감각</>,
  },
  {
    date: "2026.02.20",
    dateTime: "2026-02-20",
    image: "/img/mg_list_2.jpg",
    title: <>아이디헤어가 새롭게 제안하는<br />2026 시즌 헤어 트렌드</>,
  },
  {
    date: "2026.01.15",
    dateTime: "2026-01-15",
    image: "/img/mg_list_3.jpg",
    title: <>일상 속 아름다움을 완성하는<br />아이디헤어의 새로운 이야기</>,
  },
];

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const getRangeProgress = (progress, start, end) =>
  clamp((progress - start) / Math.max(0.001, end - start));

const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

function MainStoryPanel({ story, index }) {
  return (
    <div className={`main_story_panel main_story_panel_${index + 1} theme_${story.theme}`}>
      <div className="main_story_background">
        <img src={story.background} alt={story.backgroundAlt} />
      </div>
      <div className="main_story_shade" aria-hidden="true" />

      <div className="main_story_copy apprael_all display-l" aria-hidden="true">
        <span>MY<br/>IDENTITY</span>
        <span>MY<br/>id HAIR</span>
      </div>

      <div className="main_story_cards">
        {story.cards.map((source, cardIndex) => (
          <div
            className={`main_story_card_slot main_story_card_slot_${cardIndex + 1}`}
            key={source}
          >
            <figure
              className="main_story_card"
              data-direction={cardIndex % 2 === 0 ? "1" : "-1"}
            >
              <img src={source} alt={`id HAIR campaign cut ${cardIndex + 1}`} />
            </figure>
          </div>
        ))}
      </div>

      {index === 0 && (
        <div className="main_story_notice">
          <div>
            <strong>2026 상반기 신입 디자이너 채용</strong>
            <span>2026 아이디헤어와 함께<br />새로운 시선으로 변화를 만들 디자이너를 기다립니다.</span>
          </div>
          <div className="main_story_notice_arrow" aria-hidden="true">
            <span>→</span>
            <span>←</span>
          </div>
        </div>
      )}

      <div className="main_story_scroll body-s" aria-hidden="true">
        <span>[ SCROLL ]</span>
        <i />
      </div>
    </div>
  );
}

function Main() {
  const sceneRef = useRef(null);
  const newsRevealRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) return undefined;

    const panels = [...scene.querySelectorAll(".main_story_panel")];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = null;

    const updatePanel = (panel, progress) => {
      const background = panel.querySelector(".main_story_background img");
      const shade = panel.querySelector(".main_story_shade");
      const cards = [...panel.querySelectorAll(".main_story_card")];
      const notice = panel.querySelector(".main_story_notice");
      const scrollIndicator = panel.querySelector(".main_story_scroll");
      const blurProgress = easeOutCubic(getRangeProgress(progress, 0.1, 0.38));

      background.style.filter = `blur(${blurProgress * 12}px) brightness(${1 - blurProgress * 0.42})`;
      background.style.transform = `scale(${1 + blurProgress * 0.04})`;
      shade.style.opacity = String(blurProgress * 0.12);

      cards.forEach((card, index) => {
        const start = 0.32 + index * 0.075;
        const end = 0.64 + index * 0.055;
        const cardProgress = reducedMotion.matches
          ? progress > start ? 1 : 0
          : easeOutCubic(getRangeProgress(progress, start, end));
        const direction = Number(card.dataset.direction) || 1;
        const translateY = direction * 112 * (1 - cardProgress);

        card.style.opacity = String(getRangeProgress(cardProgress, 0, 0.14));
        card.style.transform = `translate3d(0, ${translateY}vh, 0)`;
      });

      if (notice) notice.style.opacity = String(1 - getRangeProgress(progress, 0.08, 0.24));
      scrollIndicator.style.opacity = String(1 - getRangeProgress(progress, 0.08, 0.22));
    };

    const updateScene = () => {
      frameId = null;

      const rect = scene.getBoundingClientRect();
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const scrollRange = Math.max(1, rect.height - viewportHeight);
      const progress = clamp(-rect.top / scrollRange);
      const firstProgress = getRangeProgress(progress, 0, 0.43);
      const transitionProgress = easeOutCubic(getRangeProgress(progress, 0.43, 0.67));
      const secondProgress = getRangeProgress(progress, 0.67, 0.98);

      updatePanel(panels[0], firstProgress);
      updatePanel(panels[1], secondProgress);

      panels[1].style.clipPath = `inset(0 0 0 ${100 - transitionProgress * 100}%)`;
      panels[1].style.transform = `translate3d(${(1 - transitionProgress) * 18}vw, 0, 0)`;
    };

    const requestSceneUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateScene);
    };

    updateScene();
    window.addEventListener("scroll", requestSceneUpdate, { passive: true });
    window.addEventListener("resize", requestSceneUpdate);
    window.visualViewport?.addEventListener("resize", requestSceneUpdate);
    reducedMotion.addEventListener("change", requestSceneUpdate);

    return () => {
      window.removeEventListener("scroll", requestSceneUpdate);
      window.removeEventListener("resize", requestSceneUpdate);
      window.visualViewport?.removeEventListener("resize", requestSceneUpdate);
      reducedMotion.removeEventListener("change", requestSceneUpdate);

      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const section = newsRevealRef.current;

    if (!section) return undefined;

    const panels = [...section.querySelectorAll(".main_news_panel")];
    const background = section.querySelector(".main_news_background img");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = null;

    const updateNewsReveal = () => {
      frameId = null;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const scrollRange = Math.max(1, rect.height - viewportHeight);
      const sectionProgress = clamp(-rect.top / scrollRange);
      const ranges = [
        [0.06, 0.28],
        [0.37, 0.59],
        [0.68, 0.9],
      ];

      panels.forEach((panel, index) => {
        if (panel.classList.contains("main_news_panel_1")) return;

        const [start, end] = ranges[index];
        const revealProgress = reducedMotion.matches
          ? sectionProgress >= start ? 1 : 0
          : easeOutCubic(getRangeProgress(sectionProgress, start, end));
        const topInset = (1 - revealProgress) * 100;

        panel.style.clipPath = `inset(${topInset}% 0% 0% 0%)`;
      });

      background.style.transform = `scale(${1.06 - sectionProgress * 0.06})`;
    };

    const requestNewsUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateNewsReveal);
    };

    updateNewsReveal();
    window.addEventListener("scroll", requestNewsUpdate, { passive: true });
    window.addEventListener("resize", requestNewsUpdate);
    window.visualViewport?.addEventListener("resize", requestNewsUpdate);
    reducedMotion.addEventListener("change", requestNewsUpdate);

    return () => {
      window.removeEventListener("scroll", requestNewsUpdate);
      window.removeEventListener("resize", requestNewsUpdate);
      window.visualViewport?.removeEventListener("resize", requestNewsUpdate);
      reducedMotion.removeEventListener("change", requestNewsUpdate);

      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <main className="page_main">
      <section className="main_story" ref={sceneRef}>
        <div className="main_story_stage">
          {MAIN_STORIES.map((story, index) => (
            <MainStoryPanel story={story} index={index} key={story.background} />
          ))}
        </div>
      </section>

      <section className="main_news_reveal" ref={newsRevealRef}>
        <div className="main_news_stage">
          <div className="main_news_background" aria-hidden="true">
            <img src="/img/main_2_1.jpg" alt="" />
          </div>

          <div className="main_news_panels">
            {MAIN_NEWS.map((news, index) => (
              <article className={`main_news_panel main_news_panel_${index + 1}`} key={news.image}>
                <div className="main_news_thumbnail">
                  <img src={news.image} alt="id NEWS" />
                </div>

                <div className="main_news_content">
                  <time dateTime={news.dateTime}>{news.date}</time>
                  <h2 className="gt_all">id NEWS</h2>
                  <p>{news.title}</p>
                  <TransitionLink className="main_news_more" to="/magazine/id-news">
                    <span>VIEW MORE</span>
                    <i aria-hidden="true">→</i>
                  </TransitionLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Main;
