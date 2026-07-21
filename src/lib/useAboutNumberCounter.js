import { useEffect } from "react";

const COUNTER_SCOPE_SELECTOR = ".page_about";
const NESTED_COUNTER_TRIGGER_SELECTOR = ".as_7_2 .ani_x";
const NESTED_COUNTER_NUMBER_SELECTOR = "h1";
const DIRECT_COUNTER_SELECTOR = ".as_4 .number_count";
const COUNTER_DURATION = 1500;

function easeOut(value) {
  return 1 - Math.pow(1 - value, 3);
}

function getNumberData(element) {
  const rawText = element.dataset.aboutCounterTarget || element.textContent.trim();
  const match = rawText.match(/-?\d+(?:\.\d+)?/);

  if (!match) return null;

  return {
    decimals: match[0].includes(".") ? match[0].split(".")[1].length : 0,
    target: Number(match[0]),
  };
}

function setCounterText(element, value, decimals) {
  element.textContent = value.toFixed(decimals);
}

export default function useAboutNumberCounter() {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const scope = document.querySelector(COUNTER_SCOPE_SELECTOR);
    if (!scope) return undefined;

    const runningFrames = new Map();

    function prepareNumber(element) {
      const data = getNumberData(element);
      if (!data) return;

      element.dataset.aboutCounterTarget = String(data.target);
      element.dataset.aboutCounterDecimals = String(data.decimals);
      setCounterText(element, 0, data.decimals);
    }

    function animateNumber(element) {
      if (element.dataset.aboutCounterDone === "true") return;

      const target = Number(element.dataset.aboutCounterTarget);
      const decimals = Number(element.dataset.aboutCounterDecimals || 0);
      const startTime = performance.now();

      element.dataset.aboutCounterDone = "true";

      function step(now) {
        const progress = Math.min(1, (now - startTime) / COUNTER_DURATION);
        const easedProgress = easeOut(progress);

        setCounterText(element, target * easedProgress, decimals);

        if (progress < 1) {
          runningFrames.set(element, window.requestAnimationFrame(step));
        } else {
          setCounterText(element, target, decimals);
          runningFrames.delete(element);
        }
      }

      runningFrames.set(element, window.requestAnimationFrame(step));
    }

    function startCounter(trigger) {
      trigger.querySelectorAll(NESTED_COUNTER_NUMBER_SELECTOR).forEach(animateNumber);
    }

    function checkActiveTriggers() {
      scope.querySelectorAll(NESTED_COUNTER_TRIGGER_SELECTOR).forEach((trigger) => {
        if (trigger.classList.contains("active")) {
          startCounter(trigger);
        }
      });

      scope.querySelectorAll(DIRECT_COUNTER_SELECTOR).forEach((counter) => {
        if (counter.classList.contains("active")) {
          animateNumber(counter);
        }
      });
    }

    scope
      .querySelectorAll(`${NESTED_COUNTER_TRIGGER_SELECTOR} ${NESTED_COUNTER_NUMBER_SELECTOR}, ${DIRECT_COUNTER_SELECTOR}`)
      .forEach(prepareNumber);
    checkActiveTriggers();

    const observer = new MutationObserver(checkActiveTriggers);

    observer.observe(scope, {
      attributeFilter: ["class"],
      attributes: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      runningFrames.forEach((frameId) => {
        window.cancelAnimationFrame(frameId);
      });
      runningFrames.clear();
    };
  }, []);
}
