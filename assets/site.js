/* ====== OUTRUN — gedeelde code voor alle pagina's ====== */
const snapUrl = "https://www.snapchat.com/add/" + encodeURIComponent(CONFIG.snapUsername);
const euro = n => "€" + (n % 1 ? n.toFixed(2).replace(".", ",") : n.toFixed(0));
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const $ = id => document.getElementById(id);

/* ---------- voorraad ---------- */
const sizesOf = p => Object.keys(p.colors[0].stock);
const colorTotal = c => Object.values(c.stock).reduce((a, b) => a + b, 0);
const productTotal = p => p.colors.reduce((a, c) => a + colorTotal(c), 0);
const isSoldOut = p => !p.soon && productTotal(p) === 0;
/* maten die in minstens één kleur op voorraad zijn */
const sizesInStock = p => sizesOf(p).filter(s => p.colors.some(c => c.stock[s] > 0));
const isLow = p => !p.soon && productTotal(p) > 0 && productTotal(p) <= CONFIG.lowStock;
const productById = id => PRODUCTS.find(p => p.id === id);
const productUrl = p => "product.html?id=" + encodeURIComponent(p.id);
const CATS = [...new Set(PRODUCTS.map(p => p.cat))];

/* label linksboven op een productfoto */
function badges(p){
  const b = [];
  if (p.soon) b.push('<span class="tag tag-ink">Binnenkort</span>');
  else if (isSoldOut(p)) b.push('<span class="tag tag-ink">Uitverkocht</span>');
  else {
    if (p.was) b.push(`<span class="tag tag-accent">-${Math.round((1 - p.price / p.was) * 100)}%</span>`);
    if (p.isNew) b.push('<span class="tag">Nieuw</span>');
    if (isLow(p)) b.push('<span class="tag tag-warn">Bijna op</span>');
  }
  return b.length ? `<div class="tags">${b.join("")}</div>` : "";
}

function priceHtml(p){
  return (p.was ? `<s class="was">${euro(p.was)}</s> ` : "") + `<span class="price${p.was ? " sale" : ""}">${euro(p.price)}</span>`;
}

/* productkaart voor grids */
function card(p){
  const img2 = (p.colors[1] && p.colors[1].img) || (p.extra && p.extra[0]);
  const sizes = sizesOf(p);
  const free = sizesInStock(p);
  const quick = p.soon ? "Binnenkort binnen" : !free.length ? "Uitverkocht" : free.length === 1 && free[0] === "One size" ? "Op voorraad" : "Op voorraad: " + free.join(" · ");
  const sizeLine = p.soon ? '<span class="meta">Binnenkort</span>'
    : sizes.length === 1 ? `<span class="meta">${isSoldOut(p) ? "Uitverkocht" : sizes[0]}</span>`
    : `<span class="size-line">${sizes.map(s => sizesInStock(p).includes(s) ? `<span>${s}</span>` : `<s title="Uitverkocht">${s}</s>`).join("")}</span>`;
  return `
  <a class="card${isSoldOut(p) ? " is-out" : ""}" href="${productUrl(p)}" data-cursor="Bekijk →">
    <div class="card-img">
      ${badges(p)}
      <img src="${p.colors[0].img}" alt="${esc(p.name)} in ${esc(p.colors[0].n.toLowerCase())}" loading="lazy">
      ${img2 ? `<img class="alt" src="${img2}" alt="" loading="lazy">` : ""}
      <div class="card-quick" aria-hidden="true"><span>${quick}</span><span>${euro(p.price)}</span></div>
    </div>
    <div class="card-info">
      <div class="row"><h3>${esc(p.name)}</h3><span>${priceHtml(p)}</span></div>
      <div class="row">
        ${sizeLine}
        <span class="swatches">${p.colors.map(c => `<span class="sw${colorTotal(c) === 0 && !p.soon ? " sw-out" : ""}" style="background:${c.hex}" title="${esc(c.n)}${colorTotal(c) === 0 && !p.soon ? " (uitverkocht)" : ""}"></span>`).join("")}</span>
      </div>
    </div>
  </a>`;
}

