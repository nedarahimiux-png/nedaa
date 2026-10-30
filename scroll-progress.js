const progressBar = document.querySelector(".scroll-progress");
const progressFill = progressBar?.querySelector("span");
let progressFrame = 0;

const updateProgress = () => {
  progressFrame = 0;
  if (!progressBar || !progressFill) return;

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0
    ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
    : 0;

  progressFill.style.width = `${progress * 100}%`;
  progressBar.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
};

const requestProgressUpdate = () => {
  if (!progressFrame) {
    progressFrame = window.requestAnimationFrame(updateProgress);
  }
};

window.addEventListener("scroll", requestProgressUpdate, { passive: true });
window.addEventListener("resize", requestProgressUpdate);
window.addEventListener("load", requestProgressUpdate, { once: true });
requestProgressUpdate();
