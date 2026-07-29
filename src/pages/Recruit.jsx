import { useEffect, useRef } from "react";
import "../styles/recruit.scss";

function Recruit() {
  const maskTrackRef = useRef(null);
  const maskImageRef = useRef(null);

  useEffect(() => {
    const maskTrack = maskTrackRef.current;
    const maskImage = maskImageRef.current;

    if (!maskTrack || !maskImage) return undefined;

    let frameId = null;

    const updateMask = () => {
      frameId = null;

      const trackRect = maskTrack.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const growthRange = Math.max(1, trackRect.height - viewportHeight);
      const progress = Math.min(1, Math.max(0, -trackRect.top / growthRange));
      const remaining = 1 - progress;
      const initialHeight = viewportWidth / 6;
      const initialLeft = Math.max(0, trackRect.left);
      const initialRight = Math.max(0, viewportWidth - trackRect.right);
      const initialBottom = Math.max(0, viewportHeight - initialHeight);

      maskTrack.style.setProperty("--recruit-mask-width", `${viewportWidth}px`);
      maskTrack.style.setProperty("--recruit-mask-height", `${viewportHeight}px`);
      maskTrack.style.setProperty("--recruit-mask-x", `${-trackRect.left}px`);
      maskImage.style.setProperty(
        "--recruit-mask-clip-top",
        "0px",
      );
      maskImage.style.setProperty(
        "--recruit-mask-clip-right",
        `${initialRight * remaining}px`,
      );
      maskImage.style.setProperty(
        "--recruit-mask-clip-bottom",
        `${initialBottom * remaining}px`,
      );
      maskImage.style.setProperty(
        "--recruit-mask-clip-left",
        `${initialLeft * remaining}px`,
      );
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

  return (
    <main className="page_recruit">
      <section className="rs_head ani">
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

      </section>
    </main>
  );
}

export default Recruit;
