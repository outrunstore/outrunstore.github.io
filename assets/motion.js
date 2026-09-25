/* ====== OUTRUN — animaties: intro, scroll, cursor, overgangen ====== */
(() => {
  const root = document.documentElement;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const ready = () => root.classList.add("is-ready");

  if (calm){ root.classList.remove("intro-pending"); ready(); return; }

  /* ---------- koppen in woorden knippen (voor de "opschuif"-reveal) ---------- */
  function split(el){
    if (el.dataset.split || el.children.length) return;
    const words = el.textContent.trim().split(/\s+/);
    el.dataset.split = "1";
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${esc(w)}</span></span>`).join(" ");
  }
  document.querySelectorAll("main h1, main h2").forEach(split);

  /* ---------- scroll-reveal ---------- */
  const REVEAL = ".section-head, .card, .cat, .usp, .step, .value, .look, .faq-group, .tbl-wrap, .calc, .stack, .ask-card, .prose p, .pdp-info > *, .stats > div, .order-box, .co-card, .page-head p, .crumbs";
  const IMG_REVEAL = ".hero-img, .banner, .about-img, .main-img";
  const io = new IntersectionObserver(entries => {
    /* elementen die tegelijk binnenkomen krijgen een kleine vertraging na elkaar */
    let n = 0;
    entries.filter(e => e.isIntersecting).forEach(e => {
      e.target.style.setProperty("--d", Math.min(n++, 6) * 70 + "ms");
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  const headIO = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add("is-in"); headIO.unobserve(e.target); }
  }), { threshold: 0.3 });

  /* klassen meteen zetten (verborgen startstand), pas observeren als de pagina "start" */
  let started = false;
  function register(scope){
    scope.querySelectorAll(REVEAL).forEach(el => { if (!el.classList.contains("reveal")){ el.classList.add("reveal"); if (started) io.observe(el); } });
    scope.querySelectorAll(IMG_REVEAL).forEach(el => { if (!el.classList.contains("reveal-img")){ el.classList.add("reveal-img"); if (started) io.observe(el); } });
    scope.querySelectorAll("[data-split]").forEach(el => { if (!el.classList.contains("split")){ el.classList.add("split"); if (started) headIO.observe(el); } });
  }
  register(document);

  /* nieuwe kaarten (bijv. na filteren in de shop) ook laten binnenkomen */
  const mo = new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(nd => {
    if (nd.nodeType !== 1) return;
    if (nd.matches && nd.matches("h1, h2") && nd.closest("main")) split(nd);
    register(nd.parentElement || nd);
  })));
  mo.observe(document.body, { childList: true, subtree: true });

  function start(){
    started = true;
    ready();
    document.querySelectorAll(".reveal:not(.is-in), .reveal-img:not(.is-in)").forEach(el => io.observe(el));
    document.querySelectorAll(".split:not(.is-in)").forEach(el => headIO.observe(el));
  }

  /* ---------- startanimatie ---------- */
  if (root.classList.contains("intro-pending")){
    try { sessionStorage.setItem("outrun-intro", "1"); } catch(e){}
    const el = document.createElement("div");
    el.className = "intro";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = `
      <div class="intro-word">${"OUTRUN".split("").map((ch, i) => `<span class="ch${i > 2 ? " acc" : ""}" style="--i:${i}"><span>${ch}</span></span>`).join("")}</div>
      <div class="intro-meta"><span>${esc(CONFIG.dropName)}</span><span class="intro-count" id="introCount">000</span></div>
      <div class="intro-bar"><i id="introBar"></i></div>`;
    document.body.append(el);
    root.classList.remove("intro-pending");
    requestAnimationFrame(() => el.classList.add("go"));

    const dur = 1250, t0 = performance.now(), count = $("introCount"), bar = $("introBar");
    (function tick(t){
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      count.textContent = String(Math.round(e * 100)).padStart(3, "0");
      bar.style.transform = `scaleX(${e})`;
      if (k < 1) requestAnimationFrame(tick);
    })(t0);

    setTimeout(() => { el.classList.add("out"); start(); }, dur + 150);
    setTimeout(() => el.remove(), dur + 1300);
  } else {
    start();
  }

  /* ---------- header: verbergen bij omlaag scrollen, voortgangsbalk, parallax ---------- */
  const bar = document.createElement("div");
  bar.className = "scroll-bar"; bar.setAttribute("aria-hidden", "true");
  document.body.append(bar);
  let lastY = scrollY, ticking = false;
  const para = [...document.querySelectorAll(".hero-img img, .banner img, .about-img img")];
  function onScroll(){
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    root.classList.toggle("is-scrolled", y > 8);
    if (!root.classList.contains("cart-open")){
      if (y > 240 && y > lastY + 4) root.classList.add("header-hidden");
      else if (y < lastY - 4 || y < 240) root.classList.remove("header-hidden");
    }
    lastY = y;
    const vh = innerHeight;
    para.forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const off = (r.top + r.height / 2 - vh / 2) / vh; /* -1..1 */
      img.style.translate = `0 ${(off * -6).toFixed(2)}%`;
    });
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking){ ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- pagina-overgangen ---------- */
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === "_blank" || a.hasAttribute("download")) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.protocol === "mailto:") return;
    if (url.pathname === location.pathname && url.search === location.search) return; /* alleen een #anker */
    e.preventDefault();
    root.classList.add("is-leaving");
    setTimeout(() => { location.href = url.href; }, 320);
  });
  addEventListener("pageshow", e => { if (e.persisted) root.classList.remove("is-leaving"); });

  /* ---------- eigen cursor + magnetische knoppen (alleen met muis) ---------- */
  if (!fine) return;
  root.classList.add("has-cursor");
  const dot = document.createElement("div"), ring = document.createElement("div");
  dot.className = "cursor-dot"; ring.className = "cursor-ring";
  ring.innerHTML = '<span class="cursor-label"></span>';
  dot.setAttribute("aria-hidden", "true"); ring.setAttribute("aria-hidden", "true");
  document.body.append(dot, ring);
  const label = ring.firstChild;
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, shown = false;

  addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    if (!shown){ shown = true; rx = mx; ry = my; root.classList.add("cursor-on"); }
  }, { passive: true });
  document.addEventListener("mouseleave", () => { shown = false; root.classList.remove("cursor-on"); });
  addEventListener("mousedown", () => root.classList.add("cursor-down"));
  addEventListener("mouseup", () => root.classList.remove("cursor-down"));
  (function follow(){
    rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(follow);
  })();

  const TEXT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="file"]), textarea';
  const CLICK = 'a, button, label, select, summary, [role="button"], input[type="checkbox"], input[type="radio"]';
  document.addEventListener("mouseover", e => {
    const t = e.target;
    const view = t.closest("[data-cursor]");
    root.classList.toggle("cursor-text", !!t.closest(TEXT));
    root.classList.toggle("cursor-view", !!view);
    root.classList.toggle("cursor-link", !view && !!t.closest(CLICK));
    label.textContent = view ? view.dataset.cursor : "";
  });

  /* knoppen trekken een beetje naar de cursor toe */
  const MAG = ".snap-btn, .ghost-btn, .icon-btn, .cart-btn";
  document.addEventListener("mousemove", e => {
    const b = e.target.closest(MAG);
    document.querySelectorAll(".is-magnet").forEach(x => { if (x !== b){ x.classList.remove("is-magnet"); x.style.translate = ""; } });
    if (!b || b.disabled) return;
    const r = b.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    b.classList.add("is-magnet");
    b.style.translate = `${(dx * 10).toFixed(1)}px ${(dy * 8).toFixed(1)}px`;
  }, { passive: true });
})();
