import { useEffect, useMemo, useState } from "react";
import "../styles/Salon.scss";

const salonRegions = [
  {
    id: "seoul",
    name: "서울",
    stores: [
      { id: "seoul-1", name: "서울지점 1", address: "서울특별시 강남구 테스트로 101", phone: "02-111-0001", hours: "10:00 - 20:00" },
      { id: "seoul-2", name: "서울지점 2", address: "서울특별시 마포구 테스트로 202", phone: "02-111-0002", hours: "10:00 - 20:00" },
      { id: "seoul-3", name: "서울지점 3", address: "서울특별시 송파구 테스트로 303", phone: "02-111-0003", hours: "10:00 - 20:00" },
      { id: "seoul-4", name: "서울지점 4", address: "서울특별시 용산구 테스트로 404", phone: "02-111-0004", hours: "10:00 - 20:00" },
    ],
  },
  {
    id: "gyeonggi",
    name: "경기",
    stores: [
      { id: "gyeonggi-1", name: "경기도지점 1", address: "경기도 성남시 테스트로 101", phone: "031-111-0001", hours: "10:00 - 20:00" },
      { id: "gyeonggi-2", name: "경기도지점 2", address: "경기도 수원시 테스트로 202", phone: "031-111-0002", hours: "10:00 - 20:00" },
      { id: "gyeonggi-3", name: "경기도지점 3", address: "경기도 고양시 테스트로 303", phone: "031-111-0003", hours: "10:00 - 20:00" },
      { id: "gyeonggi-4", name: "경기도지점 4", address: "경기도 부천시 테스트로 404", phone: "031-111-0004", hours: "10:00 - 20:00" },
    ],
  },
  {
    id: "local",
    name: "지방",
    stores: [
      { id: "local-1", name: "지방지점 1", address: "부산광역시 테스트로 101", phone: "051-111-0001", hours: "10:00 - 20:00" },
      { id: "local-2", name: "지방지점 2", address: "대구광역시 테스트로 202", phone: "053-111-0002", hours: "10:00 - 20:00" },
      { id: "local-3", name: "지방지점 3", address: "광주광역시 테스트로 303", phone: "062-111-0003", hours: "10:00 - 20:00" },
      { id: "local-4", name: "지방지점 4", address: "대전광역시 테스트로 404", phone: "042-111-0004", hours: "10:00 - 20:00" },
    ],
  },
];

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
            
            <ul className="b_l_r head-s">
              {selectedRegion.stores.map((store) => (
                <li key={store.id} className={store.id === selectedStore.id ? "active" : ""}>
                  <button type="button" onClick={() => setSelectedStoreId(store.id)}>
                    {store.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="body_right">
            <div className="store_detail">
              <span className="store_region body-m">{selectedRegion.name}</span>
              <h2 className="head-l fw-sb">{selectedStore.name}</h2>
              <dl className="body-m">
                <div>
                  <dt>주소</dt>
                  <dd>{selectedStore.address}</dd>
                </div>
                <div>
                  <dt>전화</dt>
                  <dd>{selectedStore.phone}</dd>
                </div>
                <div>
                  <dt>영업시간</dt>
                  <dd>{selectedStore.hours}</dd>
                </div>
              </dl>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Salon;
