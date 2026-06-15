import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const checkCursorActive = () => {
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isSmall = window.innerWidth <= 1024;

  return !(isTouch || isSmall);
};

const getCursorClass = (target) => {
  if (!(target instanceof Element)) return "";
  if (target.closest(".cursor_left")) return "cursor_left";
  if (target.closest(".cursor_right")) return "cursor_right";
  if (target.closest(".mg_li")) return "cursor_view";

  return "";
};

const CursorFollower = () => {
  const [cursorClass, setCursorClass] = useState("");
  const [isCursorActive, setIsCursorActive] = useState(() => checkCursorActive());
  const [isHidden, setIsHidden] = useState(false);
  const cursorClassRef = useRef("");

  const updateCursorClass = useCallback((nextCursorClass) => {
    if (cursorClassRef.current === nextCursorClass) return;

    cursorClassRef.current = nextCursorClass;
    setCursorClass(nextCursorClass);
  }, []);

  useEffect(() => {
    const updateCursorMode = () => {
      setIsCursorActive(checkCursorActive());
    };

    window.addEventListener("resize", updateCursorMode);
    return () => window.removeEventListener("resize", updateCursorMode);
  }, []);

  useEffect(() => {
    const onMouseOut = (e) => {
      const toElement = e.relatedTarget || e.toElement;
      if (!toElement) {
        setIsHidden(true);
        updateCursorClass("");
      }
    };
    const onMouseOver = () => setIsHidden(false);

    window.addEventListener("mouseout", onMouseOut);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, [updateCursorClass]);

  useEffect(() => {
    if (!isCursorActive) return;

    const moveCursor = (e) => {
      gsap.to(".cursor", {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: "power2.out"
      });

      updateCursorClass(getCursorClass(e.target));
    };

    const handleMouseLeave = () => {
      updateCursorClass("");
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isCursorActive, updateCursorClass]);

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
      <span className="cursor-txt cursor-txt-left"><img src="/img/arrow_left_cursor.svg"/></span>
      <span className="cursor-txt cursor-txt-right"><img src="/img/arrow_left_cursor.svg"/></span>
    </div>
  );
};

export default CursorFollower;
