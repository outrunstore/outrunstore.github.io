/* ====== OUTRUN — animaties: intro, overgangen, scroll, cursor ====== */
(() => {
  const root = document.documentElement;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const ready = () => root.classList.add("is-ready");
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  if (calm){ root.classList.remove("intro-pending", "wipe-in"); ready(); return; }

  /* ---------- vloeiend scrollen (Lenis, als die geladen is) ---------- */
  let lenis = null;
  if (window.Lenis){
    lenis = new Lenis({ lerp: 0.1, anchors: { offset: -90 } });
    window.lenis = lenis;
    (function raf(t){ lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    document.querySelectorAll(".drawer-body, .cb-log").forEach(el => el.setAttribute("data-lenis-prevent", ""));
  }

  /* ---------- koppen knippen: woorden, of letters voor het grote logo ---------- */
  function split(el){
    if (el.dataset.split || el.children.length) return;
    const text = el.textContent.trim();
    const chars = el.hasAttribute("data-split-chars");
    const parts = chars ? [...text] : text.split(/\s+/);
    el.dataset.split = "1";
    el.setAttribute("aria-label", text);
    el.innerHTML = parts.map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${esc(w)}</span></span>`).join(chars ? "" : " ");
  }
  document.querySelectorAll("main h1, main h2").forEach(split);

  /* statement: elk woord licht op terwijl je scrolt; <em> wordt accentkleur */
  const scrubs = [...document.querySelectorAll("[data-scrub]")].map(el => {
    const out = [];
    el.childNodes.forEach(n => n.textContent.trim().split(/\s+/).filter(Boolean).forEach(w => out.push(`<span${n.nodeType === 1 ? ' class="acc"' : ""}>${esc(w)}</span>`)));
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    el.innerHTML = out.join(" ");
    [...el.children].forEach(c => c.setAttribute("aria-hidden", "true"));
    return { el, words: [...el.children] };
  });

  /* ---------- scroll-reveal ---------- */
  const REVEAL = ".section-head, .card, .cat, .usp, .step, .value, .look, .faq-group, .tbl-wrap, .calc, .stack, .ask-card, .prose p, .pdp-info > *, .stats > div, .co-card, .page-head p, .crumbs, .hero-copy > *";
  const IMG_REVEAL = ".hero-img, .banner, .about-img, .main-img";
  const io = new IntersectionObserver(entries => {
    let n = 0; /* wat tegelijk binnenkomt, komt kort na elkaar */
    entries.filter(e => e.isIntersecting).forEach(e => {
      e.target.style.setProperty("--d", Math.min(n++, 6) * 75 + "ms");
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  const headIO = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add("is-in"); headIO.unobserve(e.target); }
  }), { threshold: 0.25 });

  let started = false;
  function register(scope){
    scope.querySelectorAll(REVEAL).forEach(el => { if (!el.classList.contains("reveal")){ el.classList.add("reveal"); if (started) io.observe(el); } });
    scope.querySelectorAll(IMG_REVEAL).forEach(el => { if (!el.classList.contains("reveal-img")){ el.classList.add("reveal-img"); if (started) io.observe(el); } });
    scope.querySelectorAll("[data-split]").forEach(el => { if (!el.classList.contains("split")){ el.classList.add("split"); if (started) headIO.observe(el); } });
  }
  register(document);
  new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(nd => {
    if (nd.nodeType !== 1 || nd.closest(".intro, .wipe, .cur")) return;
    if (nd.matches("h1, h2") && nd.closest("main")) split(nd);
    register(nd.parentElement || nd);
  }))).observe(document.body, { childList: true, subtree: true });

  function start(){
    if (started) return;
    started = true;
    ready();
    document.querySelectorAll(".reveal:not(.is-in), .reveal-img:not(.is-in)").forEach(el => io.observe(el));
    document.querySelectorAll(".split:not(.is-in)").forEach(el => headIO.observe(el));
    document.querySelectorAll(".foot-mark").forEach(el => { el.classList.add("rise"); headIO.observe(el); });
  }

  /* ---------- startanimatie (eerste bezoek) ---------- */
  function runIntro(){
    try { sessionStorage.setItem("outrun-intro", "1"); } catch(e){}
    lenis && lenis.stop();
    const IMGS = ["img/look-hero.jpg", "img/track02-geel.jpg", "img/nightrun-zwart.jpg", "img/stride-wit.jpg", "img/core-taupe.jpg", "img/aviator-bruin.jpg", "img/beanie-oker.jpg", "img/pace-geel.jpg"];
    const GLYPHS = "ABCDEFGHJKLMNPRSTUVWXYZ#%&@$*+?!/<>0123456789";
    const el = document.createElement("div");
    el.className = "intro";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = `
      <div class="intro-row intro-top"><span>OUTRUN®</span><span>${esc(CONFIG.dropName)}</span><span class="intro-hide-m">Streetwear · NL</span></div>
      <div class="intro-stack">${IMGS.map((s, i) => `<img src="${s}" alt="" style="--r:${rand(-16, 16).toFixed(1)}deg;--x:${rand(-7, 7).toFixed(1)}vw;--y:${rand(-6, 6).toFixed(1)}vh;--fx:${(rand(60, 110) * (i % 2 ? 1 : -1)).toFixed(0)}vw;--fy:${rand(-70, 70).toFixed(0)}vh;--fr:${rand(-60, 60).toFixed(0)}deg">`).join("")}</div>
      <div class="intro-word">${[..."OUTRUN"].map((c, i) => `<span class="ch${i > 2 ? " acc" : ""}">${c}</span>`).join("")}</div>
      <div class="intro-row intro-bottom"><span>Loading drop</span><span class="intro-count">000</span></div>
      <div class="intro-bar"><i></i></div>
      <button class="intro-skip" type="button" tabindex="-1">Skip ↘</button>`;
    document.body.append(el);
    root.classList.remove("intro-pending");

    const chs = [...el.querySelectorAll(".ch")], imgs = [...el.querySelectorAll(".intro-stack img")];
    const count = el.querySelector(".intro-count"), bar = el.querySelector(".intro-bar i");
    /* breedte vastzetten zodat het woord niet trilt tijdens het husselen */
    chs.forEach(c => { c.style.width = c.getBoundingClientRect().width + "px"; c.dataset.c = c.textContent; c.textContent = ""; });

    const t0 = performance.now(), LOAD = 1900;
    let done = false, lastSwap = 0;
    const resolveAt = i => 380 + i * 130;
    function frame(t){
      if (done) return;
      const e = t - t0;
      /* letters husselen en daarna vastklikken */
      if (t - lastSwap > 45){
        lastSwap = t;
        chs.forEach((c, i) => {
          if (e < 140) return;
          if (e >= resolveAt(i)){ if (!c.classList.contains("set")){ c.textContent = c.dataset.c; c.classList.add("set"); } }
          else { c.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0]; c.classList.add("on"); }
        });
      }
      /* foto's stapelen */
      imgs.forEach((im, i) => { if (e > 560 + i * 140) im.classList.add("in"); });
      const k = Math.min(1, e / LOAD), ease = 1 - Math.pow(1 - k, 2.2);
      count.textContent = String(Math.round(ease * 100)).padStart(3, "0");
      bar.style.transform = `scaleX(${ease})`;
      if (e >= LOAD + 120) return boom();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    function boom(){
      if (done) return;
      done = true;
      chs.forEach(c => { c.textContent = c.dataset.c; c.classList.add("set", "on"); });
      imgs.forEach(im => im.classList.add("in"));
      el.classList.add("boom");
      setTimeout(() => { start(); lenis && lenis.start(); }, 380);
      setTimeout(() => el.remove(), 1500);
    }
    /* klik of toets = overslaan */
    el.addEventListener("click", boom);
    addEventListener("keydown", boom, { once: true });
  }

  /* ---------- pagina-overgangen: twee panelen vegen over het scherm ---------- */
  function makeWipe(){
    const w = document.createElement("div");
    w.className = "wipe"; w.setAttribute("aria-hidden", "true");
    w.innerHTML = '<i class="wipe-a"></i><i class="wipe-b"></i>';
    document.body.append(w);
    return w;
  }

  if (root.classList.contains("intro-pending")) runIntro();
  else if (root.classList.contains("wipe-in")){
    const w = makeWipe();
    w.classList.add("cover");
    root.classList.remove("wipe-in");
    requestAnimationFrame(() => requestAnimationFrame(() => { w.classList.add("out"); setTimeout(start, 250); }));
    setTimeout(() => w.remove(), 1300);
  } else start();

  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === "_blank" || a.hasAttribute("download")) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
    if (url.pathname === location.pathname && url.search === location.search) return; /* alleen een #anker */
    e.preventDefault();
    const w = makeWipe();
    requestAnimationFrame(() => w.classList.add("in"));
    try { sessionStorage.setItem("outrun-wipe", "1"); } catch(err){}
    setTimeout(() => { location.href = url.href; }, 620);
  });
  addEventListener("pageshow", e => { if (e.persisted) document.querySelectorAll(".wipe").forEach(w => w.remove()); });

  /* ---------- header, voortgangsbalk, parallax ---------- */
  const pbar = document.createElement("div");
  pbar.className = "scroll-bar"; pbar.setAttribute("aria-hidden", "true");
  document.body.append(pbar);
  let lastY = scrollY, ticking = false;
  const para = [...document.querySelectorAll(".hero-img img, .banner img, .about-img img")];

  /* lookbook-strook: de pagina "pint" en de looks schuiven opzij terwijl je scrolt (alleen op brede schermen) */
  const hs = document.querySelector("[data-hscroll]"), hTrack = hs && hs.querySelector(".hscroll-track");
  let hDist = 0;
  function sizeH(){
    if (!hs) return;
    const on = innerWidth > 900;
    hs.classList.toggle("is-pinned", on);
    if (!on){ hs.style.height = ""; hTrack.style.transform = ""; return; }
    hDist = Math.max(0, hTrack.scrollWidth - innerWidth);
    hs.style.height = innerHeight + hDist + "px";
  }
  if (hs){ sizeH(); addEventListener("resize", sizeH); addEventListener("load", sizeH); }
  function onScroll(){
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    pbar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    root.classList.toggle("is-scrolled", y > 8);
    if (!root.classList.contains("cart-open")){
      if (y > 240 && y > lastY + 3) root.classList.add("header-hidden");
      else if (y < lastY - 3 || y < 240) root.classList.remove("header-hidden");
    }
    lastY = y;
    const vh = innerHeight;
    if (hs && hs.classList.contains("is-pinned")){
      const r = hs.getBoundingClientRect();
      const k = clamp(-r.top / (hDist || 1), 0, 1);
      hTrack.style.transform = `translate3d(${(-k * hDist).toFixed(1)}px,0,0)`;
      hTrack.querySelectorAll(".hpanel-img img").forEach(im => {
        const b = im.parentElement.getBoundingClientRect();
        im.style.translate = `${(((b.left + b.width / 2) / innerWidth - 0.5) * -10).toFixed(2)}% 0`;
      });
    }
    scrubs.forEach(({ el, words }) => {
      const r = el.getBoundingClientRect();
      const k = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.3), 0, 1);
      const lit = Math.round(k * words.length * 1.08);
      words.forEach((w, i) => w.classList.toggle("lit", i < lit));
    });
    para.forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      img.style.translate = `0 ${(((r.top + r.height / 2 - vh / 2) / vh) * -7).toFixed(2)}%`;
    });
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking){ ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- marquee die reageert op scrollsnelheid ---------- */
  const track = document.querySelector(".marquee-track");
  const badge = document.querySelector(".badge svg");
  let badgeA = 0;
  if (track){
    track.style.animation = "none";
    let x = 0, dir = 1, half = track.scrollWidth / 2, prevY = scrollY, vel = 0;
    addEventListener("resize", () => { half = track.scrollWidth / 2; });
    (function loop(){
      const v = lenis ? lenis.velocity : scrollY - prevY;
      prevY = scrollY;
      vel += (v - vel) * 0.12;
      if (Math.abs(v) > 0.5) dir = v > 0 ? 1 : -1;
      x -= (0.7 + Math.min(Math.abs(vel) * 0.5, 22)) * dir;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      track.style.transform = `translate3d(${x.toFixed(1)}px,0,0) skewX(${clamp(-vel * 0.5, -14, 14).toFixed(2)}deg)`;
      if (badge){ badgeA += (0.25 + Math.min(Math.abs(vel) * 0.35, 9)) * dir; badge.style.transform = `rotate(${badgeA.toFixed(1)}deg)`; }
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- eigen cursor (alleen met muis) ---------- */
  if (!fine) return;
  root.classList.add("has-cursor");
  const cur = document.createElement("div");
  cur.className = "cur"; cur.setAttribute("aria-hidden", "true");
  cur.innerHTML = '<div class="cur-shape"><span class="cur-label"></span></div>';
  document.body.append(cur);
  const shape = cur.firstChild, label = shape.firstChild;

  const STICK = ".snap-btn, .ghost-btn, .icon-btn, .cart-btn, .chip, .opt:not([disabled]), .cb-fab, .qty button, .intro-skip";
  const TEXT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="file"]), textarea, select';
  const LINK = 'a, button, label, summary, [role="button"], input[type="checkbox"], input[type="radio"]';
  let mx = -100, my = -100, x = -100, y = -100, px = -100, py = -100, mode = "", stick = null, visible = false;

  function setMode(m, target){
    stick = m === "stick" ? target : null;
    if (m === mode && m !== "stick") return;
    mode = m;
    cur.className = "cur" + (m ? " is-" + m : "") + (visible ? " on" : "");
    if (m !== "stick"){ shape.style.width = shape.style.height = shape.style.borderRadius = ""; }
  }
  addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    if (!visible){ visible = true; x = px = mx; y = py = my; cur.classList.add("on"); }
  }, { passive: true });
  document.addEventListener("mouseleave", () => { visible = false; cur.classList.remove("on"); });
  addEventListener("mousedown", () => cur.classList.add("down"));
  addEventListener("mouseup", () => cur.classList.remove("down"));

  document.addEventListener("mouseover", e => {
    const t = e.target;
    if (t.closest(TEXT)) return setMode("text");
    const s = t.closest(STICK);
    if (s && !s.disabled && s.getAttribute("aria-disabled") !== "true") return setMode("stick", s);
    const v = t.closest("[data-cursor]");
    if (v){ label.textContent = v.dataset.cursor; return setMode("view"); }
    if (t.closest(LINK)) return setMode("link");
    setMode("");
  });

  (function loop(){
    let tx = mx, ty = my, k = 0.42;
    if (stick && stick.isConnected){
      const r = stick.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      tx = cx + (mx - cx) * 0.12; ty = cy + (my - cy) * 0.12; k = 0.45;
      shape.style.width = r.width + 10 + "px";
      shape.style.height = r.height + 10 + "px";
      shape.style.borderRadius = Math.min(r.height / 2 + 5, parseFloat(getComputedStyle(stick).borderTopLeftRadius) + 5) + "px";
    } else if (stick){ setMode(""); }
    x += (tx - x) * k; y += (ty - y) * k;
    const vx = x - px, vy = y - py; px = x; py = y;
    const speed = Math.hypot(vx, vy);
    /* uitrekken in de bewegingsrichting (niet als hij om een knop zit of een label toont) */
    const s = mode === "" || mode === "link" ? Math.min(speed / 110, 0.42) : 0;
    const ang = Math.atan2(vy, vx) * 180 / Math.PI;
    cur.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${s ? ang.toFixed(1) : 0}deg) scale(${(1 + s).toFixed(3)}, ${(1 - s * 0.55).toFixed(3)})`;
    requestAnimationFrame(loop);
  })();

  /* fotospoor: beweeg over de hero en er poppen productfoto's op achter het logo */
  const hero = document.querySelector("#hero");
  if (hero){
    const srcs = PRODUCTS.map(p => p.colors[0].img).concat(LOOKS.map(l => l.img)).sort(() => Math.random() - 0.5);
    const layer = document.createElement("div");
    layer.className = "trail"; layer.setAttribute("aria-hidden", "true");
    const pool = Array.from({ length: 14 }, () => { const im = document.createElement("img"); im.alt = ""; im.decoding = "async"; layer.append(im); return im; });
    hero.prepend(layer);
    hero.classList.add("has-trail");
    let lx = null, ly = null, n = 0, z = 1, warm = false;
    hero.addEventListener("mouseenter", () => { if (warm) return; warm = true; srcs.slice(0, 12).forEach(s => { const i = new Image(); i.src = s; }); });
    hero.addEventListener("mousemove", e => {
      const r = hero.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (lx === null){ lx = x; ly = y; return; }
      if (Math.hypot(x - lx, y - ly) < 95) return;
      const ang = Math.atan2(y - ly, x - lx); lx = x; ly = y;
      const im = pool[n % pool.length]; im.src = srcs[n % srcs.length]; n++;
      im.style.left = x + "px"; im.style.top = y + "px"; im.style.zIndex = ++z;
      const rot = rand(-12, 12), dx = Math.cos(ang) * 40, dy = Math.sin(ang) * 40;
      im.getAnimations().forEach(a => a.cancel());
      im.animate([
        { opacity: 0, transform: `translate(-50%,-50%) scale(.3) rotate(${rot * 2}deg)` },
        { opacity: 1, transform: `translate(-50%,-50%) scale(1) rotate(${rot}deg)`, offset: .16 },
        { opacity: 1, transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(1) rotate(${rot}deg)`, offset: .62 },
        { opacity: 0, transform: `translate(calc(-50% + ${dx * 1.6}px),calc(-50% + ${dy * 1.6 + 30}px)) scale(.7) rotate(${rot}deg)` }
      ], { duration: 1150, easing: "cubic-bezier(.2,.9,.1,1)", fill: "forwards" });
    });
  }

  /* productfoto's kantelen naar de muis, met een lichtreflectie */
  let tiltEl = null;
  function untilt(el){ el.classList.remove("tilt"); el.style.transform = ""; }
  document.addEventListener("mousemove", e => {
    const ci = e.target.closest(".card-media, .hpanel-img, .bento-tile");
    if (tiltEl && tiltEl !== ci) untilt(tiltEl);
    tiltEl = ci; if (!ci) return;
    const r = ci.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    ci.classList.add("tilt");
    ci.style.transform = `perspective(900px) rotateY(${(px * 9).toFixed(2)}deg) rotateX(${(-py * 9).toFixed(2)}deg)`;
    ci.style.setProperty("--gx", ((px + 0.5) * 100).toFixed(1) + "%");
    ci.style.setProperty("--gy", ((py + 0.5) * 100).toFixed(1) + "%");
  }, { passive: true });

  /* links "hacken" bij hover: letters husselen en klikken vast */
  document.addEventListener("mouseover", e => {
    const el = e.target.closest("[data-scramble], .link-arrow, .foot-grid a, .crumbs a");
    if (!el || (e.relatedTarget && el.contains(e.relatedTarget)) || el.children.length) return;
    if (!el.dataset.txt) el.dataset.txt = el.textContent;
    const w = el.getBoundingClientRect().width;
    el.style.display = "inline-block"; el.style.width = w + "px"; el.style.whiteSpace = "nowrap";
    scramble(el, el.dataset.txt, 380);
    clearTimeout(el._scrT); el._scrT = setTimeout(() => { el.style.width = ""; }, 420);
  });

  /* knoppen trekken naar de cursor toe */
  const MAG = ".snap-btn, .ghost-btn, .icon-btn, .cart-btn, .cb-fab";
  document.addEventListener("mousemove", e => {
    const b = e.target.closest(MAG);
    document.querySelectorAll(".is-magnet").forEach(n => { if (n !== b){ n.classList.remove("is-magnet"); n.style.translate = ""; } });
    if (!b || b.disabled) return;
    const r = b.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    b.classList.add("is-magnet");
    b.style.translate = `${(dx * 12).toFixed(1)}px ${(dy * 10).toFixed(1)}px`;
  }, { passive: true });
})();