/* ---------- winkelmand ---------- */
/* opgeslagen als [{id, c: kleurnaam, s: maat, q: aantal}] */
const Cart = {
  key: "outrun-cart",
  mem: [],
  raw(){
    try { const a = JSON.parse(localStorage.getItem(this.key) || "[]"); return Array.isArray(a) ? a : []; }
    catch(e){ return this.mem; }
  },
  save(a){
    this.mem = a;
    try { localStorage.setItem(this.key, JSON.stringify(a)); } catch(e){}
    renderCart();
  },
  /* regels met product erbij; ongeldige of uitverkochte regels vallen weg, aantal max. voorraad */
  lines(){
    return this.raw().map(it => {
      const p = productById(it.id); if (!p) return null;
      const ci = p.colors.findIndex(c => c.n === it.c); if (ci < 0) return null;
      const max = p.colors[ci].stock[it.s] || 0; if (!max || p.soon) return null;
      return { p, ci, color: p.colors[ci], size: it.s, q: Math.min(Math.max(1, it.q | 0), max), max };
    }).filter(Boolean);
  },
  count(){ return this.lines().reduce((a, l) => a + l.q, 0); },
  subtotal(){ return this.lines().reduce((a, l) => a + l.q * l.p.price, 0); },
  add(id, colorName, size, q = 1){
    const a = this.raw();
    const hit = a.find(x => x.id === id && x.c === colorName && x.s === size);
    const p = productById(id), max = p.colors.find(c => c.n === colorName).stock[size] || 0;
    const now = hit ? hit.q : 0;
    if (now >= max){ toast(`Je hebt alle ${max} op voorraad al in je mand`); return false; }
    if (hit) hit.q = Math.min(max, now + q); else a.push({ id, c: colorName, s: size, q: Math.min(max, q) });
    this.save(a); return true;
  },
  set(i, q){
    const lines = this.lines();
    const next = lines.map(l => ({ id: l.p.id, c: l.color.n, s: l.size, q: l.q }));
    if (q <= 0) next.splice(i, 1); else next[i].q = Math.min(q, lines[i].max);
    this.save(next);
  },
  clear(){ this.save([]); }
};

function shippingFor(subtotal, method){
  if (method === "ophalen") return 0;
  if (CONFIG.freeShippingFrom && subtotal >= CONFIG.freeShippingFrom) return 0;
  return CONFIG.shippingCost;
}

/* ---------- header, footer, menu, winkelmand-lade ---------- */
const BAG_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>';
const NAV = [
  ["shop.html", "Shop", "shop"], ["shop.html?filter=nieuw", "Nieuw", "nieuw"], ["lookbook.html", "Lookbook", "lookbook"],
  ["maten.html", "Maten", "maten"], ["aanvragen.html", "Aanvragen", "aanvragen"], ["info.html", "Info", "info"], ["over.html", "Over ons", "over"]
];

