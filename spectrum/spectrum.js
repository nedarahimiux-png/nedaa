(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const countups = [...document.querySelectorAll(".spectrum-countup")];
  const formatCount = (element, value) => {
    const decimals = (element.dataset.count || "").split(".")[1]?.length || 0;
    return `${element.dataset.prefix || ""}${value.toFixed(decimals)}${element.dataset.suffix || ""}`;
  };

  if (reducedMotion || !("IntersectionObserver" in window)) {
    countups.forEach((element) => {
      element.textContent = formatCount(element, Number(element.dataset.count));
    });
  } else {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        observer.unobserve(element);
        const target = Number(element.dataset.count);
        const startTime = performance.now();
        const duration = 1200;

        const countFrame = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const easedProgress = 1 - (1 - progress) ** 3;
          element.textContent = formatCount(element, target * easedProgress);
          if (progress < 1) requestAnimationFrame(countFrame);
        };

        requestAnimationFrame(countFrame);
      });
    }, { threshold: 0.35 });

    countups.forEach((element) => {
      element.textContent = formatCount(element, 0);
      countObserver.observe(element);
    });
  }

})();
