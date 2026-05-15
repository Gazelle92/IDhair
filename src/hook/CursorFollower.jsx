import { useEffect, useState } from "react";
import { gsap } from "gsap";

const CursorFollower = () => {
  const [cursorClass, setCursorClass] = useState("");
  const [isCursorActive, setIsCursorActive] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const checkCursorActive = () => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isSmall = window.innerWidth <= 1024;

    return !(isTouch || isSmall);
  };

  const updateCursorMode = () => {
    setIsCursorActive(checkCursorActive());
  };

  useEffect(() => {
    updateCursorMode();
    window.addEventListener("resize", updateCursorMode);
    return () => window.removeEventListener("resize", updateCursorMode);
  }, []);

  useEffect(() => {
    const onMouseOut = (e) => {
      const toElement = e.relatedTarget || e.toElement;
      if (!toElement) setIsHidden(true);
    };
    const onMouseOver = () => setIsHidden(false);

    window.addEventListener("mouseout", onMouseOut);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  useEffect(() => {
    if (!isCursorActive) return;

    const moveCursor = (e) => {
      gsap.to(".cursor", {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [isCursorActive]);

  useEffect(() => {
    if (!isCursorActive) return;

    const handleMouseOver = (e) => {
      if (e.target.closest(".mg_li")) {
        setCursorClass("cursor_view");
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest(".mg_li")) {
        setCursorClass("");
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isCursorActive]);

  const cursorClasses = [
    "cursor",
    cursorClass,
    isCursorActive ? "" : "cursor_close",
    isHidden ? "hidden" : "",
  ].join(" ");

  return (
    <div className={cursorClasses}>
      <div className="cursor-inner">
        <span></span><span></span><span></span><span></span>
      </div>
      <span className="cursor-txt cursor-txt-view">View</span>
      <span className="cursor-txt cursor-txt-detail">Details</span>
      <span className="cursor-txt cursor-txt-close">Close</span>
      <span className="cursor-txt cursor-txt-play">PLAY</span>
      <span className="cursor-txt cursor-txt-pause">PAUSE</span>
    </div>
  );
};

export default CursorFollower;