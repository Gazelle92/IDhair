import { useEffect, useMemo, useState } from "react";
import { salonRegions } from "../data/salonRegions";
import "../styles/Salon.scss";

function Salon({ open, onClose }) {
  const [selectedRegionId, setSelectedRegionId] = useState(salonRegions[0].id);
  const [selectedStoreId, setSelectedStoreId] = useState(salonRegions[0].stores[0].id);

  const selectedRegion = useMemo(
    () => salonRegions.find((region) => region.id === selectedRegionId) ?? salonRegions[0],
    [selectedRegionId]
  );
  const selectedStore = useMemo(
    () => selectedRegion.stores.find((store) => store.id === selectedStoreId) ?? selectedRegion.stores[0],
    [selectedRegion, selectedStoreId]
  );

  const handleRegionClick = (region) => {
    setSelectedRegionId(region.id);
    setSelectedStoreId(region.stores[0].id);
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
              <input className="head-m fw-sm" type="text" placeholder="지역 or 지점명 검색" />
              <button><img src="/img/icon_search.svg" alt="" /></button>
            </div>
          </div>
        </div>
        <div className="body">
          <div className="body_left">
            <div className="b_l_l">
              <ol className="head-m">
                {salonRegions.map((region) => (
                  <li key={region.id} className={region.id === selectedRegion.id ? "active" : ""}>
                    <button type="button" onClick={() => handleRegionClick(region)}>
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
                {selectedRegion.stores.map((store) => (
                  <li key={store.id} className={store.id === selectedStore.id ? "active" : ""}>
                    <button type="button" onClick={() => setSelectedStoreId(store.id)}>
                      {store.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="body_right">
            <div className="store_images">
              {selectedStore.images.map((image, index) => (
                <img key={image} src={image} alt={`${selectedStore.name} 이미지 ${index + 1}`} />
              ))}
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
              <div className="store_links body-m">
                <a href={selectedStore.instagramUrl} target="_blank" rel="noreferrer">
                  Instagram
                </a>
                <a href={selectedStore.reservationUrl} target="_blank" rel="noreferrer">
                  Naver Reservation
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Salon;
