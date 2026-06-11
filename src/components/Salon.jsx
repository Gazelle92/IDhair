import { useEffect } from "react";
import "../styles/Salon.scss";

function Salon({ open, onClose }) {
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
                <li>서울</li>
                <li>경기</li>
                <li>지방</li>
              </ol>
              <a className="arc_logo"><img src="/img/arc.png" alt="" /></a>
            </div>
            
            <ul className="b_l_r"></ul>
          </div>
          <div className="body_right"></div>

        </div>
      </div>
    </div>
  );
}

export default Salon;
