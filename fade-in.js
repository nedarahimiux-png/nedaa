(() => {
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const selector = [
    "main section:not(.hero):not(.ab-open) > *",
    ".site-footer",
    ".case-pagination",
  ].join(",");
  const skip = ".ab-reveal, [data-signature], .project-card, .byod-funnel, .byod-pair, .byod-journey, .byod-shot, .byod-stat, .byod-steps, .byod-stats";
  const pick = (el, depth = 0) => {
    if (el.matches(skip)) return [];
    const kids = [...el.children].filter((c) => !/^(SCRIPT|STYLE)$/.test(c.tagName));
    if (depth < 4 && kids.length > 1 && el.getBoundingClientRect().height > window.innerHeight * 0.8) {
      return kids.flatMap((c) => pick(c, depth + 1));
    }
    return [el];
  };
  const targets = [...new Set([...document.querySelectorAll(selector)].flatMap((el) => pick(el)))];

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const above = entry.boundingClientRect.top < 0;
      if (!entry.isIntersecting && !above) continue;
      if (above) entry.target.classList.add("fx-instant");
      entry.target.classList.add("fx-in");
      io.unobserve(entry.target);
    }
  }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });

  targets.forEach((el) => {
    el.classList.add("fx");
    io.observe(el);
  });
})();
