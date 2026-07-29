import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/recruit.scss";

gsap.registerPlugin(ScrollTrigger);

const recruitGridImages = Array.from(
  { length: 12 },
  (_, index) => `/img/rs_grid_${(index % 9) + 1}.jpg`,
);

function Recruit() {
  const progressTrackRef = useRef(null);
  const maskTrackRef = useRef(null);
  const maskOriginRef = useRef(null);
  const maskImageRef = useRef(null);
  const downPageRef = useRef(null);
  const gridSectionRef = useRef(null);
  const gridWrapperRef = useRef(null);
  const gridRef = useRef(null);
  const gridContentRef = useRef(null);

  useEffect(() => {
    const progressTrack = progressTrackRef.current;
    const maskTrack = maskTrackRef.current;
    const maskOrigin = maskOriginRef.current;
    const maskImage = maskImageRef.current;
    const downPage = downPageRef.current;
    const downItems = downPage
      ? [...downPage.querySelectorAll(":scope > .sticky_w > ul > li")]
      : [];
    const recruitHeader = maskTrack?.closest(".rs_head");

    if (
      !progressTrack
      || !maskTrack
      || !maskOrigin
      || !maskImage
      || !downPage
      || !recruitHeader
    ) {
      return undefined;
    }

    let frameId = null;

    const updateMask = () => {
      frameId = null;

      const progressRect = progressTrack.getBoundingClientRect();
      const originRect = maskOrigin.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const progressStart = progressRect.top + window.scrollY;
      const progressRange = Math.max(1, progressRect.height);
      const progress = Math.min(
        1,
        Math.max(0, (window.scrollY - progressStart) / progressRange),
      );
      const remaining = 1 - progress;
      const progressValue = progress * 100;
      const initialHeight = originRect.height;
      const initialTop = Math.max(0, originRect.top + window.scrollY);
      const initialLeft = Math.max(0, originRect.left);
      const initialRight = Math.max(0, viewportWidth - originRect.right);
      const initialBottom = Math.max(
        0,
        viewportHeight - initialTop - initialHeight,
      );
      const initialCenterY = initialTop + initialHeight / 2;
      const imageOffsetY = (initialCenterY - viewportHeight / 2) * remaining;

      maskTrack.style.setProperty("--recruit-mask-width", `${viewportWidth}px`);
      maskTrack.style.setProperty("--recruit-mask-height", `${viewportHeight}px`);
      recruitHeader.style.setProperty(
        "--recruit-progress",
        progressValue.toFixed(3),
      );
      recruitHeader.style.setProperty(
        "--recruit-progress-inverse",
        String(remaining),
      );
      maskTrack.style.setProperty(
        "--recruit-mask-clip-top",
        `${initialTop * remaining}px`,
      );
      maskTrack.style.setProperty(
        "--recruit-mask-clip-right",
        `${initialRight * remaining}px`,
      );
      maskTrack.style.setProperty(
        "--recruit-mask-clip-bottom",
        `${initialBottom * remaining}px`,
      );
      maskTrack.style.setProperty(
        "--recruit-mask-clip-left",
        `${initialLeft * remaining}px`,
      );
      maskTrack.style.setProperty(
        "--recruit-image-y",
        `${imageOffsetY}px`,
      );

      const downRect = downPage.getBoundingClientRect();
      const downRange = Math.max(1, downRect.height - viewportHeight);
      const downProgress = Math.min(
        1,
        Math.max(0, -downRect.top / downRange),
      );
      const itemDuration = 0.4;
      const itemStagger = 0.2;

      downPage.style.setProperty(
        "--recruit-down-progress",
        (downProgress * 100).toFixed(3),
      );

      downItems.forEach((item, index) => {
        const itemStart = index * itemStagger;
        const itemProgress = Math.min(
          1,
          Math.max(0, (downProgress - itemStart) / itemDuration),
        );
        const itemY = (1 - itemProgress) * viewportHeight * 0.65;

        item.style.setProperty(
          "--recruit-item-progress",
          String(itemProgress),
        );
        item.style.setProperty("--recruit-item-y", `${itemY}px`);
      });
    };

    const requestMaskUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateMask);
    };

    updateMask();
    window.addEventListener("scroll", requestMaskUpdate, { passive: true });
    window.addEventListener("touchmove", requestMaskUpdate, { passive: true });
    window.addEventListener("touchend", requestMaskUpdate, { passive: true });
    window.addEventListener("resize", requestMaskUpdate);
    window.visualViewport?.addEventListener("resize", requestMaskUpdate);

    return () => {
      window.removeEventListener("scroll", requestMaskUpdate);
      window.removeEventListener("touchmove", requestMaskUpdate);
      window.removeEventListener("touchend", requestMaskUpdate);
      window.removeEventListener("resize", requestMaskUpdate);
      window.visualViewport?.removeEventListener("resize", requestMaskUpdate);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  useEffect(() => {
    const block = gridSectionRef.current;
    const wrapper = gridWrapperRef.current;
    const content = gridContentRef.current;
    const grid = gridRef.current;
    const title = content?.querySelector(".rs_2_content_title");
    const description = content?.querySelector(".rs_2_content_description");
    const button = content?.querySelector(".rs_2_content_button");
    const items = grid
      ? [...grid.querySelectorAll(".rs_2_grid_item")]
      : [];

    if (
      !block
      || !wrapper
      || !content
      || !grid
      || !title
      || !description
      || !button
      || !items.length
    ) {
      return undefined;
    }

    const images = items.map((item) => item.querySelector("img"));
    const columns = Array.from({ length: 3 }, () => []);
    let gsapContext = null;
    let cancelled = false;

    items.forEach((item, index) => {
      columns[index % columns.length].push(item);
    });

    const imageReady = images.map((image) => {
      if (image.complete) return Promise.resolve();

      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    });

    Promise.all(imageReady).then(() => {
      if (cancelled) return;

      gsapContext = gsap.context(() => {
        gsap.set([description, button], {
          opacity: 0,
          pointerEvents: "none",
        });

        const dy = (content.offsetHeight - title.offsetHeight) / 2;
        const titleOffsetY = (dy / content.offsetHeight) * 100;

        gsap.set(title, { yPercent: titleOffsetY });

        gsap.from(wrapper, {
          yPercent: -100,
          ease: "none",
          scrollTrigger: {
            trigger: block,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });

        gsap.from(title, {
          opacity: 0,
          duration: 0.7,
          ease: "power1.out",
          scrollTrigger: {
            trigger: block,
            start: "top 57%",
            toggleActions: "play none none reset",
          },
        });

        const gridRevealTimeline = () => {
          const timeline = gsap.timeline();
          const wh = window.innerHeight;
          const revealY = wh - (wh - grid.offsetHeight) / 2;

          columns.forEach((column, columnIndex) => {
            const fromTop = columnIndex % 2 === 0;

            timeline.from(
              column,
              {
                y: revealY * (fromTop ? -1 : 1),
                stagger: {
                  each: 0.06,
                  from: fromTop ? "end" : "start",
                },
                ease: "power1.inOut",
              },
              "grid-reveal",
            );
          });

          return timeline;
        };

        const gridZoomTimeline = () => {
          const timeline = gsap.timeline({
            defaults: {
              duration: 1,
              ease: "power3.inOut",
            },
          });

          timeline.to(grid, { scale: 2.05 });
          timeline.to(columns[0], { xPercent: -40 }, "<");
          timeline.to(columns[2], { xPercent: 40 }, "<");
          timeline.to(
            columns[1],
            {
              yPercent: (index) =>
                (index < Math.floor(columns[1].length / 2) ? -1 : 1) * 40,
              duration: 0.5,
              ease: "power1.inOut",
            },
            "-=0.5",
          );

          return timeline;
        };

        const toggleContent = (isVisible = true) => {
          gsap.timeline({ defaults: { overwrite: true } })
            .to(title, {
              yPercent: isVisible ? 0 : titleOffsetY,
              duration: 0.7,
              ease: "power2.inOut",
            })
            .to(
              [description, button],
              {
                opacity: isVisible ? 1 : 0,
                duration: 0.4,
                ease: `power1.${isVisible ? "inOut" : "out"}`,
                pointerEvents: isVisible ? "all" : "none",
              },
              isVisible ? "-=90%" : "<",
            );
        };

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: "top 25%",
            end: "bottom bottom",
            scrub: true,
          },
        });

        timeline
          .add(gridRevealTimeline())
          .add(gridZoomTimeline(), "-=0.6")
          .add(
            () => toggleContent(timeline.scrollTrigger.direction === 1),
            "-=0.32",
          );
      }, block);

      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      gsapContext?.revert();
    };
  }, []);

  return (
    <main className="page_recruit">
      <section className="rs_head ani">
        <div className="rs_progress" ref={progressTrackRef}></div>
        <div className="rc_title b-t b-2">
          <h1 className="display-l apprael  apprael_all apprael_ani" >RECRUIT</h1>
          <div className="b-b b-delay-0"></div>
          <div className="body-s scroll">[ SCROLL ]</div>
        </div>
        <div className="middle ani">
          <span className="body-l fw-sb">idHAIR와 함께 성장할 인재를 찾습니다.</span>
          <div className="title_b txt-ac apprael_ani delay-2 gt_all">
            <span className="display-m">let&#39;s</span>
            <img src="/img/recruit_cross.svg"/>
            <span className="display-m">work</span>
            <img src="/img/recruit_cross.svg"/>
            <span className="display-m">together</span>
          </div>
        </div>
        <div className="mask_origin" ref={maskOriginRef}></div>
        <div className="mask_w" ref={maskTrackRef}>
          <div className="mask_sticky">
            <img
              className="mask_el"
              ref={maskImageRef}
              src="/img/recruit_1.jpg"
              alt=""
            />
          </div>
        </div>

        <div className="down_p" ref={downPageRef}>
          <div className="sticky_w">
            <div className="rolling apprael_all display-m">
              <h1>MY idENTITY  MY idHAIR  </h1>
              <h1>MY idENTITY  MY idHAIR  </h1>
              <h1>MY idENTITY  MY idHAIR  </h1>
            </div>
            <ul className="">
              <li>
                <div className="edge_w">
                  <img src="/img/edge_2.svg"/><img src="/img/edge_2.svg"/><img src="/img/edge_2.svg"/><img src="/img/edge_2.svg"/>
                </div>
                <img src="/img/rs_1_1.svg" alt="" />
                <h1 className="display-xs gt fw-r">honest</h1>
                <b className="body-s fw-sb">( 정직함 )</b>
                <span className="body-s fw-r">공정한 노력을 통한 정직한 성공</span>
              </li>

              <li>
                <div className="edge_w">
                  <img src="/img/edge_2.svg"/><img src="/img/edge_2.svg"/><img src="/img/edge_2.svg"/><img src="/img/edge_2.svg"/>
                </div>
                <img src="/img/rs_1_2.svg" alt="" />
                <h1 className="display-xs gt fw-r">warmth</h1>
                <b className="body-s fw-sb">( 따뜻함 )</b>
                <span className="body-s fw-r">모두를 가족처럼 대하는 따뜻한 마음</span>
              </li>

              <li>
                <div className="edge_w">
                  <img src="/img/edge_2.svg"/><img src="/img/edge_2.svg"/><img src="/img/edge_2.svg"/><img src="/img/edge_2.svg"/>
                </div>
                <img src="/img/rs_1_3.svg" alt="" />
                <h1 className="display-xs gt fw-r">integrity</h1>
                <b className="body-s fw-sb">( 성숙함 )</b>
                <span className="body-s fw-r">선한 영향력을 줄 수 있는 성숙한 태도</span>
              </li>
            </ul>
          </div>
        </div>

      </section>
      <section className="rs_2" ref={gridSectionRef}>
        <div className="rs_2_sticky" ref={gridWrapperRef}>
          <div className="rs_2_content txt-ac" ref={gridContentRef}>
            <h2 className="rs_2_content_title apprael">
              YOUR idENTITY, OUR idHAIR
            </h2>
            <p className="rs_2_content_description">
              GROW WITH idHAIR
            </p>
            <button className="rs_2_content_button" type="button">
              VIEW OPEN POSITIONS
            </button>
          </div>
          <div className="rs_2_gallery">
            <ul className="rs_2_grid" ref={gridRef}>
              {recruitGridImages.map((src, index) => (
                <li className="rs_2_grid_item" key={`${src}-${index}`}>
                  <img
                    className="rs_2_grid_image"
                    src={src}
                    alt={`idHAIR recruit ${index + 1}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="rs_nav_w">
        <nav className="body-m rs_nav">
          <div className="rs_nav_1">
            <span>E-mail</span>
            <h4>idhair1988@naver.com</h4>
            <p>/</p>
            <span>Instagram</span>
            <h4>idhair_hello</h4>
          </div>
          <div className="rs_nav_2 txt-ac">입사지원서 다운로드</div>
          <div className="rs_nav_3">자주하는 질문</div>
        </nav>
      </div>
    </main>
  );
}

export default Recruit;
