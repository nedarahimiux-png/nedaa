const toc = document.querySelector(".detail-toc");
if (toc) {
  const links = [...toc.querySelectorAll('a[href^="#"]')];
  const groups = {
    overview: ["overview"],
    challenge: ["challenge"],
    research: ["research", "pivot"],
    concepts: ["concepts", "experience", "testing"],
    outcome: ["outcome", "reflection"],
  };
  const sections = Object.values(groups).flat().map((id) => document.getElementById(id)).filter(Boolean);
  const setActive = () => {
    const line = window.innerHeight * 0.3;
    let current = sections[0];
    for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s;
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1];
    const key = Object.keys(groups).find((k) => groups[k].includes(current.id));
    for (const l of links) l.hash === `#${key}` ? l.setAttribute("aria-current", "location") : l.removeAttribute("aria-current");
  };
  let t = false;
  window.addEventListener("scroll", () => { if (t) return; t = true; requestAnimationFrame(() => { setActive(); t = false; }); }, { passive: true });
  window.addEventListener("resize", setActive);
  setActive();
}

document.querySelectorAll("[data-slides]").forEach((root) => {
  const imgs = [...root.querySelectorAll(".ai-slides-frame img")];
  const count = root.querySelector(".ai-slides-count");
  let i = 0;
  const show = (n) => {
    i = (n + imgs.length) % imgs.length;
    imgs.forEach((im, k) => im.classList.toggle("is-active", k === i));
    count.textContent = `${i + 1} / ${imgs.length}`;
  };
  root.querySelector(".prev").addEventListener("click", () => show(i - 1));
  root.querySelector(".next").addEventListener("click", () => show(i + 1));
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(i - 1);
    if (e.key === "ArrowRight") show(i + 1);
  });
  show(0);
});
