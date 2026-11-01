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

document.querySelectorAll(".byod-carousel").forEach((root) => {
  const track = root.querySelector(".byod-carousel-track");
  const slides = [...track.children];
  const dots = root.querySelector(".byod-carousel-dots");
  const buttons = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Go to slide ${i + 1}`);
    b.addEventListener("click", () => go(i));
    dots.appendChild(b);
    return b;
  });
  const index = () => Math.round(track.scrollLeft / track.clientWidth);
  const go = (i) => {
    const n = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: n * track.clientWidth, behavior: reduce ? "auto" : "smooth" });
  };
  const sync = () => buttons.forEach((b, i) => b.setAttribute("aria-current", String(i === index())));
  track.addEventListener("scroll", sync, { passive: true });
  root.querySelector(".byod-carousel-prev").addEventListener("click", () => go(index() - 1));
  root.querySelector(".byod-carousel-next").addEventListener("click", () => go(index() + 1));
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") go(index() - 1);
    if (e.key === "ArrowRight") go(index() + 1);
  });
  sync();
});
