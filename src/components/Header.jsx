import { useEffect, useState } from "react";
import "../styles/header.scss";

function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [navHide, setNavHide] = useState(false);
  const [headerActive, setHeaderActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeaderActive(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 100) {
        setNavHide(true);
      } else {
        setNavHide(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`header ani ${headerActive ? "active" : ""} ${navHide ? "nav_hide" : ""}`}>
      <div className="logo_w">
        <a href="/" className="logo">
          <img src="/img/h_logo.svg" alt="IDhair" />
        </a>
      </div>

      <div className="header_inner">
        <div className="gnb">
          <a href="/about"><span>ABOUT</span></a>
          <a href="/academy"><span>id ACADEMY</span></a>
          <a href="/magazine"><span>id MAGAZINE</span></a>
          <a href="/recruit"><span>RECRUIT</span></a>
        </div>

        <div className="lang">
          <span>(</span>
          <div className="active">KR</div>
          <div>EN</div>
          <span>)</span>
        </div>

        <div className="right_w bg-gray-3">
          <button
            type="button"
            className="menu_btn h_nav_open"
            onClick={() => setNavOpen(true)}
          >
            <span></span>
            <span></span>
          </button>

          <a href="/salon" className="salon_btn bg-ac-1">
            SALON
          </a>
        </div>
      </div>

      <nav className={`h_nav ${navOpen ? "active" : ""}`}>
        <div className="h_nav_bg"></div>

        <div className="h_nav_inner bg-gray-1">
          <button
            type="button"
            className="h_nav_close"
            onClick={() => setNavOpen(false)}
          >
            <span></span>
            <span></span>
          </button>

          <div className="h_nav_group_1 gt_all display-xs">
            <a href="/salon">Salon</a>
            <a href="/hair">id Hair</a>
            <a href="/academy">id Academy</a>
            <a href="/recruit">Recruit</a>
          </div>

          <div className="h_nav_group_2 body-m">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer">INSTAGRAM</a>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer">YOUTUBE</a>
          </div>

          <div className="h_nav_group_3">
            <span className="gt display-xs">id Magazine</span>
            <ul className="body-s">
              <li><a href="/magazine/news">id NEWS</a></li>
              <li><a href="/magazine/event">id EVENT</a></li>
              <li><a href="/magazine/family">id FAMILY</a></li>
              <li><a href="/magazine/gallery">id GALLERY</a></li>
              <li><a href="/magazine/play">id PLAY</a></li>
            </ul>
          </div>

          <div className="h_nav_group_4 txt-gray caption-m">
            서울특별시 마포구 연희로 11 한국특허정보원 6층,<br />
            (주)아이디뷰티
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;