const sectionNavigation = document.querySelector(".detail-toc");

if (sectionNavigation) {
  const sectionLinks = [...sectionNavigation.querySelectorAll('a[href^="#"]')];
  const groups = {
    overview: ["overview"],
    problem: ["problem", "opportunity"],
    proposal: ["proposal", "prototype", "multiple-lines", "research", "improvements"],
    reflection: ["reflection"],
  };
  const sectionIds = Object.values(groups).flat();
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  const setActive = () => {
    const line = window.innerHeight * 0.3;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= line) current = section;
    }
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) current = document.getElementById("reflection") || current;
    const key = Object.keys(groups).find((k) => groups[k].includes(current.id));
    for (const link of sectionLinks) {
      if (link.hash === `#${key}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  };

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { setActive(); ticking = false; });
  }, { passive: true });
  window.addEventListener("resize", setActive);
  setActive();
}