function renderChrome(){
  const page = document.body.dataset.page;
  const onNew = page === "shop" && new URLSearchParams(location.search).get("filter") === "nieuw";
  const links = NAV.map(([href, label, key]) => {
    const active = key === "nieuw" ? onNew : key === page && !(key === "shop" && onNew);
    return `<a href="${href}"${active ? ' aria-current="page"' : ""}><span>${label}</span></a>`;
  }).join("");
  const free = CONFIG.freeShippingFrom ? `Gratis verzending vanaf ${euro(CONFIG.freeShippingFrom)}` : "Verzending door heel Nederland";

  $("site-header").outerHTML = `
  <div class="announce"><span class="drop-part">${CONFIG.dropName} ${CONFIG.dropLive ? "is live" : "komt eraan"}  ·  </span>${free}<span class="long">  ·  Betalen met iDEAL  ·  In huis binnen 1-2 werkdagen</span></div>
  <header class="top" id="top">
    <div class="wrap">
      <button class="icon-btn menu-btn" id="menuBtn" aria-label="Menu" aria-expanded="false" aria-controls="mainNav">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
      <a href="index.html" class="logo">OUT<span>RUN</span></a>
      <nav aria-label="Menu" id="mainNav">${links}</nav>
      <div class="top-actions">
        <button class="icon-btn" id="themeBtn" aria-label="Wissel licht/donker">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
        </button>
        <button class="cart-btn" id="cartBtn" type="button" aria-label="Winkelmand" aria-controls="cartDrawer">
          ${BAG_ICON}<span class="cart-label">Winkelmand</span><span class="cart-count" id="cartCount">0</span>
        </button>
      </div>
    </div>
  </header>`;

  $("site-footer").outerHTML = `
  <footer>
    <div class="wrap foot-grid">
      <div>
        <a href="index.html" class="logo">OUT<span>RUN</span></a>
        <p>Streetwear in kleine drops. Look duur, betaal eerlijk. Verzending door heel Nederland.</p>
      </div>
      <div><div class="foot-h">Shop</div>${CATS.map(c => `<a href="shop.html?cat=${encodeURIComponent(c)}">${c}</a>`).join("")}</div>
      <div><div class="foot-h">Hulp</div><a href="maten.html">Maattabel</a><a href="info.html#bestellen">Bestellen</a><a href="info.html#verzenden">Verzenden en ophalen</a><a href="info.html#retour">Ruilen en retour</a><a href="aanvragen.html">Iets aanvragen</a></div>
      <div><div class="foot-h">Contact</div><span>Mail: <a href="mailto:${CONFIG.email}">${CONFIG.email}</a></span><span>Snapchat: <a href="${snapUrl}" target="_blank" rel="noopener">${CONFIG.snapUsername}</a></span><span>KvK: ${CONFIG.kvk}</span><a href="over.html">Over OUTRUN</a></div>
    </div>
    <div class="wrap foot-mark-wrap"><a href="index.html" class="foot-mark" data-fit aria-label="OUTRUN, naar de homepage">${[..."OUTRUN"].map((c, i) => `<span class="${i > 2 ? "acc" : ""}" aria-hidden="true">${c}</span>`).join("")}</a></div>
    <div class="wrap foot-bottom"><span>© ${new Date().getFullYear()} OUTRUN</span><span>Betalen met iDEAL · Foto's: Unsplash</span></div>
  </footer>`;

  /* filmkorrel over de hele site */
  document.body.insertAdjacentHTML("beforeend", '<div class="grain" aria-hidden="true"></div>');

  /* winkelmand-lade */
  document.body.insertAdjacentHTML("beforeend", `
  <div class="drawer-veil" id="cartVeil"></div>
  <aside class="drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-labelledby="cartTitle" aria-hidden="true">
    <div class="drawer-head">
      <h2 id="cartTitle">Winkelmand</h2>
      <button class="icon-btn" id="cartClose" type="button" aria-label="Winkelmand sluiten">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="drawer-body" id="cartBody" data-lenis-prevent></div>
    <div class="drawer-foot" id="cartFoot"></div>
  </aside>`);

  const menuBtn = $("menuBtn"), nav = $("mainNav");
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  $("themeBtn").addEventListener("click", () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("outrun-theme", root.dataset.theme); } catch(e){}
  });

  $("cartBtn").addEventListener("click", openCart);
  $("cartClose").addEventListener("click", closeCart);
  $("cartVeil").addEventListener("click", closeCart);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && document.documentElement.classList.contains("cart-open")) closeCart(); });
  $("cartBody").addEventListener("click", e => {
    const b = e.target.closest("[data-line]"); if (!b) return;
    const i = +b.dataset.line, l = Cart.lines()[i];
    if (b.dataset.act === "min") Cart.set(i, l.q - 1);
    if (b.dataset.act === "plus"){ if (l.q >= l.max) toast(`Nog maar ${l.max} op voorraad`); else Cart.set(i, l.q + 1); }
    if (b.dataset.act === "del") Cart.set(i, 0);
  });
  addEventListener("storage", e => { if (e.key === Cart.key) renderCart(); });

  document.querySelectorAll(".snapname").forEach(el => el.textContent = CONFIG.snapUsername);
  document.querySelectorAll(".mailaddr").forEach(el => el.textContent = CONFIG.email);
  document.querySelectorAll(".snaplink").forEach(a => a.href = snapUrl);
  renderCart();
}

let cartLastFocus = null;
function openCart(){
  cartLastFocus = document.activeElement;
  document.documentElement.classList.add("cart-open");
  $("cartDrawer").setAttribute("aria-hidden", "false");
  window.lenis && window.lenis.stop();
  setTimeout(() => $("cartClose").focus(), 50);
}
function closeCart(){
  document.documentElement.classList.remove("cart-open");
  $("cartDrawer").setAttribute("aria-hidden", "true");
  window.lenis && window.lenis.start();
  if (cartLastFocus) cartLastFocus.focus();
}

