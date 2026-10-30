const sectionNavigation = document.querySelector(".detail-toc");

if (sectionNavigation) {

  const sectionLinks = [...sectionNavigation.querySelectorAll('a[href^="#"]')];
  const sectionTargets = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        for (const link of sectionLinks) {
          if (link.hash === `#${entry.target.id}`) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        }
      }
    }, {
      rootMargin: "-18% 0px -68% 0px",
    });

    sectionTargets.forEach((section) => observer.observe(section));
  }
}
