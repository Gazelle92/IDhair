import { useLayoutEffect } from "react";

const fadeSliceOriginalTexts = new WeakMap();

function applyFadeSlice(target, description) {
  if (!target) return;

  const text = (description || target.innerText || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return;

  target.innerHTML = "";

  const words = text.split(" ");
  const maxWidth = target.clientWidth;
  const lines = [];
  let current = [];

  const measure = document.createElement("span");
  Object.assign(measure.style, {
    position: "absolute",
    visibility: "hidden",
    whiteSpace: "nowrap",
    top: "-9999px",
    left: "-9999px",
    fontFamily: getComputedStyle(target).fontFamily,
    fontSize: getComputedStyle(target).fontSize,
    fontWeight: getComputedStyle(target).fontWeight,
    letterSpacing: getComputedStyle(target).letterSpacing,
  });

  document.body.appendChild(measure);

  const getWidth = (arr) => {
    measure.textContent = arr.join(" ");
    return measure.offsetWidth;
  };

  words.forEach((word) => {
    const test = [...current, word];

    if (getWidth(test) > maxWidth && current.length > 0) {
      lines.push([...current]);
      current = [word];
    } else {
      current.push(word);
    }
  });

  if (current.length) lines.push(current);

  measure.remove();

  lines.forEach((lineWords) => {
    const line = document.createElement("div");
    const inner = document.createElement("div");

    line.className = "line";
    inner.className = "inner";

    lineWords.forEach((word, idx) => {
      const span = document.createElement("span");
      span.textContent = word;
      inner.appendChild(span);

      if (idx < lineWords.length - 1) {
        inner.appendChild(document.createTextNode(" "));
      }
    });

    line.appendChild(inner);
    target.appendChild(line);
  });
}

function initFadeSliceAll() {
  document.querySelectorAll(".fade-slice").forEach((el) => {
    const original = el.dataset.description || el.innerText || "";

    fadeSliceOriginalTexts.set(el, original);
    applyFadeSlice(el, original);
  });
}

function updateFadeSliceAll() {
  document.querySelectorAll(".fade-slice").forEach((el) => {
    const original = fadeSliceOriginalTexts.get(el) || el.innerText;
    applyFadeSlice(el, original);
  });
}

export default function useFadeSlice() {
  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      initFadeSliceAll();
      updateFadeSliceAll();
    }, 30);

    window.addEventListener("resize", updateFadeSliceAll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateFadeSliceAll);
    };
  });
}