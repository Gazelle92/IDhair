import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import TransitionLink from "../../components/TransitionLink";
import { eventItems, familyItems, galleryItems, magazinePageSettings, makeMagazineItems } from "./magazineConfig";

const NEWS_CATEGORY = "id-news";
const EVENT_CATEGORY = "id-event";
const FAMILY_CATEGORY = "id-family";
const GALLERY_CATEGORY = "id-gallery";
const PLAY_CATEGORY = "id-play";

const newsTitles = [
  "새로운 브랜드 캠페인을 통해 선보이는 아이디헤어의 방향성과 감각",
  "강남지점 리뉴얼로 완성된 편안하고 세련된 공간",
  "아카데미 신규 교육 프로그램으로 강화된 전문 커리큘럼",
  "고객 경험 강화를 위한 서비스 전반의 리뉴얼",
  "브랜드 비주얼 아이덴티티 정비를 통한 일관된 이미지 구축",
];

const NEWS_ITEMS = makeMagazineItems(
  NEWS_CATEGORY,
  "id NEWS layout",
  magazinePageSettings[NEWS_CATEGORY].totalItems
).slice(0, 5).map((item, index) => ({
  ...item,
  title: newsTitles[index],
}));

const EVENT_ITEMS = eventItems(
  EVENT_CATEGORY,
  "id EVENT layout",
  magazinePageSettings[EVENT_CATEGORY].totalItems
).slice(0, 4);

const FAMILY_ITEMS = familyItems(
  FAMILY_CATEGORY,
  "id FAMILY layout",
  magazinePageSettings[FAMILY_CATEGORY].totalItems
).slice(0, 2);

const GALLERY_ITEMS = galleryItems(
  GALLERY_CATEGORY,
  "id GALLERY layout",
  magazinePageSettings[GALLERY_CATEGORY].totalItems
).slice(0, 4);

const PLAY_ITEMS = makeMagazineItems(
  PLAY_CATEGORY,
  "id PLAY layout",
  magazinePageSettings[PLAY_CATEGORY].totalItems
).slice(0, 8);

const getPlayTypeClass = (index) => {
  const types = ["type-a", "type-b"];
  return types[index % types.length];
};

