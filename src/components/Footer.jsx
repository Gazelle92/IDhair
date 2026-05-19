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
            <a className="footer_logo" href="/"><img src="/img/f_logo.svg"/></a>
            <ul className="f_link head-m">
                <li><a href="">ABOUT</a></li>
                <li><a href="">SALON</a></li>
                <li><a href="">id MAGAZINE</a></li>
                <li><a href="">id ACADEMY</a></li>
                <li><a href="">RECRUIT</a></li>
            </ul>
            <div className="icon_w">
                <a target="_blank" href="https://www.instagram.com/idhair.official"><img src="/img/icon_instagram.svg"/></a>
                <a target="_blank" href="https://www.youtube.com/@idhairbrand"><img src="/img/icon_youtube.svg"/></a>
            </div>

            <ol className="body-s">
              <li>
                <div><h4>Email</h4></div>
                <div><span>idhairkorea@gmail.com</span></div>
              </li>

              <li>
                <div><h4>Phone</h4></div>
                <div><span>+82 2 2039 3301 ㅣ 10am - 5pm</span></div>
              </li>

              <li>
                <div><h4>Address</h4></div>
                <div><span>서울특별시 마포구 연희로 11 한국특허정보원 6층, (주)아이디뷰티</span></div>
              </li>

              <small className="body-s"><div>idHAIR © 2026</div></small>
            </ol>
        </div>
    </footer>
  );
}

export default Footer;