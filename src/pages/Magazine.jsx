import { useEffect, useRef } from "react";
import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import Splitting from "splitting";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import "../styles/magazine.scss";

function Magazine() {

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
    <main className="page_magazine">
      <section className="mg_head b-t b-4 ani">
        <div className="mg_title ">
          <h1 className="display-l apprael effect17-title" data-splitting data-effect17 apprael_all>ID MAGAZINE</h1>
          <div className="mg_title_right">
            <h4 className="gt display-xs">id NEWS</h4>
            <span className="body-m">
              id HAIR가 큐레이션한 트렌드, 브랜드 소식을 통해<br/>
              라이프스타일을 담은 이야기를 전합니다.
            </span>
          </div>
        </div>

        <ul className="mg_nav bg-gray-1">

            <li className="btn_all"><button className="body-m active "><span>Our PICKS</span></button></li>
            <li><button className="body-m"><span>id NEWS</span></button></li>
            <li><button className="body-m"><span>id EVENT</span></button></li>
            <li><button className="body-m"><span>id FAMILY</span></button></li>
            <li><button className="body-m"><span>id GALLERY</span></button></li>
            <li><button className="body-m"><span>id PLAY</span></button></li>
   
        </ul>

      </section>
      <section className="mg_body">
        <ul className="mg_list mg_list_new">
          <li className="mg_li ani">
            <a href="/magazine_detail" className="mg_a">
            <span className="date txt-gray caption-m">2026.03.10</span>
            <h1 className="head-s">새로운 브랜드 캠페인을 통해 선보이는 아이디헤어의 방향성과 감각</h1>
            <img src="/img/mg_list_1.jpg" alt="Magazine Image" />
            </a>
          </li>
          <li className="mg_li ani">
            <a href="/magazine_detail" className="mg_a">
            <span className="date txt-gray caption-m">2026.03.10</span>
            <h1 className="head-s">새로운 브랜드 캠페인을 통해 선보이는 아이디헤어의 방향성과 감각</h1>
            <img src="/img/mg_list_2.jpg" alt="Magazine Image" />
            </a>
          </li>
          <li className="mg_li ani">
            <a href="/magazine_detail" className="mg_a">
            <span className="date txt-gray caption-m">2026.03.10</span>
            <h1 className="head-s">새로운 브랜드 캠페인을 통해 선보이는 아이디헤어의 방향성과 감각</h1>
            <img src="/img/mg_list_3.jpg" alt="Magazine Image" />
            </a>
          </li>
          <li className="mg_li ani">
            <a href="/magazine_detail" className="mg_a">
            <span className="date txt-gray caption-m">2026.03.10</span>
            <h1 className="head-s">새로운 브랜드 캠페인을 통해 선보이는 아이디헤어의 방향성과 감각</h1>
            <img src="/img/mg_list_4.jpg" alt="Magazine Image" />
            </a>
          </li>
        </ul>

        <ul className="mg_list mg_list_normal">
          <li className="mg_li ani">
            <a href="/magazine_detail" className="mg_a">
            <span className="date txt-gray caption-m">2026.03.10</span>
            <h1 className="body-m">새로운 브랜드 캠페인을 통해 선보이는 아이디헤어의 방향성과 감각</h1>
            <img src="/img/mg_list_1.jpg" alt="Magazine Image" />
            </a>
          </li>
          <li className="mg_li ani">
            <a href="/magazine_detail" className="mg_a">
            <span className="date txt-gray caption-m">2026.03.10</span>
            <h1 className="body-m">새로운 브랜드 캠페인을 통해 선보이는 아이디헤어의 방향성과 감각</h1>
            <img src="/img/mg_list_2.jpg" alt="Magazine Image" />
            </a>
          </li>
          <li className="mg_li ani">
            <a href="/magazine_detail" className="mg_a">
            <span className="date txt-gray caption-m">2026.03.10</span>
            <h1 className="body-m">새로운 브랜드 캠페인을 통해 선보이는 아이디헤어의 방향성과 감각</h1>
            <img src="/img/mg_list_3.jpg" alt="Magazine Image" />
            </a>
          </li>
          <li className="mg_li ani">
            <a href="/magazine_detail" className="mg_a">
            <span className="date txt-gray caption-m">2026.03.10</span>
            <h1 className="body-m">새로운 브랜드 캠페인을 통해 선보이는 아이디헤어의 방향성과 감각</h1>
            <img src="/img/mg_list_4.jpg" alt="Magazine Image" />
            </a>
          </li>
          <li className="mg_li ani">
            <a href="/magazine_detail" className="mg_a">
            <span className="date txt-gray caption-m">2026.03.10</span>
            <h1 className="body-m">새로운 브랜드 캠페인을 통해 선보이는 아이디헤어의 방향성과 감각</h1>
            <img src="/img/mg_list_1.jpg" alt="Magazine Image" />
            </a>
          </li>
          <li className="mg_li ani">
            <a href="/magazine_detail" className="mg_a">
            <span className="date txt-gray caption-m">2026.03.10</span>
            <h1 className="body-m">새로운 브랜드 캠페인을 통해 선보이는 아이디헤어의 방향성과 감각</h1>
            <img src="/img/mg_list_2.jpg" alt="Magazine Image" />
            </a>
          </li>
          <li className="mg_li ani">
            <a href="/magazine_detail" className="mg_a">
            <span className="date txt-gray caption-m">2026.03.10</span>
            <h1 className="body-m">새로운 브랜드 캠페인을 통해 선보이는 아이디헤어의 방향성과 감각</h1>
            <img src="/img/mg_list_3.jpg" alt="Magazine Image" />
            </a>
          </li>
          <li className="mg_li ani">
            <a href="/magazine_detail" className="mg_a">
            <span className="date txt-gray caption-m">2026.03.10</span>
            <h1 className="body-m">새로운 브랜드 캠페인을 통해 선보이는 아이디헤어의 방향성과 감각</h1>
            <img src="/img/mg_list_4.jpg" alt="Magazine Image" />
            </a>
          </li>
          <li className="mg_li ani">
            <a href="/magazine_detail" className="mg_a">
            <span className="date txt-gray caption-m">2026.03.10</span>
            <h1 className="body-m">새로운 브랜드 캠페인을 통해 선보이는 아이디헤어의 방향성과 감각</h1>
            <img src="/img/mg_list_1.jpg" alt="Magazine Image" />
            </a>
          </li>
          <li className="mg_li ani">
            <a href="/magazine_detail" className="mg_a">
            <span className="date txt-gray caption-m">2026.03.10</span>
            <h1 className="body-m">새로운 브랜드 캠페인을 통해 선보이는 아이디헤어의 방향성과 감각</h1>
            <img src="/img/mg_list_2.jpg" alt="Magazine Image" />
            </a>
          </li>
          <li className="mg_li ani">
            <a href="/magazine_detail" className="mg_a">
            <span className="date txt-gray caption-m">2026.03.10</span>
            <h1 className="body-m">새로운 브랜드 캠페인을 통해 선보이는 아이디헤어의 방향성과 감각</h1>
            <img src="/img/mg_list_3.jpg" alt="Magazine Image" />
            </a>
          </li>
          <li className="mg_li ani">
            <a href="/magazine_detail" className="mg_a">
            <span className="date txt-gray caption-m">2026.03.10</span>
            <h1 className="body-m">새로운 브랜드 캠페인을 통해 선보이는 아이디헤어의 방향성과 감각</h1>
            <img src="/img/mg_list_4.jpg" alt="Magazine Image" />
            </a>
          </li>
        </ul>

        <ul className="pagenation body-s txt-gray">
          <li><a><img src="/img/arrow_pg_left.svg" alt="" /></a></li>
          <li><a>1</a></li>
          <li><a>2</a></li>
          <li><a>3</a></li>
          <li><a>4</a></li>
          <li><a>5</a></li>
          <li><a><img src="/img/arrow_pg_right.svg" alt="" /></a></li>
        </ul>

      </section>
      
    </main>
  );
}

export default Magazine;