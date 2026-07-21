
import { useEffect } from "react";
import "../styles/academy.scss";

function Academy() {
  useEffect(() => {
    const section = document.querySelector(".page_academy .ac_1");
    const videoGrowthTrack = section?.querySelector(".ac_1_bg_height");
    const videoWrap = section?.querySelector(".video_w");
    const workSection = section?.querySelector(".ac_1_3");
    const workImages = workSection ? [...workSection.querySelectorAll(".left img")] : [];
    const workItems = workSection ? [...workSection.querySelectorAll(".right li")] : [];
    const workList = workSection?.querySelector(".right");
    const workVisual = workSection?.querySelector(".left");

    if (!section || !videoGrowthTrack || !videoWrap) return undefined;

    let frameId = null;

    const updateVideoClip = () => {
      frameId = null;

      const sectionRect = section.getBoundingClientRect();
      const growthRect = videoGrowthTrack.getBoundingClientRect();
      const growthRange = Math.max(1, growthRect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -growthRect.top / growthRange));
      const remaining = 1 - progress;
      const initialSize = window.innerHeight * 0.53333;
      const initialTop = window.innerHeight * 0.352;
      const viewportWidth = document.documentElement.clientWidth;
      const initialSide = Math.max(0, (viewportWidth - initialSize) / 2);
      const initialBottom = Math.max(0, window.innerHeight - initialTop - initialSize);
      const titleRect = videoWrap.parentElement.getBoundingClientRect();
      const offsetY = sectionRect.top > 0
        ? sectionRect.top
        : Math.min(0, sectionRect.bottom - window.innerHeight);

      videoWrap.style.setProperty("--ac-video-clip-top", `${initialTop * remaining}px`);
      videoWrap.style.setProperty("--ac-video-clip-side", `${initialSide * remaining}px`);
      videoWrap.style.setProperty("--ac-video-clip-bottom", `${initialBottom * remaining}px`);
      videoWrap.style.setProperty("--ac-video-x", `${-titleRect.left}px`);
      videoWrap.style.setProperty("--ac-video-y", `${-titleRect.top + offsetY}px`);
      videoWrap.style.setProperty("--ac-video-width", `${viewportWidth}px`);
      videoWrap.style.setProperty("--ac-video-overlay-opacity", String(progress));

      if (workSection && workItems.length) {
        const workRect = workSection.getBoundingClientRect();
        const workRange = Math.max(1, workRect.height - window.innerHeight);
        const workProgress = Math.min(1, Math.max(0, -workRect.top / workRange));
        const workPosition = Math.min(
          workItems.length - 1,
          workProgress * workItems.length,
        );
        const activeIndex = Math.round(workPosition);
        const visualHeight = workVisual?.getBoundingClientRect().height || 0;
        const titleHeight = workItems[0]?.querySelector(".l_t")?.getBoundingClientRect().height || 0;
        const expandedItemHeight = Math.max(
          ...workItems.map((item) => {
            const title = item.querySelector(".l_t");
            const detail = item.querySelector(".l_b");

            return (title?.getBoundingClientRect().height || 0) + (detail?.scrollHeight || 0);
          }),
        );
        const listHeight = Math.max(
          visualHeight,
          expandedItemHeight + (workItems.length - 1) * titleHeight,
        );

        if (workList) {
          const listOffsetY = Math.max(0, (listHeight - visualHeight) / 2);

          workList.style.height = `${listHeight}px`;
          workList.style.transform = `translate3d(0, ${listOffsetY}px, 0)`;
        }

        workItems.forEach((item, index) => {
          const revealProgress = index === 0
            ? 1
            : Math.min(1, Math.max(0, workPosition - (index - 1)));
          const pendingItemCount = workItems.length - index;
          const collapsedY = index === 0
            ? 0
            : Math.max(
              0,
              listHeight
                - pendingItemCount * titleHeight,
            );
          const expandedY = index * titleHeight;
          const itemY = collapsedY + (expandedY - collapsedY) * revealProgress;

          item.classList.toggle("active", index === activeIndex);
          item.style.setProperty("--work-item-y", `${itemY}px`);
          item.style.zIndex = String(index + 1);
        });

        workImages.forEach((image, index) => {
          const imageProgress = Math.max(0, 1 - Math.abs(index - workPosition));

          image.classList.toggle("active", index === activeIndex);
          image.style.opacity = String(imageProgress);
        });
      }
    };

    const requestClipUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateVideoClip);
    };

    updateVideoClip();
    window.addEventListener("scroll", requestClipUpdate, { passive: true });
    window.addEventListener("resize", requestClipUpdate);

    return () => {
      window.removeEventListener("scroll", requestClipUpdate);
      window.removeEventListener("resize", requestClipUpdate);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <main className="page_academy">
      <section className="ac_1 bg-gray-1">
        <div className="ac_1_bg_height"></div>
        <div className="ac_1_wrap ani">
          <div className="title b-t b-4">
            <div className="b-b"></div>
            <div className="video_w">
              <video src="/video/academy_1.mp4" autoPlay muted loop playsInline preload="auto" />
            </div>
            <div className="display-l apprael title_txt apprael_ani">ID ACADEMY</div>
            
          </div>
          <div className="scroll">
            <div className="body-s scroll_left">[ SCROLL ]</div>
            <div className="body-s scroll_right">[ SCROLL ]</div>
          </div>
          <div className="title_b txt-ac apprael_ani delay-2">
            <span>meet</span>
            <div className="cross"></div>
            <span>the</span>
            <div className="cross"></div>
            <span>team</span>
          </div>
        </div>
        <div className="ac_1_2">
          <article className="body-m txt-white">
            <h1 className="head-l apprael_ani ls_s delay-1 ani">온/오프라인을<br/>아우르는 독자적 교육 프로그램</h1>
            <span className="mg apprael_ani ls_s delay-2 ani">
              id STYLE WORK 디플로마는 2년 4개월간 총 56개의 헤어 작품을 이수하면<br/>
              정식 자격을 부여하는 미용업계 최초의 체계적 헤어 기술 프로그램입니다.
            </span>
            <span className="apprael_ani ls_s delay-3 ani">
              온라인 플랫폼 &lt;seezier	&gt;를 통해 최신 살롱 스타일까지 학습할 수 있으며,<br/>
              각 매장에서 현장 실전 감각을 익히는 맞춤형 과정인 Id skill mastery까지 함께 제공됩니다.
            </span>
          </article>
        </div>
        <div className="ac_1_3">
          <div className="flex">
            <div className="left">
              <img src="/img/ac_1_3_1.jpg"/>
              <img src="/img/ac_1_3_2.jpg"/>
              <img src="/img/ac_1_3_3.jpg"/>
              <img src="/img/ac_1_3_4.jpg"/>
            </div>
            <ul className="right">
              <li>
                <div className="l_t b-b">
                  <span>01</span>
                  <h1>style work</h1>
                </div>
                <div className="l_b">
                  <b>/    스타일 워크</b>
                  <span>얼굴형·무드 분석을 기반으로 트렌드 스타일을 해석하며<br/>고객별 맞춤 디자인 감각과 표현력을 집중적으로 익히는 과정입니다.</span>
                </div>
              </li>
              <li>
                <div className="l_t b-b">
                  <span>02</span>
                  <h1>start work</h1>
                </div>
                <div className="l_b">
                  <b>/    스타일 워크</b>
                  <span>얼굴형·무드 분석을 기반으로 트렌드 스타일을 해석하며<br/>고객별 맞춤 디자인 감각과 표현력을 집중적으로 익히는 과정입니다.</span>
                </div>
              </li>
              <li>
                <div className="l_t b-b">
                  <span>03</span>
                  <h1>salon work</h1>
                </div>
                <div className="l_b">
                  <b>/    스타일 워크</b>
                  <span>얼굴형·무드 분석을 기반으로 트렌드 스타일을 해석하며<br/>고객별 맞춤 디자인 감각과 표현력을 집중적으로 익히는 과정입니다.</span>
                </div>
              </li>

              <li>
                <div className="l_t b-b">
                  <span>04</span>
                  <h1>technic work</h1>
                </div>
                <div className="l_b">
                  <b>/    스타일 워크</b>
                  <span>얼굴형·무드 분석을 기반으로 트렌드 스타일을 해석하며<br/>고객별 맞춤 디자인 감각과 표현력을 집중적으로 익히는 과정입니다.</span>
                </div>
              </li>
            </ul>
          </div>
          
        </div>
        
      </section>

      <section className="ac_2">

      </section>
    </main>

  );
}

export default Academy;
