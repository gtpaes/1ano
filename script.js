(function () {
  const canvas = document.getElementById("loading-canvas");
  const ctx = canvas.getContext("2d");
  const fill = document.getElementById("loading-fill");
  const W = canvas.width,
    H = canvas.height;
  let beat = 0,
    prog = 0;

  function heartPath(s, cx, cy) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - s * 0.08);
    ctx.bezierCurveTo(
      cx,
      cy - s * 0.48,
      cx - s * 0.58,
      cy - s * 0.48,
      cx - s * 0.58,
      cy - s * 0.08,
    );
    ctx.bezierCurveTo(
      cx - s * 0.58,
      cy + s * 0.22,
      cx,
      cy + s * 0.48,
      cx,
      cy + s * 0.56,
    );
    ctx.bezierCurveTo(
      cx,
      cy + s * 0.48,
      cx + s * 0.58,
      cy + s * 0.22,
      cx + s * 0.58,
      cy - s * 0.08,
    );
    ctx.bezierCurveTo(
      cx + s * 0.58,
      cy - s * 0.48,
      cx,
      cy - s * 0.48,
      cx,
      cy - s * 0.08,
    );
    ctx.closePath();
  }

  function drawHeart() {
    ctx.clearRect(0, 0, W, H);
    beat += 0.055;
    const pulse = 1 + Math.sin(beat * 2) * 0.065;
    const s = 78 * pulse,
      cx = W / 2,
      cy = H / 2;

    for (let i = 4; i >= 1; i--) {
      heartPath(s + i * 7, cx, cy);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, s + i * 7);
      g.addColorStop(0, `rgba(255,100,40,${0.025 * i})`);
      g.addColorStop(1, "rgba(255,100,40,0)");
      ctx.fillStyle = g;
      ctx.fill();
    }

    heartPath(s, cx, cy);
    const base = ctx.createLinearGradient(cx - s, cy - s, cx + s, cy + s);
    base.addColorStop(0, "#3d0a08");
    base.addColorStop(0.5, "#1e0504");
    base.addColorStop(1, "#0e0202");
    ctx.fillStyle = base;
    ctx.fill();

    heartPath(s * 0.96, cx, cy);
    const main = ctx.createLinearGradient(cx - s, cy - s, cx + s, cy + s * 0.5);
    main.addColorStop(0, "#ffaa70");
    main.addColorStop(0.3, "#ff7a35");
    main.addColorStop(0.65, "#d44020");
    main.addColorStop(1, "#8c1a0a");
    ctx.fillStyle = main;
    ctx.fill();

    heartPath(s * 0.96, cx, cy);
    ctx.save();
    ctx.clip();
    const shine = ctx.createRadialGradient(
      cx - s * 0.14,
      cy - s * 0.22,
      0,
      cx,
      cy,
      s * 0.68,
    );
    shine.addColorStop(0, "rgba(255,220,190,0.52)");
    shine.addColorStop(0.35, "rgba(255,180,130,0.1)");
    shine.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = shine;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(
      cx,
      cy,
      s * 0.82,
      -Math.PI / 2,
      -Math.PI / 2 + (2 * Math.PI * prog) / 100,
    );
    ctx.strokeStyle = "rgba(255,122,53,0.4)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    requestAnimationFrame(drawHeart);
  }
  drawHeart();

  const iv = setInterval(() => {
    prog += Math.random() * 3.5 + 1.2;
    if (prog >= 100) {
      prog = 100;
      clearInterval(iv);
      fill.style.width = "100%";
      setTimeout(hideLoading, 600);
    }
    fill.style.width = prog + "%";
  }, 45);
})();

/* ─────────────────────────────────
   VIDEO CONTROLS
───────────────────────────────── */
function togglePlay() {
  const v = document.getElementById("intro-video");
  const btn = document.getElementById("btn-playpause");
  if (v.paused) {
    v.play();
    btn.textContent = "⏸";
  } else {
    v.pause();
    btn.textContent = "▶";
  }
}

function toggleMute() {
  const v = document.getElementById("intro-video");
  const btn = document.getElementById("btn-mute");
  const sl = document.getElementById("volume-slider");
  v.muted = !v.muted;
  btn.textContent = v.muted ? "🔇" : "🔊";
  sl.value = v.muted ? 0 : v.volume;
}

