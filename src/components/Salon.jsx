import { useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { salonRegions } from "../data/salonRegions";
import "../styles/Salon.scss";

function Salon({ open, onClose }) {
  const [selectedRegionId, setSelectedRegionId] = useState(salonRegions[0].id);
  const [selectedStoreId, setSelectedStoreId] = useState(salonRegions[0].stores[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");
  const imageSwiperRef = useRef(null);

  const flatStores = useMemo(
    () => salonRegions.flatMap((region) => region.stores),
    []
  );

  const selectedRegion = useMemo(
    () => salonRegions.find((region) => region.id === selectedRegionId) ?? salonRegions[0],
    [selectedRegionId]
  );
  const displayedStores = useMemo(() => {
    const query = submittedSearchQuery.trim().toLowerCase();

    if (!query) return selectedRegion.stores;

    return flatStores.filter((store) => (
      store.name.toLowerCase().includes(query) ||
      store.address.toLowerCase().includes(query)
    ));
  }, [flatStores, submittedSearchQuery, selectedRegion]);
  const selectedStore = useMemo(
    () => (
      displayedStores.find((store) => store.id === selectedStoreId) ??
      displayedStores[0] ??
      flatStores.find((store) => store.id === selectedStoreId) ??
      selectedRegion.stores[0]
    ),
    [displayedStores, flatStores, selectedRegion, selectedStoreId]
  );
  const handleRegionClick = (region) => {
    setSearchQuery("");
    setSubmittedSearchQuery("");
    setSelectedRegionId(region.id);
    setSelectedStoreId(region.stores[0].id);
  };

  const handleSearchSubmit = () => {
    setSubmittedSearchQuery(searchQuery);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const hasSubmittedSearch = submittedSearchQuery.trim() !== "";

  const handlePrevImage = () => {
    imageSwiperRef.current?.slidePrev();
  };

  const handleNextImage = () => {
    imageSwiperRef.current?.slideNext();
  };

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <div className={`salon_popup ${open ? "active" : ""}`} aria-hidden={!open}>
      <button type="button" className="salon_close" onClick={onClose} aria-label="Close salon popup">
        <span></span><span></span>
      </button>
      <div className="salon_popup_page" role="dialog" aria-modal="true" aria-label="Salon">
        <div className="head b-b b-2 b-c-white">
          <div className="apprael display-m b-r b-c-white head_left">SALON</div>
          <div className="head_right">
            <div className="search_w b-t b-c-white">
              <input
                className="head-m fw-sm"
                type="text"
                placeholder="주소 or 지점명 검색"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <button type="button" aria-label="Search salon" onClick={handleSearchSubmit}><img src="/img/icon_search.svg" alt="" /></button>
            </div>
          </div>
        </div>
        <div className="body">
          <div className="body_left">
            <div className="b_l_l">
              <ol className="head-m">
                {salonRegions.map((region) => (
                  <li key={region.id} className={!hasSubmittedSearch && region.id === selectedRegion.id ? "active" : ""}>
                    <button type="button" className="head-m" onClick={() => handleRegionClick(region)}>
                      {region.name}
                    </button>
                  </li>
                ))}
              </ol>
              <a className="arc_logo"><img src="/img/arc.png" alt="" /></a>
              <a className="find_store"><img src="/img/icon_find.png"/><span className="fw-sb body-l">가까운 매장찾기</span></a>
            </div>
            
            <div className="b_l_r head-s">
              <ul data-lenis-prevent>
                {displayedStores.map((store) => (
                  <li key={store.id} className={store.id === selectedStore.id ? "active" : ""}>
                    <button
                      type="button"
                      className="body-m"
                      onClick={() => {
                        setSelectedStoreId(store.id);
                      }}
                    >
                      {store.name}
                    </button>
                  </li>
                ))}
                {displayedStores.length === 0 && (
                  <li className="empty">검색 결과가 없습니다.</li>
                )}
              </ul>
            </div>
          </div>
          <div className="body_right">
            <div className="scroll-y">
              <div className="store_images">
                <Swiper
                  key={selectedStore.id}
                  className="img_w"
                  loop
                  speed={600}
                  slidesPerView={1}
                  onSwiper={(swiper) => {
                    imageSwiperRef.current = swiper;
                    swiper.slideToLoop(0, 0);
                  }}
                >
                  {selectedStore.images.map((image, index) => (
                    <SwiperSlide key={`${image}-${index}`}>
                      <img src={image} alt={`${selectedStore.name} 이미지 ${index + 1}`} />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <button type="button" className="cursor_left" onClick={handlePrevImage} aria-label="Previous salon image"></button>
                <button type="button" className="cursor_right" onClick={handleNextImage} aria-label="Next salon image"></button>
              </div>
              <div className="store_detail">
                <div className="store_info">
                  <h2 className="head-m fw-sb">{selectedStore.name}</h2>
                  <address className="body-m">{selectedStore.address}</address>
                  <dl className="body-m">
                    <div>
                      <dt>(T)&nbsp;&nbsp;&nbsp;&nbsp;</dt>
                      <dd>{selectedStore.phone}</dd>
                    </div>
                    <div>
                      <dt>(Hours)&nbsp;&nbsp;&nbsp;&nbsp;</dt>
                      <dd>{selectedStore.hours}</dd>
                    </div>
                    <div>
                      <dt>(Off)&nbsp;&nbsp;&nbsp;&nbsp;</dt>
                      <dd>{selectedStore.off}</dd>
                    </div>
                  </dl>
                </div>
                <div className="store_links">
                  <a href={selectedStore.instagramUrl} target="_blank" className="insta" rel="noreferrer">
                    <img src="/img/icon_instagram_w.svg"/>
                  </a>
                  <a href={selectedStore.reservationUrl} target="_blank" rel="noreferrer" className="naver">
                    <img src="/img/icon_naver.svg"/>
                    <span className="body-m">네이버 예약</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Salon;
