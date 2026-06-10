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
      <div className="salon_popup_page" role="dialog" aria-modal="true" aria-label="Salon"></div>
    </div>
  );
}

export default Salon;