function setVolume(val) {
  const v = document.getElementById("intro-video");
  const btn = document.getElementById("btn-mute");
  v.volume = parseFloat(val);
  v.muted = v.volume === 0;
  btn.textContent = v.muted ? "🔇" : "🔊";
}

function hideLoading() {
  const el = document.getElementById("loading");
  el.style.transition = "opacity 1.1s ease";
  el.style.opacity = "0";
  setTimeout(() => {
    el.style.display = "none";
    initIntro();
  }, 1100);
}

/* ─────────────────────────────────
   CINEMATIC INTRO
───────────────────────────────── */
function initIntro() {
  const intro = document.getElementById("intro");
  const overlay = document.getElementById("intro-overlay");
  const scrollHint = document.getElementById("intro-scroll");
  const video = document.getElementById("intro-video");

  // Show intro
  intro.classList.add("active");

  // Open cinematic bars after a beat
  setTimeout(() => intro.classList.add("bars-open"), 300);

  // Vídeo fica pronto mas NÃO toca automaticamente — usuário controla
  const rawSrc = video.getAttribute("src");
  if (rawSrc && rawSrc.trim() !== "") {
    video.classList.add("visible");
    video.muted = true;
    video.pause();
    // Atualiza ícone para mostrar "play" (parado)
    const btnPP = document.getElementById("btn-playpause");
    if (btnPP) btnPP.textContent = "▶";
  }

  // Mostra controles após texto aparecer
  setTimeout(() => intro.classList.add("show-controls"), 1800);

  // Reveal text
  setTimeout(() => overlay.classList.add("reveal-text"), 800);

  // Show scroll hint
  setTimeout(() => scrollHint.classList.add("show"), 2400);

  // Init film grain on intro
  initGrain();

  // Scroll on intro triggers infinity mask transition
  let introScrolled = false;
  let touchStartY = 0;

  function onIntroScroll(delta) {
    if (introScrolled) return;
    if (delta > 30) {
      introScrolled = true;
      triggerInfinityTransition();
    }
  }

  intro.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      onIntroScroll(e.deltaY);
    },
    { passive: false },
  );
  intro.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true },
  );
  intro.addEventListener(
    "touchmove",
    (e) => {
      const dy = touchStartY - e.touches[0].clientY;
      onIntroScroll(dy);
    },
    { passive: true },
  );
}

/* ─────────────────────────────────
   FILM GRAIN
───────────────────────────────── */
function initGrain() {
  const canvas = document.getElementById("grain-canvas");
  const ctx = canvas.getContext("2d");
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function draw() {
    const W = canvas.width,
      H = canvas.height;
    const id = ctx.createImageData(W, H);
    const d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 18;
    }
    ctx.putImageData(id, 0, 0);
    requestAnimationFrame(draw);
  }
  window.addEventListener("resize", resize);
  resize();
  draw();
}