function OurPicks() {
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);
  const previewRefs = useRef([]);
  const gallerySectionRef = useRef(null);

  const handleNewsEnter = (index) => {
    if (index === activeNewsIndex) return;

    setActiveNewsIndex(index);
  };

  useEffect(() => {
    const previews = previewRefs.current.filter(Boolean);

    if (!previews.length) return undefined;

    previews.forEach((preview, index) => {
      gsap.to(preview, {
        clipPath: index <= activeNewsIndex ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
        opacity: 1,
        duration: 0.72,
        ease: "expo.inOut",
        overwrite: "auto",
      });
    });

    return () => {
      gsap.killTweensOf(previews);
    };
  }, [activeNewsIndex]);

  useEffect(() => {
    const gallerySection = gallerySectionRef.current;
    if (!gallerySection) return undefined;

    const updateGalleryBackground = () => {
      const triggerPoint = gallerySection.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.42;
      document.body.classList.toggle("ourpicks-gallery-active", window.scrollY >= triggerPoint);
    };

    updateGalleryBackground();
    window.addEventListener("scroll", updateGalleryBackground);
    window.addEventListener("resize", updateGalleryBackground);

    return () => {
      window.removeEventListener("scroll", updateGalleryBackground);
      window.removeEventListener("resize", updateGalleryBackground);
      document.body.classList.remove("ourpicks-gallery-active");
    };
  }, []);

  return (
    <div className="ourpicks_page">
      <section className="ourpicks_news ani">
        <div className="ourpicks_section_head">
          <div className="ourpicks_section_title fadeX-1">
            <h2 className="display-xs gt ">id NEWS</h2>
            <p className="body-s txt-gray ">아이디헤어의 새로운 소식과 주요 이야기를 전하는 뉴스 콘텐츠</p>
          </div>
          <TransitionLink to="/magazine/id-news" className="ourpicks_view_all body-m fadeX-5">
            <span>VIEW ALL</span>
            <span aria-hidden="true"></span>
          </TransitionLink>
        </div>

        <div className="ourpicks_news_body b-t b-2 b-delay-4">
          <div className="ourpicks_news_preview" aria-hidden="true">
            {NEWS_ITEMS.map((item, index) => (
              <img
                className={`ourpicks_news_preview_img ${activeNewsIndex === index ? "active" : ""}`}
                src={item.img}
                alt=""
                key={item.id}
                ref={(element) => {
                  previewRefs.current[index] = element;
                }}
              />
            ))}
          </div>

          <ul className="ourpicks_news_list b-l b-delay-10">
            {NEWS_ITEMS.map((item, index) => (
              <li
                className={`ourpicks_news_item fadeX-${index + 12} ${activeNewsIndex === index ? "active" : ""}`}
                key={item.id}
                onMouseEnter={() => handleNewsEnter(index)}
                onFocus={() => handleNewsEnter(index)}
              >
                <TransitionLink to={`/magazine/${NEWS_CATEGORY}/post/${item.id}`} className="ourpicks_news_link">
                  <span className="date txt-gray caption-m">{item.date}</span>
                  <strong className="head-s">{item.title}</strong>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ourpicks_news ani">
        <div className="ourpicks_section_head">
          <div className="ourpicks_section_title fadeX-1">
            <h2 className="display-xs gt ">id EVENT</h2>
            <p className="body-s txt-gray ">아이디헤어에서 진행하는 다양한 혜택과 특별한 이벤트를 만나볼 수 있는 공간</p>
          </div>
          <TransitionLink to="/magazine/id-event" className="ourpicks_view_all body-m fadeX-5">
            <span>VIEW ALL</span>
            <span aria-hidden="true"></span>
          </TransitionLink>
        </div>

        <ul className="mg_list mg_list_event ani b-t b-2 b-delay-4">
          {EVENT_ITEMS.map((item) => (
            <li className="mg_li ani" key={item.id}>
              <TransitionLink to={`/magazine/${EVENT_CATEGORY}/post/${item.id}`} className="mg_a">
                <img src={item.img} alt="Magazine Image" />
              </TransitionLink>
            </li>
          ))}
        </ul>
      </section>

      <section className="ourpicks_news ani">
        <div className="ourpicks_section_head">
          <div className="ourpicks_section_title fadeX-1">
            <h2 className="display-xs gt ">id FAMILY</h2>
            <p className="body-s txt-gray ">아이디헤어 스태프들의 이야기를 전하는 인터뷰 콘텐츠</p>
          </div>
          <TransitionLink to="/magazine/id-family" className="ourpicks_view_all body-m fadeX-5">
            <span>VIEW ALL</span>
            <span aria-hidden="true"></span>
          </TransitionLink>
        </div>

        <ul className="mg_list mg_list_family ani b-t b-2 b-delay-4">
          {FAMILY_ITEMS.map((item) => (
            <li className="mg_li ani" key={item.id}>
              <TransitionLink to={`/magazine/${FAMILY_CATEGORY}/post/${item.id}`} className="mg_a">
                <img src={item.img} alt="Magazine Image" />
              </TransitionLink>
            </li>
          ))}
        </ul>
      </section>

      <section className="ourpicks_news ourpicks_gallery ani" ref={gallerySectionRef}>
        <div className="ourpicks_section_head">
          <div className="ourpicks_section_title fadeX-1">
            <h2 className="display-xs gt ">id GALLERY</h2>
            <p className="body-s txt-gray ">시즌별 헤어 룩북을 통해 아이디헤어의 스타일과 방향성을 보여주는 갤러리</p>
          </div>
          <TransitionLink to="/magazine/id-gallery" className="ourpicks_view_all body-m fadeX-5">
            <span>VIEW ALL</span>
            <span aria-hidden="true"></span>
          </TransitionLink>
        </div>

        <div className="ourpicks_gallery_visual ani b-c-gray b-t b-2 b-delay-4">
          <TransitionLink
            to={`/magazine/${GALLERY_CATEGORY}/post/${GALLERY_ITEMS[1]?.id}`}
            className="ourpicks_gallery_card ourpicks_gallery_card_main ani"
          >
            <img src={GALLERY_ITEMS[1]?.img} alt="Magazine Image" />
          </TransitionLink>

          <div className="ourpicks_gallery_title ani">
            <h3 className="display-xs apprael">
              <span>{GALLERY_ITEMS[0]?.date} S/S</span>
              <span>Collection</span>
            </h3>
            <p className="caption-m">“ 나다움을 마주하는 계절의 시작 “</p>
          </div>

          <TransitionLink
            to={`/magazine/${GALLERY_CATEGORY}/post/${GALLERY_ITEMS[2]?.id}`}
            className="ourpicks_gallery_card ourpicks_gallery_card_sub ani"
          >
            <img src={GALLERY_ITEMS[2]?.img} alt="Magazine Image" />
            <span className="caption-m">2025 A/W<br />Collection</span>
          </TransitionLink>

          <TransitionLink
            to={`/magazine/${GALLERY_CATEGORY}/post/${GALLERY_ITEMS[3]?.id}`}
            className="ourpicks_gallery_card ourpicks_gallery_card_side ani"
          >
            <span className="caption-m">2026 S/S<br />Collection</span>
            <img src={GALLERY_ITEMS[3]?.img} alt="Magazine Image" />
          </TransitionLink>
        </div>
      </section>

      <section className="ourpicks_news ourpicks_play ani">
        <div className="ourpicks_section_head">
          <div className="ourpicks_section_title fadeX-1">
            <h2 className="display-xs gt ">id PLAY</h2>
            <p className="body-s txt-gray ">인스타그램과 유튜브 등 다양한 SNS 콘텐츠를 한곳에서 보여주는 id PLAY</p>
          </div>
          <TransitionLink to="/magazine/id-play" className="ourpicks_view_all body-m fadeX-5">
            <span>VIEW ALL</span>
            <span aria-hidden="true"></span>
          </TransitionLink>
        </div>

        <div className="ourpicks_play_slider ani b-t b-2 b-delay-4">
          <Swiper
            className="ourpicks_play_swiper"
            slidesPerView="auto"
            spaceBetween={40}
            grabCursor
            breakpoints={{
              0: {
                spaceBetween: 16,
              },
              1025: {
                spaceBetween: 40,
              },
            }}
          >
            {PLAY_ITEMS.map((item, index) => (
              <SwiperSlide className={`ourpicks_play_slide ${getPlayTypeClass(index)}`} key={item.id}>
                <TransitionLink to={`/magazine/${PLAY_CATEGORY}/post/${item.id}`} className="ourpicks_play_link">
                  <img src={item.img} alt="Magazine Image" />
                </TransitionLink>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
}

export default OurPicks;
