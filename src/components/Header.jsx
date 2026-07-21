import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import TransitionLink from "./TransitionLink";
import Salon from "./Salon";
import "../styles/header.scss";

const ABOUT_HORIZONTAL_SCROLL_EVENT = "about-horizontal-scroll";
const ABOUT_NAV_HIDE_MIN_WIDTH = 1024;
const NAV_HIDE_THRESHOLD = 100;

function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [salonOpen, setSalonOpen] = useState(false);
  const [navHide, setNavHide] = useState(false);
  const [headerActive, setHeaderActive] = useState(false);
  const location = useLocation();
  const aboutHorizontalXRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeaderActive(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const isAboutPage = location.pathname === "/about";
    const shouldUseAboutHorizontal = () => isAboutPage && window.innerWidth >= ABOUT_NAV_HIDE_MIN_WIDTH;
    const updateNavHide = () => {
      const scrollValue = shouldUseAboutHorizontal() ? aboutHorizontalXRef.current : window.scrollY;
      setNavHide(scrollValue > NAV_HIDE_THRESHOLD);
    };

    const handleScroll = () => updateNavHide();
    const handleResize = () => updateNavHide();
    const handleAboutHorizontalScroll = (event) => {
      aboutHorizontalXRef.current = event.detail?.x || 0;
      updateNavHide();
    };

    if (!isAboutPage) {
      aboutHorizontalXRef.current = 0;
    }

    updateNavHide();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    window.addEventListener(ABOUT_HORIZONTAL_SCROLL_EVENT, handleAboutHorizontalScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener(ABOUT_HORIZONTAL_SCROLL_EVENT, handleAboutHorizontalScroll);
    };
  }, [location.pathname]);

  return (
    <header className={`header ani ${headerActive ? "active" : ""} ${navHide ? "nav_hide" : ""}`}>
      <div className="logo_w">
        <TransitionLink to="/" className="logo">
          <img src="/img/h_logo.svg" alt="IDhair" />
          <img src="/img/logo_sub.svg"/>
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
