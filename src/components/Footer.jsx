import { useEffect, useState } from "react";
import "../styles/footer.scss";

function Footer() {


  useEffect(() => {
  const footer = document.querySelector("footer");
  const wrapper = document.querySelector("main");

  if (!footer || !wrapper) return;

  const setFooterHeight = () => {
    wrapper.style.setProperty("--footer-height", `${footer.offsetHeight}px`);
  };

  const checkFooterActive = () => {
    const footerHeight = footer.offsetHeight;
    const scrollBottom = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollBottom >= documentHeight - footerHeight / 3) {
      footer.classList.add("active");
    } else {
      footer.classList.remove("active");
    }
  };

  setFooterHeight();
  checkFooterActive();

  const observer = new ResizeObserver(() => {
    setFooterHeight();
    checkFooterActive();
  });

  observer.observe(footer);

  window.addEventListener("resize", setFooterHeight);
  window.addEventListener("resize", checkFooterActive);
  window.addEventListener("scroll", checkFooterActive);

  return () => {
    observer.disconnect();
    window.removeEventListener("resize", setFooterHeight);
    window.removeEventListener("resize", checkFooterActive);
    window.removeEventListener("scroll", checkFooterActive);
  };
}, []);

  return (
    <footer className="bg-ac-1 ani">
        <div className="footer_inner">
            <a className="footer_logo fade-cw" href="/"><img className="fast fadeY-1" src="/img/f_logo.svg"/></a>
            <ul className="f_link head-m">
                <li className="fade-cw"><a className="fast fadeY-2" href="">ABOUT</a></li>
                <li className="fade-cw"><a className="fast fadeY-3" href="">SALON</a></li>
                <li className="fade-cw"><a className="fast fadeY-4" href="">id MAGAZINE</a></li>
                <li className="fade-cw"><a className="fast fadeY-5" href="">id ACADEMY</a></li>
                <li className="fade-cw"><a className="fast fadeY-6" href="">RECRUIT</a></li>
            </ul>
            <div className="icon_w">
                <a className="fade-cw" target="_blank" href="https://www.instagram.com/idhair.official"><img className="fast fadeY-7" src="/img/icon_instagram.svg"/></a>
                <a className="fade-cw" target="_blank" href="https://www.youtube.com/@idhairbrand"><img className="fast fadeY-8" src="/img/icon_youtube.svg"/></a>
            </div>

            <ol className="body-s">
              <li>
                <div className="fade-cw"><h4 className="fast fadeY-10">Email</h4></div>
                <div className="fade-cw"><span className="fast fadeY-13">idhairkorea@gmail.com</span></div>
              </li>

              <li>
                <div className="fade-cw"><h4 className="fast fadeY-11">Phone</h4></div>
                <div className="fade-cw"><span className="fast fadeY-14">+82 2 2039 3301 ㅣ 10am - 5pm</span></div>
              </li>

              <li>
                <div className="fade-cw"><h4 className="fast fadeY-12">Address</h4></div>
                <div className="fade-cw"><span className="fast fadeY-15">서울특별시 마포구 연희로 11 한국특허정보원 6층, (주)아이디뷰티</span></div>
              </li>

              <small className="body-s fade-cw"><div className="fast fadeY-16">idHAIR © 2026</div></small>
            </ol>
        </div>
    </footer>
  );
}

export default Footer;