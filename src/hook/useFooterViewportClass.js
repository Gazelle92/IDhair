import { useLayoutEffect } from "react";

// Shared by the Korean and English footer markup.
export default function useFooterViewportClass(footerRef, pathname) {
  useLayoutEffect(() => {
    const footer = footerRef.current;
    const root = document.getElementById("root");
    if (!footer || !root) return;

    const updateClass = () => {
      const rootHeight = root.getBoundingClientRect().height;
      // Allow for subpixel rounding in responsive layouts.
      footer.classList.toggle("footer_hide", Math.abs(rootHeight - window.innerHeight) < 1);
    };

    updateClass();
    const observer = new ResizeObserver(updateClass);
    observer.observe(root);
    window.addEventListener("resize", updateClass);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateClass);
      footer.classList.remove("footer_hide");
    };
  }, [footerRef, pathname]);
}
