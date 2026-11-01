if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const taglineSegments = [...document.querySelectorAll(".tagline-segment")];
const caret = document.querySelector(".tagline-caret");
let typewriterFrame = 0;
let typewriterTimeout = 0;

if (reduceMotion.matches) {
  taglineSegments.forEach((segment) => {
    segment.textContent = segment.dataset.copy;
  });
} else {
  const fullTagline = taglineSegments.map((segment) => segment.dataset.copy).join("");
  const charactersPerSecond = 25;

  taglineSegments.forEach((segment) => {
    segment.textContent = "";
  });

  typewriterTimeout = window.setTimeout(() => {
    const startedAt = performance.now();

    const typeTagline = (now) => {
      const visibleCharacters = Math.min(
        fullTagline.length,
        Math.floor((now - startedAt) * charactersPerSecond / 1000)
      );
      let remaining = visibleCharacters;

      for (const segment of taglineSegments) {
        const text = segment.dataset.copy;
        const shown = Math.min(remaining, text.length);
        segment.textContent = text.slice(0, shown);
        remaining -= shown;
      }

      if (visibleCharacters < fullTagline.length) {
        typewriterFrame = window.requestAnimationFrame(typeTagline);
        return;
      }

      caret.classList.add("is-blinking");
    };

    typewriterFrame = window.requestAnimationFrame(typeTagline);
  }, 400);
}

reduceMotion.addEventListener("change", (event) => {
  if (!event.matches) return;

  window.clearTimeout(typewriterTimeout);
  window.cancelAnimationFrame(typewriterFrame);
  taglineSegments.forEach((segment) => {
    segment.textContent = segment.dataset.copy;
  });
  caret.classList.remove("is-blinking");
});
