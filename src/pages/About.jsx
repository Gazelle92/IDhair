import useAboutIntroAnimation from "../lib/useAboutIntroAnimation";
import useAboutSmoothScroll from "../lib/useAboutSmoothScroll";
import "../styles/about.scss";

function About() {
  useAboutIntroAnimation();
  useAboutSmoothScroll();

  return (
    <main
      className="page_about"
      style={{
        width: "400vw",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#f4f1ea",
        color: "#111",
      }}
    >
      <div className="about_bg_1">
          <img src="/img/about_bg_1.png" />
        </div>
      <div className="about_intro ">
        <div className="b-t b-4 b-c-white ani"></div>
        <h1 className="display-l fw-l apprael">ABOUT ID HAIR</h1>
        <div className="b-t b-1 b-c-white dotted ani"></div>
        <div className="years_w head-m fw-sb">
          <div className="years_num">
            <h2>1988</h2>
          </div>
        </div>
        <div className="intro_video_w">
          <div className="intro_video"></div>
        </div>
      </div>
      <div
        data-about-horizontal-track
        style={{
          width: "6000px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: "120px",
          willChange: "transform",
        }}
      >
        <section className="as_1 t_m_w">
          <img src="/img/about_1.jpg" />
          <div className="as_text ">
            <h1 className="display-l fw-l apprael t_m_1">Beyond</h1>
            <h1 className="display-l fw-l apprael t_m_2">Style,</h1>
            <h1 className="display-l fw-l apprael t_m_3">Be You</h1>
          </div>
          <div className="as_1_text_2 head-s">행복을 디자인합니다.<br/>행복 스타일 리스트.</div>
          <div className="scroll_indicator">
            <span className="body-s">[ SCROLL ]</span>
            
          </div>
        </section>
        <section className="as_2 t_m_w">
          <div className="as_text ">
            <h1 className="display-l fw-l apprael t_m_1">Brand</h1>
            <h1 className="display-l fw-l apprael t_m_2">Story</h1>
          </div>
          <div className="as_text_2 head-s">
            <span>아이디헤어(id HAIR)의 'id'는 당신의 정체성, 바로 'Identity'를 뜻합니다.</span>
            <span>
              우리는 고객 한 분 한 분이 가진 고유한 뷰티 아이덴티티를 섬세하게<br/>
              디자인하여, 세상에 단 하나뿐인 '가장 나다운 아름다움'을 완성합니다.
            </span>
            <span>
              아이디헤어는 언제나 당신이 가진 고유한 색깔을 지지하며,<br/>
              가장 당신다운 모습으로 빛나는 매 순간을 응원하겠습니다.</span>
          </div>
        </section>
        <section className="as_3">
          <div className="card_w">
            <img src="/img/about_3_card_1.jpg" />
          </div>

        </section>

        
      </div>
    </main>
  );
}

export default About;
