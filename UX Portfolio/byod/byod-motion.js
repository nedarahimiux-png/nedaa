const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const targets = document.querySelectorAll(".byod-funnel, .byod-steps > div, .byod-stat, .byod-shot, .byod-compare, .spectrum-hero-stat, .byod-pair, .byod-journey");

const format = (el, value) => {
  const dec = Number(el.dataset.dec || 0);
  const text = value.toFixed(dec);
  return "comma" in el.dataset ? Number(text).toLocaleString("en-US") : text;
};

const countUp = (el) => {
  const to = Number(el.dataset.to);
  const start = performance.now();
  const duration = 1300;
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    el.textContent = format(el, to * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

if (!reduce && "IntersectionObserver" in window) {
  document.body.classList.add("byod-motion-ready");
  document.querySelectorAll(".b-num").forEach((el) => { el.textContent = format(el, 0); });
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-in");
      entry.target.querySelectorAll(".b-num").forEach(countUp);
      if (entry.target.classList.contains("b-num")) countUp(entry.target);
      io.unobserve(entry.target);
    }
  }, { threshold: 0.25 });
  targets.forEach((el) => io.observe(el));
}
