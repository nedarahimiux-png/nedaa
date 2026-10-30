const cursorMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
const reduceCursorMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (cursorMedia.matches && !reduceCursorMotion.matches) {
  const cursorOrbit = document.createElement("div");
  cursorOrbit.className = "cursor-orbit";
  cursorOrbit.setAttribute("aria-hidden", "true");
  document.body.append(cursorOrbit);

  let pointerX = -100;
  let pointerY = -100;
  let frame = 0;

  const renderCursor = () => {
    frame = 0;
    cursorOrbit.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
  };

  const moveCursor = (event) => {
    if (event.pointerType !== "mouse") return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursorOrbit.classList.add("is-visible");
    if (!frame) frame = window.requestAnimationFrame(renderCursor);
  };

  const updateHoverState = (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    const target = event.target instanceof Element ? event.target : null;
    cursorOrbit.classList.toggle(
      "is-hovering",
      Boolean(target?.closest("a, button, summary, [role='button'], input, select, textarea"))
    );
  };

  const disableCursor = () => {
    cursorOrbit.remove();
    window.removeEventListener("pointermove", moveCursor);
    window.removeEventListener("pointerover", updateHoverState);
  };

  window.addEventListener("pointermove", moveCursor, { passive: true });
  window.addEventListener("pointerover", updateHoverState, { passive: true });
  window.addEventListener("blur", () => cursorOrbit.classList.remove("is-visible"));
  cursorMedia.addEventListener("change", (event) => {
    if (!event.matches) disableCursor();
  });
  reduceCursorMotion.addEventListener("change", (event) => {
    if (event.matches) disableCursor();
  });
}
