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
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          gap: "120px",
          willChange: "transform",
        }}
      >
        <section className="as_1">
          <img src="/img/about_1.jpg" />
          <div className="as_1_text">
            <h1 className="display-l fw-l apprael">Beyond</h1>
            <h1 className="display-l fw-l apprael">Style,</h1>
            <h1 className="display-l fw-l apprael">Be You</h1>
          </div>
        </section>

        
      </div>
    </main>
  );
}

export default About;