/* ─────────────────────────────────
   INFINITY MASK TRANSITION
   The infinity shape sweeps across like
   a cinematic wipe, revealing the site
───────────────────────────────── */
function triggerInfinityTransition() {
  const maskEl = document.getElementById("infinity-mask");
  const canvas = document.getElementById("mask-canvas");
  const ctx = canvas.getContext("2d");
  const intro = document.getElementById("intro");

  maskEl.classList.add("active");

  let W, H;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Infinity parametric: lemniscate of Bernoulli
  function infPoint(t, scale) {
    const denom = 1 + Math.sin(t) * Math.sin(t);
    return {
      x: W / 2 + (scale * Math.cos(t)) / denom,
      y: H / 2 + (scale * Math.sin(t) * Math.cos(t)) / denom,
    };
  }

  // We animate the mask using a growing infinity shape
  // Phase 1: small → fullscreen (0 → 1)
  // Phase 2: shrink back to small, revealing site underneath
  let phase = 0; // 0..1  grow, then 1..2 shrink
  let animId;
  const DURATION_GROW = 900; // ms
  const DURATION_HOLD = 200;
  const DURATION_SHRINK = 700;
  const start = performance.now();

  // Pre-show the actual site under the mask
  document.getElementById("hero").classList.add("visible");
  initBg();
  initTyped();
  initCounter();
  initInfinity();
  initParallax();
  initGallery();
  initTimeline();

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function drawMask(progress, growing) {
    ctx.clearRect(0, 0, W, H);

    // Scale the infinity from 0 to cover entire screen diagonally
    const maxScale = Math.sqrt(W * W + H * H) * 0.58;
    const scale = growing
      ? easeInOut(progress) * maxScale
      : easeOut(1 - progress) * maxScale;

    // Number of points on infinity curve
    const N = 800;
    const points = [];
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI * 2;
      points.push(infPoint(t, scale));
    }

    // Draw solid black outside the infinity shape (composite trick)
    // Fill entire canvas black, then cut out the infinity with 'destination-out'
    ctx.save();

    // Black fill
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);

    // Cut out infinity shape
    ctx.globalCompositeOperation = "destination-out";

    // Build infinity path — thick stroke for mask
    ctx.beginPath();
    points.forEach((p, i) =>
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y),
    );
    ctx.closePath();
    ctx.fill();

    // Also stroke with thickness so thin parts fill nicely
    ctx.lineWidth = Math.max(scale * 0.45, 20);
    ctx.lineJoin = "round";
    ctx.stroke();

    ctx.restore();

    // Glow ring on the infinity edge
    if (scale > 10) {
      ctx.save();
      ctx.beginPath();
      points.forEach((p, i) =>
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y),
      );
      ctx.closePath();
      ctx.strokeStyle = growing
        ? `rgba(255,122,53,${0.6 * easeInOut(progress)})`
        : `rgba(244,167,185,${0.6 * easeOut(1 - progress)})`;
      ctx.lineWidth = 3;
      ctx.globalCompositeOperation = "source-over";
      ctx.stroke();
      ctx.restore();
    }
  }

  function animate(now) {
    const elapsed = now - start;

    if (elapsed < DURATION_GROW) {
      // Growing phase
      drawMask(elapsed / DURATION_GROW, true);
      animId = requestAnimationFrame(animate);
    } else if (elapsed < DURATION_GROW + DURATION_HOLD) {
      // Hold — fully open (show just glow border, all black cleared)
      ctx.clearRect(0, 0, W, H);
      animId = requestAnimationFrame(animate);
    } else if (elapsed < DURATION_GROW + DURATION_HOLD + DURATION_SHRINK) {
      // Shrink phase — infinity contracts, site revealed
      const t = (elapsed - DURATION_GROW - DURATION_HOLD) / DURATION_SHRINK;
      drawMask(t, false);
      animId = requestAnimationFrame(animate);
    } else {
      // Done — para o vídeo completamente e remove intro
      ctx.clearRect(0, 0, W, H);
      cancelAnimationFrame(animId);

      // Para o vídeo, zera volume e src para liberar memória
      const vid = document.getElementById("intro-video");
      if (vid) {
        vid.pause();
        vid.muted = true;
        vid.src = "";
        vid.load();
      }

      maskEl.style.transition = "opacity .4s ease";
      maskEl.style.opacity = "0";
      setTimeout(() => {
        maskEl.style.display = "none";
      }, 400);

      intro.style.transition = "opacity .6s ease";
      intro.style.opacity = "0";
      setTimeout(() => {
        intro.style.display = "none";
      }, 600);
    }
  }

  animId = requestAnimationFrame(animate);
}

