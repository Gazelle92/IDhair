import { useLayoutEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { gsap } from "gsap";
import Splitting from "splitting";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import OurPicks from "./magazine/OurPicks";
import IdNews from "./magazine/IdNews";
import IdEvent from "./magazine/IdEvent";
import IdFamily from "./magazine/IdFamily";
import IdGallery from "./magazine/IdGallery";
import IdPlay from "./magazine/IdPlay";
import { getTotalPages } from "./magazine/magazineConfig";
import "../styles/magazine.scss";

function Magazine() {
  const tabs = [
    { name: "Our PICKS", path: "our-picks" },
    { name: "id NEWS", path: "id-news" },
    { name: "id EVENT", path: "id-event" },
    { name: "id FAMILY", path: "id-family" },
    { name: "id GALLERY", path: "id-gallery" },
    { name: "id PLAY", path: "id-play" },
  ];

  const location = useLocation();
  const { category, pageSlug } = useParams();

  const currentCategory = category || "our-picks";
  const isTabMove = location.state?.fromMagazineTab === true;
  const currentPage = Number(pageSlug?.replace("list-", "") || 1);
  const totalPages = getTotalPages(currentCategory);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const currentTabName = tabs.find((tab) => tab.path === currentCategory)?.name || tabs[0].name;

  const listComponents = {
    "our-picks": <OurPicks currentPage={currentPage} />,
    "id-news": <IdNews currentPage={currentPage} />,
    "id-event": <IdEvent currentPage={currentPage} />,
    "id-family": <IdFamily currentPage={currentPage} />,
    "id-gallery": <IdGallery currentPage={currentPage} />,
    "id-play": <IdPlay currentPage={currentPage} />,
  };

  const getListUrl = (category, page = 1) => {
    return page === 1 ? `/magazine/${category}` : `/magazine/${category}/list-${page}`;
  };

  useLayoutEffect(() => {
  Splitting();

  const timer = setTimeout(() => {
    const titles = document.querySelectorAll("[data-effect17]");

    titles.forEach((title) => {
      const chars = title.querySelectorAll(".char");

      chars.forEach((char) => {
        gsap.set(char.parentNode, { perspective: 1000 });
      });

      gsap.fromTo(
        chars,
        {
          opacity: 0,
          rotateX: () => gsap.utils.random(-120, 120),
          z: () => gsap.utils.random(-200, 200),
          willChange: "opacity, transform",
        },
        {
          opacity: 1,
          rotateX: 0,
          z: 0,
          duration: 2.4,
          ease: "power3.out",
          stagger: 0.02,
        }
      );
    });
  }, 500); // 0.5초 후 시작

  return () => {
    clearTimeout(timer);
  };
}, []);

  return (
    <main className={`page_magazine ${isTabMove ? "tab_move" : ""}`}>
      <section className="mg_head b-t b-4 ani" data-keep-active-on-route>
        <div className="mg_title b-b b-delay-2 ">
          <h1 className="display-l apprael effect17-title apprael_all" data-splitting data-effect17 >ID MAGAZINE</h1>
          <div className="mg_title_right">
            <h4 className="gt display-xs fadeX-6">{currentTabName}</h4>
            <div className="body-m fadeX-7 txt">id HAIR가 큐레이션한 트렌드, 브랜드 소식을 통해</div>
            <div className="body-m fadeX-8 txt">라이프스타일을 담은 이야기를 전합니다.</div>
          </div>
        </div>

        <ul className="mg_nav b-t b-delay-4">
          {tabs.map((tab, i) => (
            <li key={tab.path} className={`${tab.path === "our-picks" ? "btn_all" : ""} fadeY-${6 + i}`}>
              <Link
                to={getListUrl(tab.path)}
                state={{ fromMagazineTab: true }}
                className={`body-m ${currentCategory === tab.path ? "active" : ""}`}
              >
                <span>{tab.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="mg_body">
        {listComponents[currentCategory] || listComponents["our-picks"]}

        <ul className="pagenation body-s txt-gray">
          <li>
            <Link to={getListUrl(currentCategory, Math.max(currentPage - 1, 1))}>
              <img src="/img/arrow_pg_left.svg" alt="" />
            </Link>
          </li>

          {pageNumbers.map((num) => (
            <li key={num}>
              <Link
                to={getListUrl(currentCategory, num)}
                className={currentPage === num ? "active" : ""}
              >
                {num}
              </Link>
            </li>
          ))}

          <li>
            <Link to={getListUrl(currentCategory, Math.min(currentPage + 1, totalPages))}>
              <img src="/img/arrow_pg_right.svg" alt="" />
            </Link>
          </li>
        </ul>

      </section>
      
    </main>
  );
}

export default Magazine;
