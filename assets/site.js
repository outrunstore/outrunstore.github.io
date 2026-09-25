/* ====== OUTRUN — gedeelde code voor alle pagina's ====== */
const snapUrl = "https://www.snapchat.com/add/" + encodeURIComponent(CONFIG.snapUsername);
const euro = n => "€" + n.toFixed(0);
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
  const sizeLine = p.soon ? '<span class="meta">Reserveer via Snap</span>'
    : sizes.length === 1 ? `<span class="meta">${isSoldOut(p) ? "Uitverkocht" : sizes[0]}</span>`
    : `<span class="size-line">${sizes.map(s => sizesInStock(p).includes(s) ? `<span>${s}</span>` : `<s title="Uitverkocht">${s}</s>`).join("")}</span>`;
  return `
  <a class="card${isSoldOut(p) ? " is-out" : ""}" href="${productUrl(p)}">
    <div class="card-img">
      ${badges(p)}
      <img src="${p.colors[0].img}" alt="${esc(p.name)} in ${esc(p.colors[0].n.toLowerCase())}" loading="lazy">
      ${img2 ? `<img class="alt" src="${img2}" alt="" loading="lazy">` : ""}
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

/* ---------- header, footer, menu ---------- */
const SNAP_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5c3 0 5.2 2.3 5.2 5.3v2.3c.5.2 1.1.1 1.6-.1.6-.2 1.1.5.6 1-.5.4-1.4.8-2.1 1 .6 1.9 2 3.3 4 3.9.5.2.4.8-.1 1-.8.3-1.7.4-2.1.6-.2.5-.2 1.1-.6 1.2-.7.1-1.6-.3-2.6.1-.9.4-1.8 1.7-3.9 1.7s-3-1.3-3.9-1.7c-1-.4-1.9 0-2.6-.1-.4-.1-.4-.7-.6-1.2-.4-.2-1.3-.3-2.1-.6-.5-.2-.6-.8-.1-1 2-.6 3.4-2 4-3.9-.7-.2-1.6-.6-2.1-1-.5-.5 0-1.2.6-1 .5.2 1.1.3 1.6.1V7.8c0-3 2.2-5.3 5.2-5.3z"/></svg>';
const NAV = [
  ["shop.html", "Shop", "shop"], ["shop.html?filter=nieuw", "Nieuw", "nieuw"], ["lookbook.html", "Lookbook", "lookbook"],
  ["maten.html", "Maten", "maten"], ["aanvragen.html", "Aanvragen", "aanvragen"], ["info.html", "Info", "info"], ["over.html", "Over ons", "over"]
];

function renderChrome(){
  const page = document.body.dataset.page;
  const onNew = page === "shop" && new URLSearchParams(location.search).get("filter") === "nieuw";
  const links = NAV.map(([href, label, key]) => {
    const active = key === "nieuw" ? onNew : key === page && !(key === "shop" && onNew);
    return `<a href="${href}"${active ? ' aria-current="page"' : ""}>${label}</a>`;
  }).join("");

  $("site-header").outerHTML = `
  <div class="announce">${CONFIG.dropName} ${CONFIG.dropLive ? "is live" : "komt eraan"}  ·  Bestellen via Snapchat<span class="long">  ·  Verzending door heel Nederland in 1-2 werkdagen</span></div>
  <header class="top">
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
        <a class="snap-btn top-cta snaplink" href="${snapUrl}" target="_blank" rel="noopener">${SNAP_ICON}<span>Volg op Snap</span></a>
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
      <div><div class="foot-h">Contact</div><span>Snap: <strong>${CONFIG.snapUsername}</strong></span><span>Mail: <a href="mailto:${CONFIG.email}">${CONFIG.email}</a></span><span>KvK: ${CONFIG.kvk}</span><a href="over.html">Over OUTRUN</a></div>
    </div>
    <div class="wrap foot-bottom"><span>© ${new Date().getFullYear()} OUTRUN</span><span>Foto's: Unsplash</span></div>
  </footer>`;

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

  document.querySelectorAll(".snapname").forEach(el => el.textContent = CONFIG.snapUsername);
  document.querySelectorAll(".mailaddr").forEach(el => el.textContent = CONFIG.email);
  document.querySelectorAll(".snaplink").forEach(a => a.href = snapUrl);
}

/* ---------- toast ---------- */
let toastTimer;
function toast(msg, ms){
  let el = $("toast");
  if (!el){ el = document.createElement("div"); el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status"); document.body.append(el); }
  el.textContent = msg; el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.hidden = true, ms || 2600);
}

renderChrome();