function renderCart(){
  if (!$("cartBody")) return;
  const lines = Cart.lines(), n = lines.reduce((a, l) => a + l.q, 0), sub = Cart.subtotal();
  const countEl = $("cartCount");
  if (countEl.textContent !== String(n)){
    countEl.textContent = n;
    countEl.classList.remove("bump"); void countEl.offsetWidth; countEl.classList.add("bump");
  }
  countEl.hidden = n === 0;
  $("cartTitle").textContent = n ? `Winkelmand (${n})` : "Winkelmand";

  if (!lines.length){
    $("cartBody").innerHTML = `<div class="drawer-empty">${BAG_ICON}<h3>Je winkelmand is leeg</h3><p>Nog niks gevonden? Check wat er nieuw binnen is.</p><a class="snap-btn" href="shop.html">Naar de shop</a></div>`;
    $("cartFoot").innerHTML = "";
    return;
  }
  $("cartBody").innerHTML = lines.map((l, i) => `
    <div class="line">
      <a href="${productUrl(l.p)}&kleur=${encodeURIComponent(l.color.n)}" class="line-img"><img src="${l.color.img}" alt=""></a>
      <div class="line-info">
        <div class="line-top"><a href="${productUrl(l.p)}&kleur=${encodeURIComponent(l.color.n)}">${esc(l.p.name)}</a><span class="price">${euro(l.p.price * l.q)}</span></div>
        <div class="meta">${esc(l.color.n)}${l.size !== "One size" ? " · maat " + l.size : ""}${l.max <= CONFIG.lowStock ? ` · <span class="warn">nog ${l.max}</span>` : ""}</div>
        <div class="line-bottom">
          <div class="qty" role="group" aria-label="Aantal">
            <button type="button" data-line="${i}" data-act="min" aria-label="Eén minder">−</button>
            <span>${l.q}</span>
            <button type="button" data-line="${i}" data-act="plus" aria-label="Eén meer"${l.q >= l.max ? ' class="is-max"' : ""}>+</button>
          </div>
          <button type="button" class="line-del" data-line="${i}" data-act="del">Verwijder</button>
        </div>
      </div>
    </div>`).join("");

  const togo = CONFIG.freeShippingFrom ? CONFIG.freeShippingFrom - sub : 0;
  const pct = CONFIG.freeShippingFrom ? Math.min(100, sub / CONFIG.freeShippingFrom * 100) : 100;
  $("cartFoot").innerHTML = `
    ${CONFIG.freeShippingFrom ? `<div class="ship-meter"><p>${togo > 0 ? `Nog <b>${euro(togo)}</b> tot gratis verzending` : "Je hebt <b>gratis verzending</b>"}</p><div class="meter"><i style="width:${pct}%"></i></div></div>` : ""}
    <div class="sum-row"><span>Subtotaal</span><span class="price">${euro(sub)}</span></div>
    <p class="hint">Verzendkosten zie je bij het afrekenen. Ophalen${CONFIG.pickupPlace ? " in " + CONFIG.pickupPlace : ""} is gratis.</p>
    <a class="snap-btn checkout-btn" href="afrekenen.html">Afrekenen</a>
    <button type="button" class="link-btn" id="cartMore">Verder winkelen</button>`;
  $("cartMore").addEventListener("click", closeCart);
}

/* ---------- toast ---------- */
let toastTimer;
function toast(msg, ms){
  let el = $("toast");
  if (!el){ el = document.createElement("div"); el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status"); document.body.append(el); }
  el.textContent = msg; el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.hidden = true, ms || 2600);
}

/* ---------- groot logo precies de volle breedte laten vullen ---------- */
function fitText(){
  document.querySelectorAll("[data-fit]").forEach(el => {
    el.style.fontSize = "100px";
    const cs = getComputedStyle(el.parentElement);
    const w = el.scrollWidth, room = el.parentElement.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    if (w) el.style.fontSize = Math.min(100 * room / w * 0.93, 400).toFixed(1) + "px"; /* marge voor de schuine stand */
  });
}

renderChrome();
fitText();
addEventListener("resize", fitText);
if (document.fonts) document.fonts.ready.then(fitText);
