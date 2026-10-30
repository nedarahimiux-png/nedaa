const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const revealTargets = document.querySelectorAll(".ab-reveal, [data-signature]");
if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-in"));
}

const journal = document.querySelector("[data-journal]");
if (journal) {
  const track = journal.querySelector(".ab-wnd-track");
  const sticky = journal.querySelector(".ab-wnd-sticky");
  const panels = [...journal.querySelectorAll(".ab-panel")];
  const buttons = [...journal.querySelectorAll("[data-go]")];
  const desktop = window.matchMedia("(min-width: 901px)");
  let current = -1;

  const activate = (index) => {
    if (index === current) return;
    current = index;
    panels.forEach((panel, i) => {
      panel.classList.toggle("is-active", i === index);
      panel.toggleAttribute("inert", desktop.matches && i !== index);
    });
    buttons.forEach((button, i) => {
      if (i === index) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
  };

  const range = () => Math.max(1, track.offsetHeight - sticky.offsetHeight);

  const update = () => {
    if (!desktop.matches) {
      panels.forEach((panel) => panel.removeAttribute("inert"));
      current = -1;
      return;
    }
    const progress = Math.min(0.999, Math.max(0, -track.getBoundingClientRect().top / range()));
    activate(Math.floor(progress * panels.length));
  };

  buttons.forEach((button, i) => {
    button.addEventListener("click", () => {
      const top = track.getBoundingClientRect().top + window.scrollY;
      const target = top + ((i + 0.5) / panels.length) * range();
      window.scrollTo({ top: target, behavior: reduceMotion.matches ? "auto" : "smooth" });
    });
  });

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => { ticking = false; update(); });
  }, { passive: true });
  window.addEventListener("resize", update);
  desktop.addEventListener("change", update);
  update();
}

const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
if (parallaxItems.length && !reduceMotion.matches) {
  let ticking = false;

  const update = () => {
    ticking = false;
    parallaxItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * Number(item.dataset.parallax);
      item.style.translate = `0 ${offset.toFixed(1)}px`;
    });
  };

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }, { passive: true });
  update();
}
