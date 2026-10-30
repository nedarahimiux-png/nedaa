(() => {
  const items = document.querySelectorAll(".ab-love-item");
  if (!items.length) return;

  const texture = new Image();
  texture.src = "assets/texture-paper.jpg";

  const setup = (item) => {
    const canvas = item.querySelector(".ab-love-sparkles");
    const ctx = canvas.getContext("2d");
    const GRID = 20;
    let w = 0, h = 0, k = 1, cells = new Set(), done = false, drawing = false, last = null;

    const paint = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      const cx = 152 * k, cy = 152 * k, r = 120 * k;
      const g = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.5, 0, cx, cy, r * 1.2);
      g.addColorStop(0, "#4560ff");
      g.addColorStop(1, "#1b30d8");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      if (texture.complete && texture.naturalWidth) {
        ctx.save();
        ctx.clip();
        ctx.globalCompositeOperation = "soft-light";
        ctx.globalAlpha = 0.9;
        ctx.drawImage(texture, cx - r, cy - r, r * 2, r * 2);
        ctx.globalCompositeOperation = "overlay";
        ctx.globalAlpha = 0.25;
        ctx.drawImage(texture, cx - r, cy - r, r * 2, r * 2);
        ctx.restore();
      }
    };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height; k = w / 304;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (done) return;
      cells = new Set();
      paint();
    };

    const finish = () => {
      if (done) return;
      done = true;
      item.classList.add("is-revealed");
    };

    const mark = (x, y) => {
      const gx = Math.floor(((x - 32 * k) / (240 * k)) * GRID);
      const gy = Math.floor(((y - 32 * k) / (240 * k)) * GRID);
      for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
        const a = gx + i, b = gy + j;
        if (a >= 0 && b >= 0 && a < GRID && b < GRID) cells.add(a * GRID + b);
      }
      const total = GRID * GRID * 0.785;
      const pct = cells.size / total;
      if (pct > 0.18) item.classList.add("is-text");
      if (pct > 0.55) finish();
    };

    const scratch = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = ctx.lineJoin = "round";
      ctx.lineWidth = 40 * k;
      ctx.beginPath();
      if (last) ctx.moveTo(last.x, last.y); else ctx.moveTo(x - 0.1, y);
      ctx.lineTo(x, y);
      ctx.stroke();
      last = { x, y };
      mark(x, y);
    };

    canvas.addEventListener("pointerdown", (e) => {
      if (done) return;
      drawing = true; last = null;
      canvas.setPointerCapture(e.pointerId);
      scratch(e);
      e.preventDefault();
    });
    canvas.addEventListener("pointermove", (e) => { if (drawing && !done) scratch(e); });
    const stop = () => { drawing = false; last = null; };
    canvas.addEventListener("pointerup", stop);
    canvas.addEventListener("pointercancel", stop);

    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); item.classList.add("is-text"); finish(); }
    });

    texture.addEventListener("load", () => { if (!done) paint(); });
    build();
    window.addEventListener("resize", build);
  };

  items.forEach(setup);
})();
