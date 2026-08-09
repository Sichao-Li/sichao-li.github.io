import { useCallback, useEffect, useRef, useState } from "react";

const DIRECTION_KEYS = new Map([
  ["ArrowLeft", -1],
  ["ArrowUp", -1],
  ["ArrowRight", 1],
  ["ArrowDown", 1],
]);
const WHEEL_THRESHOLD = 24;
const WHEEL_LOCK_MS = 720;

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));

function isInteractiveTarget(target) {
  return (
    target instanceof Element &&
    target.closest("a, button, input, select, textarea, [contenteditable]")
  );
}

export function useReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event) => setReduceMotion(event.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return reduceMotion;
}

export function useSectionNavigation(sectionCount, reduceMotion) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigationRef = useRef(null);
  const lastIndex = sectionCount - 1;

  const selectSection = useCallback(
    (index) => setActiveIndex(clamp(index, 0, lastIndex)),
    [lastIndex],
  );

  useEffect(() => {
    const navigation = navigationRef.current;
    if (!navigation) return;

    if (activeIndex === 0) {
      navigation.scrollTo({
        left: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
      return;
    }

    navigation
      .querySelector(`[data-nav-index="${activeIndex}"]`)
      ?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "nearest",
        inline: "center",
      });
  }, [activeIndex, reduceMotion]);

  useEffect(() => {
    let wheelLocked = false;
    let wheelTimer;

    const move = (direction) => {
      setActiveIndex((current) => clamp(current + direction, 0, lastIndex));
    };

    const handleWheel = (event) => {
      if (
        wheelLocked ||
        Math.abs(event.deltaY) < WHEEL_THRESHOLD ||
        (event.target instanceof Element &&
          event.target.closest(".scene-nav, .scene-summary"))
      ) {
        return;
      }
      wheelLocked = true;
      move(Math.sign(event.deltaY));
      wheelTimer = window.setTimeout(() => {
        wheelLocked = false;
      }, WHEEL_LOCK_MS);
    };

    const handleKeyDown = (event) => {
      const direction = DIRECTION_KEYS.get(event.key);
      if (!direction || isInteractiveTarget(event.target)) return;
      event.preventDefault();
      move(direction);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(wheelTimer);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lastIndex]);

  return { activeIndex, navigationRef, selectSection };
}
