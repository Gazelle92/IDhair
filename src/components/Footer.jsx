import { useEffect, useState } from "react";
import "../styles/footer.scss";

function Footer() {


  return (
    <footer className="bg-ac-1">
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
                <h4>Email</h4>
                <span>idhairkorea@gmail.com</span>
              </li>

              <li>
                <h4>Phone</h4>
                <span>+82 2 2039 3301 ㅣ 10am - 5pm</span>
              </li>

              <li>
                <h4>Address</h4>
                <span>서울특별시 마포구 연희로 11 한국특허정보원 6층, (주)아이디뷰티</span>
              </li>

              <small className="body-s">idHAIR © 2026</small>

            </ol>
        </div>
    </footer>
  );
}

export default Footer;