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
        width: "600vw",
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
          height: "100%",
          display: "flex",
          alignItems: "center",
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
          <div className="as_1_text_2 head-s ani_x">
            <span className="apprael_ani ls_s delay-1">
            행복을 디자인합니다.
            </span>
            <span className="apprael_ani ls_s delay-3">
            행복 스타일 리스트.
            </span>
            </div>
          <div className="scroll_indicator">
            <span className="body-s">[ SCROLL ]</span>
            
          </div>
        </section>
        <section className="as_2 t_m_w">
          <div className="as_text ">
            <h1 className="display-l fw-l apprael t_m_1">Brand</h1>
            <h1 className="display-l fw-l apprael t_m_2">Story</h1>
          </div>
          <div className="as_text_2 head-s ani_x t_m_3">
            <span className="apprael_ani ls_s delay-1">아이디헤어(id HAIR)의 'id'는 당신의 정체성, 바로 'Identity'를 뜻합니다.</span>
            <span className="apprael_ani ls_s delay-2">
              우리는 고객 한 분 한 분이 가진 고유한 뷰티 아이덴티티를 섬세하게<br/>
              디자인하여, 세상에 단 하나뿐인 '가장 나다운 아름다움'을 완성합니다.
            </span>
            <span className="apprael_ani ls_s delay-3">
              아이디헤어는 언제나 당신이 가진 고유한 색깔을 지지하며,<br/>
              가장 당신다운 모습으로 빛나는 매 순간을 응원하겠습니다.</span>
          </div>
        </section>
        <section className="as_3">
          <div className="as_3_1 t_m_w">
            <div className="card_w">
              <img src="/img/about_3_card_1.jpg" />
            </div>
            <div className="as_text as_text_1 ">
              <h1 className="display-l fw-l apprael t_m_1">Our</h1>
              <h1 className="display-l fw-l apprael t_m_2">Identity</h1>
            </div>
          </div>

          <div className="as_3_2 t_m_w">
            <div className="card_w">
              <img src="/img/about_3_card_2.jpg" />
            </div>
            <div className="as_text  ani_x">
              <h1 className="t_m_1 t_1 txt-ac fw-r">vision</h1>
              <span className="body-m t_2 t_m_2">( a )</span>
              <div className="body-m as_text_1 t_m_3">
                <span className="apprael_ani ls_s  delay-1">고객의 고유한 아름다움을 찾아주는 든든한 뷰티 파트너로서,</span>
                <span className="apprael_ani ls_s delay-2">구성원과 함께 동반 성장하며 K-뷰티의 새로운 역사를</span>
                <span className="apprael_ani ls_s delay-3">쓰는 위대한 기업으로 도약하겠습니다.</span>
              </div>
            </div>
          </div>

          <div className="as_3_3 t_m_w">
            <div className="card_w">
              <img src="/img/about_3_card_3.jpg" />
            </div>
            <div className="as_text  ani_x">
              <h1 className="t_m_1 t_1 txt-ac fw-r">mission</h1>
              <span className="body-m t_2  t_m_2">( b )</span>
              <div className="body-m as_text_1 t_m_3">
                <span className="apprael_ani ls_s delay-1">단순한 헤어 디자인 기술을 넘어 고객의 삶에</span>
                <span className="apprael_ani ls_s delay-2">깊은 감동을 선사하는 '행복 스타일리스트'로서,</span>
                <span className="apprael_ani ls_s delay-3">모든 사람들과 함께 성공하고 꿈을 이뤄갑니다.</span>
              </div>
            </div>
          </div>
        </section>
        <section className="as_4 bg-gray-2">
          <div className="as_4_1 t_m_w">
            <div className="card_w">
              <img src="/img/about_4_card_1.jpg" />
            </div>
          </div>
        </section>

        
      </div>
    </main>
  );
}

export default About;
