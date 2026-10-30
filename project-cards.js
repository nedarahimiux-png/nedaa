const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const cards = [...document.querySelectorAll(".project-card")];
const countDuration = 1200;
const animationFrames = new Set();
let cardObserver;

const setFinalValue = (value) => {
  const number = value.querySelector(".stat-number");
  if (!number) return;

  const target = Number(value.dataset.count);
  const decimals = Number(value.dataset.decimals || 0);
  const prefix = value.dataset.prefix || "";

  number.textContent = `${prefix}${target.toFixed(decimals)}`;
};

const animateValue = (value) => {
  const number = value.querySelector(".stat-number");
  if (!number) return;

  const target = Number(value.dataset.count);
  const decimals = Number(value.dataset.decimals || 0);
  const prefix = value.dataset.prefix || "";
  const startedAt = performance.now();
  let frameId = 0;

  const tick = (now) => {
    animationFrames.delete(frameId);
    const progress = Math.min(1, (now - startedAt) / countDuration);
    const eased = 1 - ((1 - progress) ** 3);
    number.textContent = `${prefix}${(target * eased).toFixed(decimals)}`;

    if (progress < 1) {
      frameId = window.requestAnimationFrame(tick);
      animationFrames.add(frameId);
    } else {
      number.textContent = `${prefix}${target.toFixed(decimals)}`;
    }
  };

  frameId = window.requestAnimationFrame(tick);
  animationFrames.add(frameId);
};

if (reducedMotion.matches) {
  document.querySelectorAll(".stat-value[data-count]").forEach(setFinalValue);
  document.querySelectorAll(".stat-arrow").forEach((arrow) => arrow.classList.add("is-visible"));
} else {
  document.body.classList.add("cards-motion-ready");
  document.querySelectorAll(".stat-value[data-count]").forEach((value) => {
    const number = value.querySelector(".stat-number");
    if (number) number.textContent = `${value.dataset.prefix || ""}${(0).toFixed(Number(value.dataset.decimals || 0))}`;
  });

  cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      if (reducedMotion.matches) {
        entry.target.querySelectorAll(".stat-value[data-count]").forEach(setFinalValue);
        entry.target.querySelectorAll(".stat-arrow").forEach((arrow) => arrow.classList.add("is-visible"));
        cardObserver.unobserve(entry.target);
        return;
      }

      entry.target.querySelectorAll(".stat-value[data-count]").forEach(animateValue);
      entry.target.querySelectorAll(".stat-arrow").forEach((arrow) => {
        window.setTimeout(() => arrow.classList.add("is-visible"), 300);
      });
      cardObserver.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  cards.forEach((card) => cardObserver.observe(card));
}

reducedMotion.addEventListener("change", (event) => {
  if (!event.matches) return;

  cardObserver?.disconnect();
  animationFrames.forEach((frame) => window.cancelAnimationFrame(frame));
  animationFrames.clear();
  document.body.classList.remove("cards-motion-ready");
  document.querySelectorAll(".stat-value[data-count]").forEach(setFinalValue);
  document.querySelectorAll(".stat-arrow").forEach((arrow) => arrow.classList.add("is-visible"));
});

cards.forEach((card) => {
  const cta = card.querySelector(".project-cta");
  const visual = card.querySelector(".project-visual");
  if (cta && visual) visual.addEventListener("click", () => { window.location.href = cta.href; });
});

if (!reducedMotion.matches && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  cards.forEach((card) => revealObserver.observe(card));
}

const countTos = [...document.querySelectorAll(".count-to")];
if (!reducedMotion.matches && "IntersectionObserver" in window) {
  countTos.forEach((el) => { el.textContent = "0"; });
  const toObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.to);
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / 1400);
        el.textContent = Math.round(target * (1 - (1 - p) ** 3));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      toObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  countTos.forEach((el) => toObserver.observe(el));
}
