
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
    const teamSection = document.querySelector(".page_academy .ac_2");
    const teamImageWrap = teamSection?.querySelector(".img_w");
    const teamCounter = teamImageWrap?.querySelector(".number_count");
    const teamCounterNumber = teamCounter?.querySelector("b");
    const teamImages = teamImageWrap
      ? [...teamImageWrap.querySelectorAll(".img img")]
      : [];
    const teamDetailItems = teamImageWrap
      ? [...teamImageWrap.querySelectorAll(":scope > ul > li")]
      : [];
    const teamList = teamSection?.querySelector(".right");
    const teamItems = teamList ? [...teamList.querySelectorAll("li")] : [];
    const academyOutro = document.querySelector(".page_academy .ac_3");
    const backgroundChecker = academyOutro?.querySelector(".bg_checker");

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
        const itemStyle = getComputedStyle(workItems[0]);
        const itemPaddingBlock =
          (Number.parseFloat(itemStyle.paddingTop) || 0)
          + (Number.parseFloat(itemStyle.paddingBottom) || 0);
        const itemStep = titleHeight + itemPaddingBlock;
        const expandedItemHeight = Math.max(
          ...workItems.map((item) => item.scrollHeight),
        );
        const listHeight = Math.max(
          visualHeight,
          expandedItemHeight + (workItems.length - 1) * itemStep,
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
                - pendingItemCount * itemStep,
            );
          const expandedY = index * titleHeight;
          const itemY = collapsedY + (expandedY - collapsedY) * revealProgress;

          item.classList.toggle("active", index === activeIndex);
          item.style.setProperty("--work-item-y", `${itemY}px`);
          item.style.zIndex = String(index + 1);
        });

        workImages.forEach((image, index) => {
          const revealProgress = index === 0
            ? 1
            : Math.min(1, Math.max(0, workPosition - (index - 1)));
          const topInset = (1 - revealProgress) * 100;

          image.classList.toggle("active", index === activeIndex);
          image.style.opacity = "1";
          image.style.zIndex = String(index + 1);
          image.style.willChange = "clip-path";
          image.style.clipPath = `inset(${topInset}% 0% 0% 0%)`;
        });
      }

      if (teamSection && teamImageWrap && teamCounter && teamItems.length) {
        const teamRect = teamSection.getBoundingClientRect();
        const teamRange = Math.max(1, teamRect.height - window.innerHeight);
        const teamProgress = Math.min(1, Math.max(0, -teamRect.top / teamRange));
        const titleProgress = Math.min(1, teamProgress / 0.9);
        const teamPosition = titleProgress * teamItems.length;
        const activeTeamIndex = Math.min(
          teamItems.length - 1,
          Math.floor(teamPosition),
        );
        const listRect = teamList.getBoundingClientRect();
        const totalItemHeight = teamItems.reduce((height, item) => {
          const itemStyle = getComputedStyle(item);

          return height
            + item.offsetHeight
            + (Number.parseFloat(itemStyle.marginTop) || 0)
            + (Number.parseFloat(itemStyle.marginBottom) || 0);
        }, 0);
        const titleTravel = Math.max(0, listRect.height - totalItemHeight);
        const counterTravel = Math.max(
          0,
          teamImageWrap.clientHeight - teamCounter.offsetHeight,
        );

        teamItems.forEach((item, index) => {
          const itemProgress = Math.min(1, Math.max(0, teamPosition - index));

          item.classList.toggle("active", index === activeTeamIndex);
          item.style.transform = `translate3d(0, ${-titleTravel * itemProgress}px, 0)`;
        });

        teamDetailItems.forEach((item, index) => {
          item.classList.toggle("active", index === activeTeamIndex);
        });

        teamImages.forEach((image, index) => {
          const revealProgress = index === 0
            ? 1
            : Math.min(1, Math.max(0, teamPosition - (index - 1)));
          const topInset = (1 - revealProgress) * 100;

          image.classList.toggle("active", index === activeTeamIndex);
          image.style.zIndex = String(index + 1);
          image.style.willChange = "clip-path";
          image.style.clipPath = `inset(${topInset}% 0% 0% 0%)`;
        });

        teamCounter.style.transform = `translate3d(0, ${counterTravel * teamProgress}px, 0)`;

        if (teamCounterNumber) {
          teamCounterNumber.textContent = String(activeTeamIndex + 1).padStart(2, "0");
        }
      }

      if (academyOutro && backgroundChecker) {
        const checkerRect = backgroundChecker.getBoundingClientRect();
        const backgroundProgress = Math.min(
          1,
          Math.max(0, (window.innerHeight - checkerRect.top) / window.innerHeight),
        );

        const backgroundColor = `rgb(237 237 237 / ${backgroundProgress * 100}%)`;

        academyOutro.style.backgroundColor = backgroundColor;
        teamSection?.style.setProperty("background-color", backgroundColor);
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

      <section className="ac_2 ">
        
        <div className="flex ani">
          <div className="b-l b-delay-6"></div>
          
          <div className="left">
            
            <h1 className="title b-b b-2 body-m fw-sb">트렌드와 현장 경험을 연결한 교육을 통해<br/>디자이너의 성장과 경쟁력을 함께 완성합니다.</h1>
            <div className="img_w">
              <div className="number_count"><b>01</b><span>/ 08</span></div>
              <div className="img">
                <img src="/img/ac_2_1.jpg"/>
                <img src="/img/ac_2_2.jpg"/>
                <img src="/img/ac_2_3.jpg"/>
                <img src="/img/ac_2_4.jpg"/>
                <img src="/img/ac_2_5.jpg"/>
                <img src="/img/ac_2_6.jpg"/>
                <img src="/img/ac_2_7.jpg"/>
                <img src="/img/ac_2_8.jpg"/>
              </div>
              <ul>
                <li>
                  <span>레이어드 컷 / 숏컷 디자인 전문1</span>
                  <span>현장 스타일링 프로세스 교육1</span>
                  <span>프리미엄 무드 연출1</span>
                </li>
                <li>
                  <span>레이어드 컷 / 숏컷 디자인 전문2</span>
                  <span>현장 스타일링 프로세스 교육2</span>
                  <span>프리미엄 무드 연출2</span>
                </li>
                <li>
                  <span>레이어드 컷 / 숏컷 디자인 전문3</span>
                  <span>현장 스타일링 프로세스 교육3</span>
                  <span>프리미엄 무드 연출3</span>
                </li>
                <li>
                  <span>레이어드 컷 / 숏컷 디자인 전문4</span>
                  <span>현장 스타일링 프로세스 교육4</span>
                  <span>프리미엄 무드 연출4</span>
                </li>
                <li>
                  <span>레이어드 컷 / 숏컷 디자인 전문5</span>
                  <span>현장 스타일링 프로세스 교육5</span>
                  <span>프리미엄 무드 연출5</span>
                </li>
                <li>
                  <span>레이어드 컷 / 숏컷 디자인 전문6</span>
                  <span>현장 스타일링 프로세스 교육6</span>
                  <span>프리미엄 무드 연출6</span>
                </li>
                <li>
                  <span>레이어드 컷 / 숏컷 디자인 전문7</span>
                  <span>현장 스타일링 프로세스 교육7</span>
                  <span>프리미엄 무드 연출7</span>
                </li>
                <li>
                  <span>레이어드 컷 / 숏컷 디자인 전문8</span>
                  <span>현장 스타일링 프로세스 교육8</span>
                  <span>프리미엄 무드 연출8</span>
                </li>
              </ul>
            </div>
            
          </div>
          <ul className="right">
            <li>
              <h4 className="body-l fw-b">Creative Cut Director</h4>
              <span className="head-l">안 정 준</span>
            </li>
            <li>
              <h4 className="body-l fw-b">Global Color Educator</h4>
              <span className="head-l">윤 훈</span>
            </li>
            <li>
              <h4 className="body-l fw-b">Signature Perm Specialist</h4>
              <span className="head-l">이 설 아</span>
            </li>
            <li>
              <h4 className="body-l fw-b">Salon Branding Mentor</h4>
              <span className="head-l">이 수 진</span>
            </li>
            <li>
              <h4 className="body-l fw-b">Men's Grooming Expert</h4>
              <span className="head-l">이 은 혜</span>
            </li>
            <li>
              <h4 className="body-l fw-b">Luxury Styling Director</h4>
              <span className="head-l">이 정 빈</span>
            </li>
            <li>
              <h4 className="body-l fw-b">Scalp &amp; Care Consultant</h4>
              <span className="head-l">진 영 준</span>
            </li>
            <li>
              <h4 className="body-l fw-b">Trend Content Creator</h4>
              <span className="head-l">최 연 승</span>
            </li>
          </ul>
        </div>
        <div className="ac_2_b_ani b-b ani b-delay-8"><div></div><div></div></div>
      </section>
      <section className="ac_3">
        <div className="bg_checker"></div>
        <div className="img_map">
          <h1 className="display-l apprael">ID STYLE WORK</h1>
          <ul className="img_w">
            <li>
              <img src="/img/ac_3_1.png" alt="" />
              <div className="txt_w">
                <div className="edge_w"><img src="/img/edge.svg"/><img src="/img/edge.svg"/><img src="/img/edge.svg"/><img src="/img/edge.svg"/></div>
                <div className="top"><h4 className="body-l">1 김 서 윤&nbsp;<p className="body-s"> 님</p></h4><span className="caption-m txt-gray">2025년도 수료</span></div>
                <div className="bottom body-s">
                  기술은 물론 고객 상담 방식까지 완전히 달라졌어요.<br/>
                  수료 후 바로 살롱 현장에서 재방문 고객이 늘면서<br/>
                  제 시그니처 스타일이 생겼다는 자신감이 생겼습니다.<br/>
                </div>
              </div>
            </li>
            <li>
              <img src="/img/ac_3_2.png" alt="" />
              <div className="txt_w">
                <div className="edge_w"><img src="/img/edge.svg"/><img src="/img/edge.svg"/><img src="/img/edge.svg"/><img src="/img/edge.svg"/></div>
                <div className="top"><h4 className="body-l">2 김 서 윤&nbsp; <p className="body-s"> 님</p></h4><span className="caption-m txt-gray">2025년도 수료</span></div>
                <div className="bottom body-s">
                  기술은 물론 고객 상담 방식까지 완전히 달라졌어요.<br/>
                  수료 후 바로 살롱 현장에서 재방문 고객이 늘면서<br/>
                  제 시그니처 스타일이 생겼다는 자신감이 생겼습니다.<br/>
                </div>
              </div>
            </li>
            <li>
              <img src="/img/ac_3_3.png" alt="" />
              <div className="txt_w">
                <div className="edge_w"><img src="/img/edge.svg"/><img src="/img/edge.svg"/><img src="/img/edge.svg"/><img src="/img/edge.svg"/></div>
                <div className="top"><h4 className="body-l">3 김 서 윤&nbsp; <p className="body-s"> 님</p></h4><span className="caption-m txt-gray">2025년도 수료</span></div>
                <div className="bottom body-s">
                  기술은 물론 고객 상담 방식까지 완전히 달라졌어요.<br/>
                  수료 후 바로 살롱 현장에서 재방문 고객이 늘면서<br/>
                  제 시그니처 스타일이 생겼다는 자신감이 생겼습니다.<br/>
                </div>
              </div>
            </li>
            <li>
              <img src="/img/ac_3_4.png" alt="" />
              <div className="txt_w">
                <div className="edge_w"><img src="/img/edge.svg"/><img src="/img/edge.svg"/><img src="/img/edge.svg"/><img src="/img/edge.svg"/></div>
                <div className="top"><h4 className="body-l">4 김 서 윤&nbsp; <p className="body-s"> 님</p></h4><span className="caption-m txt-gray">2025년도 수료</span></div>
                <div className="bottom body-s">
                  기술은 물론 고객 상담 방식까지 완전히 달라졌어요.<br/>
                  수료 후 바로 살롱 현장에서 재방문 고객이 늘면서<br/>
                  제 시그니처 스타일이 생겼다는 자신감이 생겼습니다.<br/>
                </div>
              </div>
            </li>
            <li>
              <img src="/img/ac_3_5.png" alt="" />
              <div className="txt_w">
                <div className="edge_w"><img src="/img/edge.svg"/><img src="/img/edge.svg"/><img src="/img/edge.svg"/><img src="/img/edge.svg"/></div>
                <div className="top"><h4 className="body-l">5 김 서 윤&nbsp; <p className="body-s"> 님</p></h4><span className="caption-m txt-gray">2025년도 수료</span></div>
                <div className="bottom body-s">
                  기술은 물론 고객 상담 방식까지 완전히 달라졌어요.<br/>
                  수료 후 바로 살롱 현장에서 재방문 고객이 늘면서<br/>
                  제 시그니처 스타일이 생겼다는 자신감이 생겼습니다.<br/>
                </div>
              </div>
            </li>
            <li>
              <img src="/img/ac_3_6.png" alt="" />
              <div className="txt_w">
                <div className="edge_w"><img src="/img/edge.svg"/><img src="/img/edge.svg"/><img src="/img/edge.svg"/><img src="/img/edge.svg"/></div>
                <div className="top"><h4 className="body-l">6 김 서 윤&nbsp; <p className="body-s"> 님</p></h4><span className="caption-m txt-gray">2025년도 수료</span></div>
                <div className="bottom body-s">
                  기술은 물론 고객 상담 방식까지 완전히 달라졌어요.<br/>
                  수료 후 바로 살롱 현장에서 재방문 고객이 늘면서<br/>
                  제 시그니처 스타일이 생겼다는 자신감이 생겼습니다.<br/>
                </div>
              </div>
            </li>
            <li>
              <img src="/img/ac_3_7.png" alt="" />
              <div className="txt_w">
                <div className="edge_w"><img src="/img/edge.svg"/><img src="/img/edge.svg"/><img src="/img/edge.svg"/><img src="/img/edge.svg"/></div>
                <div className="top"><h4 className="body-l">7 김 서 윤&nbsp; <p className="body-s"> 님</p></h4><span className="caption-m txt-gray">2025년도 수료</span></div>
                <div className="bottom body-s">
                  기술은 물론 고객 상담 방식까지 완전히 달라졌어요.<br/>
                  수료 후 바로 살롱 현장에서 재방문 고객이 늘면서<br/>
                  제 시그니처 스타일이 생겼다는 자신감이 생겼습니다.<br/>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </main>

  );
}

export default Academy;