/* ─────────────────────────────────
   ROMANTIC BG — petals + stars
───────────────────────────────── */
function initBg() {
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  let W,
    H,
    particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mk() {
    const type =
      Math.random() < 0.3 ? "star" : Math.random() < 0.45 ? "petal" : "dust";
    return {
      type,
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy:
        type === "petal"
          ? Math.random() * 0.35 + 0.1
          : (Math.random() - 0.5) * 0.08,
      r: type === "star" ? Math.random() * 1.0 + 0.15 : Math.random() * 3 + 1.2,
      alpha: Math.random() * 0.45 + 0.08,
      phase: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.009,
    };
  }
  function init() {
    particles = Array.from({ length: 150 }, mk);
  }

  function drawPetal(x, y, r, rot, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.ellipse(0, -r, r * 0.38, r, 0, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(0, -r, 0, 0, 0, r);
    g.addColorStop(0, "rgba(244,167,185,0.65)");
    g.addColorStop(0.5, "rgba(255,122,53,0.25)");
    g.addColorStop(1, "rgba(244,167,185,0)");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    // romantic vignette
    const g = ctx.createRadialGradient(
      W / 2,
      H * 0.4,
      0,
      W / 2,
      H * 0.4,
      Math.max(W, H) * 0.75,
    );
    g.addColorStop(0, "rgba(70,8,15,0.08)");
    g.addColorStop(0.5, "rgba(25,4,8,0.04)");
    g.addColorStop(1, "rgba(5,2,2,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    frame++;
    const t = frame * 0.007;
    particles.forEach((p) => {
      p.x += p.vx + Math.sin(t + p.phase) * 0.1;
      p.y += p.vy;
      p.rot += p.rotV;
      if (p.y > H + 10) {
        p.y = -10;
        p.x = Math.random() * W;
      }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.type === "star") {
        const a = ((Math.sin(t * 1.1 + p.phase) + 1) / 2) * 0.5 + 0.05;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,235,225,${a})`;
        ctx.fill();
      } else if (p.type === "petal") {
        drawPetal(p.x, p.y, p.r, p.rot, p.alpha * 0.4);
      } else {
        const a = ((Math.sin(t * 0.7 + p.phase) + 1) / 2) * 0.1 + 0.02;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244,167,185,${a})`;
        ctx.fill();
      }
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener("resize", () => {
    resize();
    init();
  });
  resize();
  init();
  draw();
}

/* ─────────────────────────────────
   CURSOR
───────────────────────────────── */
(function () {
  const dot = document.querySelector("#cursor .dot");
  const ring = document.querySelector("#cursor .ring");
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });
  (function loop() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    dot.style.left = mx + "px";
    dot.style.top = my + "px";
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(loop);
  })();
})();

/* ─────────────────────────────────
   TYPED TEXT
───────────────────────────────── */
function initTyped() {
  const text =
    "Dia 20 de março...\no dia em que duas vidas começaram\na escrever a mesma história.";
  const out = document.getElementById("typed-output");
  let i = 0;
  function type() {
    out.innerHTML = text.slice(0, i).replace(/\n/g, "<br>");
    if (i++ <= text.length) setTimeout(type, i < 18 ? 90 : 44);
  }
  setTimeout(type, 400);
}

/* ─────────────────────────────────
   COUNTER
───────────────────────────────── */
function initCounter() {
  const start = new Date("2025-03-20T17:30:00");
  function update() {
    const s = Math.floor((new Date() - start) / 1000);
    document.getElementById("cnt-days").textContent = String(
      Math.floor(s / 86400),
    ).padStart(3, "0");
    document.getElementById("cnt-hours").textContent = String(
      Math.floor((s % 86400) / 3600),
    ).padStart(2, "0");
    document.getElementById("cnt-minutes").textContent = String(
      Math.floor((s % 3600) / 60),
    ).padStart(2, "0");
    document.getElementById("cnt-seconds").textContent = String(
      s % 60,
    ).padStart(2, "0");
  }
  update();
  setInterval(update, 1000);
}

