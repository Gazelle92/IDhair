import { useEffect, useState } from "react";
import TransitionLink from "./TransitionLink";
import Salon from "./Salon";
import "../styles/header.scss";

function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [salonOpen, setSalonOpen] = useState(false);
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
        <TransitionLink to="/" className="logo">
          <img src="/img/h_logo.svg" alt="IDhair" />
        </TransitionLink>
      </div>

      <div className="gnb body-l">
        <TransitionLink to="/about"><span>ABOUT</span></TransitionLink>
        <TransitionLink to="/academy"><span>id ACADEMY</span></TransitionLink>
        <TransitionLink to="/magazine"><span>id MAGAZINE</span></TransitionLink>
        <TransitionLink to="/recruit"><span>RECRUIT</span></TransitionLink>
      </div>
      
      <div className="header_inner test">
        

        <div className="lang body-s">
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

          <button
            type="button"
            className="salon_btn bg-ac-1 body-m"
            onClick={() => setSalonOpen(true)}
          >
            SALON
          </button>
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
            <TransitionLink to="/salon" onClick={() => setNavOpen(false)}>Salon</TransitionLink>
            <TransitionLink to="/hair" onClick={() => setNavOpen(false)}>id Hair</TransitionLink>
            <TransitionLink to="/academy" onClick={() => setNavOpen(false)}>id Academy</TransitionLink>
            <TransitionLink to="/recruit" onClick={() => setNavOpen(false)}>Recruit</TransitionLink>
          </div>

          <div className="h_nav_group_2 body-m">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer">INSTAGRAM</a>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer">YOUTUBE</a>
          </div>

          <div className="h_nav_group_3">
            <span className="gt display-xs">id Magazine</span>
            <ul className="body-s">
              <li><TransitionLink to="/magazine/id-news" onClick={() => setNavOpen(false)}>id NEWS</TransitionLink></li>
              <li><TransitionLink to="/magazine/id-event" onClick={() => setNavOpen(false)}>id EVENT</TransitionLink></li>
              <li><TransitionLink to="/magazine/id-family" onClick={() => setNavOpen(false)}>id FAMILY</TransitionLink></li>
              <li><TransitionLink to="/magazine/id-gallery" onClick={() => setNavOpen(false)}>id GALLERY</TransitionLink></li>
              <li><TransitionLink to="/magazine/id-play" onClick={() => setNavOpen(false)}>id PLAY</TransitionLink></li>
            </ul>
          </div>

          <div className="h_nav_group_4 txt-gray caption-m">
            서울특별시 마포구 연희로 11 한국특허정보원 6층,<br />
            (주)아이디뷰티
          </div>
        </div>
      </nav>

      <Salon open={salonOpen} onClose={() => setSalonOpen(false)} />
    </header>
  );
}

export default Header;
