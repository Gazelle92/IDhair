import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const fadeSliceOriginalTexts = new WeakMap();
const BR_TOKEN = "__FADE_SLICE_BR__";
const LINE_BREAK_TOKEN = "__FADE_SLICE_LINE_BREAK__";

function getFadeSliceText(description, target) {
  const source = description || target.innerHTML || target.innerText || "";

  return source
    .replace(/<br\s*\/?>/gi, ` ${BR_TOKEN} `)
    .replace(/<\/?[^>]+>/g, "")
    .replace(/[^\S\r\n]+/g, " ")
    .trim();
}

function applyFadeSlice(target, description) {
  if (!target) return;

  const text = getFadeSliceText(description, target);

  if (!text) return;

  target.innerHTML = "";

  const words = text.split(" ").filter(Boolean);
  const tokens = [];

  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];

    if (word !== BR_TOKEN) {
      tokens.push(word);
      continue;
    }

    let brCount = 1;

    while (words[index + 1] === BR_TOKEN) {
      brCount += 1;
      index += 1;
    }

    tokens.push(brCount > 1 ? BR_TOKEN : LINE_BREAK_TOKEN);
  }
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

  tokens.forEach((word) => {
    if (word === LINE_BREAK_TOKEN) {
      if (current.length) {
        lines.push([...current]);
        current = [];
      }

      return;
    }

    if (word === BR_TOKEN) {
      if (current.length) {
        lines.push([...current]);
        current = [];
      }

      lines.push(BR_TOKEN);
      return;
    }

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
    if (lineWords === BR_TOKEN) {
      target.appendChild(document.createElement("br"));
      return;
    }

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
    const original = el.dataset.description || el.innerHTML || "";

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
  const location = useLocation();

  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      initFadeSliceAll();
      updateFadeSliceAll();
    }, 80);

    window.addEventListener("resize", updateFadeSliceAll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateFadeSliceAll);
    };
  }, [location.pathname]);
}