/* ─────────────────────────────────
   INFINITY PARTICLE CANVAS
───────────────────────────────── */
function initInfinity() {
  const canvas = document.getElementById("infinity-canvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width,
    H = canvas.height;
  const pts = [];
  for (let i = 0; i < 280; i++) {
    pts.push({
      t: (i / 280) * Math.PI * 2,
      offset: (Math.random() - 0.5) * 0.14,
      r: Math.random() * 2.3 + 0.5,
      alpha: Math.random() * 0.55 + 0.4,
      spd: (Math.random() * 0.18 + 0.08) * (Math.random() < 0.5 ? 1 : -1),
      hue: Math.random() < 0.5 ? "rose" : "orange",
    });
  }
  function gp(t, sc = 1) {
    const a = 78 * sc;
    return {
      x: W / 2 + (a * Math.cos(t)) / (1 + Math.sin(t) ** 2),
      y: H / 2 + (a * Math.sin(t) * Math.cos(t)) / (1 + Math.sin(t) ** 2),
    };
  }
  let fr = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    fr++;
    const time = fr * 0.007;
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const p = gp((i / 200) * Math.PI * 2);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(255,122,53,0.06)";
    ctx.lineWidth = 14;
    ctx.stroke();
    ctx.strokeStyle = "rgba(244,167,185,0.05)";
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.restore();
    pts.forEach((p) => {
      p.t += 0.003 * (p.spd > 0 ? 1 : -1);
      const sc = 0.9 + Math.sin(p.t * 3 + time) * 0.07;
      const pos = gp(p.t + p.offset, sc);
      const dist = Math.sqrt((pos.x - W / 2) ** 2 + (pos.y - H / 2) ** 2);
      const glow = Math.max(0, 1 - dist / 110);
      const [r, g, b] = p.hue === "rose" ? [244, 167, 185] : [255, 122, 53];
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, p.r * (0.8 + glow * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha * (0.45 + glow * 0.55)})`;
      ctx.fill();
      if (glow > 0.5) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.05 * glow})`;
        ctx.fill();
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ─────────────────────────────────
   GALLERY — hide items with no src
───────────────────────────────── */
function initGallery() {
  document.querySelectorAll(".gallery-item img").forEach((img) => {
    const src = img.getAttribute("src");
    const item = img.closest(".gallery-item");
    if (!src || src.trim() === "") {
      item.style.display = "none";
      return;
    }
    // Show immediately — don't wait for load (local files trigger before JS runs)
    item.classList.add("has-img");
    img.addEventListener("error", () => {
      item.style.display = "none";
    });
  });
}

/* ─────────────────────────────────
   TIMELINE — hide photo slots with no src
───────────────────────────────── */
function initTimeline() {
  document.querySelectorAll(".tl-photo img").forEach((img) => {
    const src = img.getAttribute("src");
    const container = img.closest(".tl-photo");
    if (!src || src.trim() === "") {
      container.classList.add("empty");
      return;
    }
    container.style.display = "block";
    img.addEventListener("error", () => {
      container.classList.add("empty");
      container.style.display = "none";
    });
  });
  // also hide empty polaroid img tags
  document.querySelectorAll(".polaroid-img img").forEach((img) => {
    if (!img.getAttribute("src")) {
      img.style.display = "none";
    }
    img.addEventListener("error", () => {
      img.style.display = "none";
    });
  });
}

/* ─────────────────────────────────
   PARALLAX
───────────────────────────────── */
function initParallax() {
  document.addEventListener(
    "scroll",
    () => {
      const h = document.getElementById("hero");
      if (h) h.style.transform = `translateY(${window.scrollY * 0.2}px)`;
    },
    { passive: true },
  );
}

/* ─────────────────────────────────
   REVEAL ON SCROLL
───────────────────────────────── */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ─────────────────────────────────
   MODAL
───────────────────────────────── */
function openModal(src, cap) {
  if (!src || src === window.location.href) return;
  document.getElementById("modal-img").src = src;
  document.getElementById("modal-caption").textContent = cap || "";
  document.getElementById("modal").classList.add("open");
}
function closeModal() {
  document.getElementById("modal").classList.remove("open");
}

/* ─────────────────────────────────
   EASTER EGGS
───────────────────────────────── */
let infClicks = 0;
document.getElementById("hero-inf").addEventListener("click", (e) => {
  infClicks++;
  spawnHeart(e.clientX, e.clientY);
  if (infClicks >= 5) {
    infClicks = 0;
    const p = document.getElementById("easter-popup");
    p.classList.add("show");
    setTimeout(() => p.classList.remove("show"), 3400);
  }
});

let tc = 0,
  tt;
document.addEventListener("click", (e) => {
  tc++;
  clearTimeout(tt);
  tt = setTimeout(() => {
    tc = 0;
  }, 380);
  if (tc >= 3) {
    tc = 0;
    spawnHeart(e.clientX, e.clientY);
    spawnHeart(e.clientX + 16, e.clientY - 26);
    spawnHeart(e.clientX - 12, e.clientY - 44);
  }
});

function spawnHeart(x, y) {
  const h = document.createElement("div");
  h.className = "float-heart";
  h.textContent = ["💗", "💓", "💕", "♥", "💖"][Math.floor(Math.random() * 5)];
  h.style.left = x - 10 + "px";
  h.style.top = y - 10 + "px";
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 2500);
}
