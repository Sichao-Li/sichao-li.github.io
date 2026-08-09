const reduceRoomMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const navigationSelector = "[data-room-navigation]";
const transitionDelay = 220;

function hasNavigationModifier(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

document.addEventListener("click", (event) => {
  const link = event.target.closest(navigationSelector);
  if (
    !link ||
    event.defaultPrevented ||
    event.button !== 0 ||
    reduceRoomMotion.matches ||
    hasNavigationModifier(event) ||
    link.target ||
    link.hasAttribute("download")
  ) {
    return;
  }

  const destination = new URL(link.href, window.location.href);
  if (destination.origin !== window.location.origin) return;

  event.preventDefault();
  document.body.classList.add("is-leaving-room");
  window.setTimeout(
    () => window.location.assign(destination.href),
    transitionDelay,
  );
});

window.addEventListener("pageshow", () => {
  document.body.classList.remove("is-leaving-room");
});
