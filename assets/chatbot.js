/* ====== OUTRUN CHATBOT ====== */
(() => {
  document.body.insertAdjacentHTML("beforeend", `
  <button class="cb-fab" id="cbFab" type="button" aria-label="Open de OUTRUN-chatbot">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 7V4M9 12h.01M15 12h.01M9 16h6"/></svg>
    <span class="cb-label">Vragen? Chat met ons</span><span class="cb-live" aria-hidden="true"></span>
  </button>
  <div class="cb-panel" id="cbPanel" role="dialog" aria-label="OUTRUN chatbot" hidden>
    <div class="cb-head">
      <div><b>Outrun Bot</b><small class="cb-status"><i></i>Chatbot · 24/7 online</small></div>
      <button class="cb-x" id="cbClose" type="button" aria-label="Chat sluiten">×</button>
    </div>
    <div class="cb-log" id="cbLog" aria-live="polite" data-lenis-prevent></div>
    <div class="cb-chips" id="cbChips"></div>
    <form class="cb-form" id="cbForm">
      <input id="cbInput" type="text" autocomplete="off" placeholder="Typ je vraag…" aria-label="Je vraag">
      <button type="submit">Stuur</button>
    </form>
  </div>`);

  const fab = $("cbFab"), panel = $("cbPanel"), log = $("cbLog"), chipsEl = $("cbChips"), form = $("cbForm"), input = $("cbInput");
  const snap = CONFIG.snapUsername, mail = CONFIG.email;
  const snapLink = `<a href="${snapUrl}" target="_blank" rel="noopener">${snap}</a>`;
  const mailLink = `<a href="mailto:${mail}">${mail}</a>`;
  const shipText = () => `Verzenden kost ${euro(CONFIG.shippingCost)}` + (CONFIG.freeShippingFrom ? `, gratis vanaf ${euro(CONFIG.freeShippingFrom)}` : "");
  const DEFAULT_CHIPS = ["Welke maat past mij?", "Wat is uitverkocht?", "Prijzen", "Hoe bestel ik?", "Iets aanvragen"];

  const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const has = (t, words) => words.filter(w => t.includes(w)).length;
  const word = (t, w) => new RegExp("(^|[^a-z])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^a-z]|$)").test(t);

  /* woorden per categorie */
  const CAT_WORDS = {
    "Jassen": ["jas", "jassen", "jacket", "puffer", "winterjas", "bomber", "jack"],
    "Hoodies": ["hoodie", "hoodies", "trui", "sweater"],
    "T-shirts": ["shirt", "tshirt", "t-shirt", "tee", "shirts"],
    "Trainingspakken": ["trainingspak", "trainingspakken", "tracksuit", "joggingpak", "set", "pak"],
    "Broeken": ["broek", "broeken", "jogger", "joggingbroek", "cargo", "pants"],
    "Schoenen": ["schoen", "schoenen", "sneaker", "sneakers", "kicks"],
    "Petten": ["pet", "petten", "cap", "caps"],
    "Mutsen": ["muts", "mutsen", "beanie"],
    "Accessoires": ["tas", "tasje", "bag", "sling", "accessoires"]
  };
  /* extra woorden per product naast de productnaam */
  const PRODUCT_WORDS = { gloss: ["glanzend", "glans"], teepack: ["3-pack", "pack"], track01: ["set 01"], track02: ["set 02"], biker: ["leer", "leren"] };
  const BRANDS = ["nike", "moncler", "jordan", "stone island", "north face", "trapstar", "corteiz", "canada goose", "adidas", "gucci", "louis vuitton", "prada", "balenciaga", "arcteryx", "arc'teryx", "ralph lauren", "lacoste", "palm angels", "off-white", "off white", "yeezy", "new balance", "puma", "burberry", "dior", "supreme"];

  function findProducts(t){
    /* eerst op productnaam, bijv. "core hoodie" of alleen "core" */
    const byName = PRODUCTS.filter(p => {
      const first = norm(p.name).split(" ")[0];
      return t.includes(norm(p.name)) || (first.length > 3 && word(t, first)) || (PRODUCT_WORDS[p.id] || []).some(w => t.includes(w));
    });
    if (byName.length) return byName;
    const cats = Object.entries(CAT_WORDS).filter(([, ws]) => ws.some(w => word(t, w))).map(([c]) => c);
    return PRODUCTS.filter(p => cats.includes(p.cat));
  }

  const link = p => `<a href="${productUrl(p)}">${esc(p.name)}</a>`;
  function stockLine(p){
    if (p.soon) return `• ${link(p)}: binnenkort binnen`;
    if (isSoldOut(p)) return `• ${link(p)}: helemaal uitverkocht`;
    const parts = p.colors.map(c => {
      const free = Object.keys(c.stock).filter(s => c.stock[s] > 0);
      if (!free.length) return `${c.n.toLowerCase()}: uitverkocht`;
      return `${c.n.toLowerCase()}: ${free.length === 1 && free[0] === "One size" ? "op voorraad" : free.join(", ")}`;
    });
    return `• ${link(p)}: ${parts.join(" · ")}`;
  }
  const priceLine = p => `• ${link(p)}: ${p.was ? `<s>${euro(p.was)}</s> ` : ""}${euro(p.price)}${p.soon ? " (binnenkort)" : isSoldOut(p) ? " (uitverkocht)" : ""}`;

  function sizeFor(cm){
    if (cm < 165) return "S (valt ruim, dus S is voor jou de beste keuze)";
    if (cm < 172) return "S";
    if (cm < 178) return "M";
    if (cm < 184) return "L";
    if (cm <= 190) return "XL";
    return "XL (bij ruim 1,90 m raden we je aan ons even te mailen, dan checken we de lengte)";
  }

  function answer(raw){
    const t = " " + norm(raw) + " ";
    let prods = findProducts(t);
    /* op een productpagina: vragen zonder productnaam gaan over dat product */
    const ctx = window.currentProduct;
    const cm = (t.match(/\b(1[4-9]\d|20\d)\b/) || [])[1];
    const brand = BRANDS.find(b => t.includes(b));

    if (brand) return { text: `Andere merken verkopen we niet, bro. Alleen ons eigen label OUTRUN. Maar gooi een foto in het <a href="aanvragen.html">aanvraagformulier</a>, dan zoeken we iets in dezelfde vibe.`, chips: ["Naar aanvraagformulier", "Bekijk de collectie"] };

    const intents = {
      greet:   has(t, [" hoi ", " hallo ", " hey ", " hi ", " yo ", " salam", " goedemiddag", " goedemorgen", " goedenavond", " hee ", " ewa", " wollah", " wsg", " alles goed"]),
      thanks:  has(t, ["bedankt", "dank je", "dankje", "thanks", "thnx", " top ", "chill", "respect", " tof", "nice"]),
      stock:   has(t, ["voorraad", "uitverkocht", "op is op", "nog", "beschikbaar", "restock", "leverbaar", "sold out"]) * 2,
      size:    has(t, ["maat", "maten", "size", "past", "valt", "groot", "klein", "lengte", " cm", "oversized"]) + (cm ? 2 : 0),
      price:   has(t, ["prijs", "prijzen", "kost", "kosten", "hoeveel", "duur", "goedkoop", "euro", "sale", "korting", "aanbieding"]),
      ship:    has(t, ["verzend", "verzending", "verzendkosten", "bezorg", "lever", "postnl", "opsturen", "hoe lang", "wanneer binnen", "track"]),
      pickup:  has(t, ["ophalen", "afhalen", "leiden", "langskomen", "oppikken", "halen"]),
      pay:     has(t, ["betaal", "betalen", "tikkie", "ideal", "betaling", " pin", "contant", "cash"]),
      order:   has(t, ["bestel", "bestellen", "kopen", "koop", "reserveer", "reserveren", "hoe werkt", "winkelmand", "afrekenen", "checkout"]),
      request: has(t, ["aanvraag", "aanvragen", "zoek", "andere kleur", "heb je ook", "hebben jullie ook", "kunnen jullie", "regelen", "speciaal"]),
      drop:    has(t, ["drop", "nieuw", "binnenkort", "wanneer", "live"]),
      returns: has(t, ["retour", "ruilen", "terugsturen", "omruilen", "geld terug"]),
      human:   has(t, ["snap", "snapchat", "contact", "mens", "medewerker", "bellen", "whatsapp", "insta", "mail", "email"]),
      catalog: has(t, ["collectie", "producten", "wat verkopen", "wat hebben", "aanbod", "shop"])
    };
    const best = Object.entries(intents).sort((a, b) => b[1] - a[1])[0];
    let intent = best[1] > 0 ? best[0] : (prods.length ? "product" : "fallback");
    if (prods.length && ["greet", "thanks", "catalog"].includes(intent)) intent = "product";
    if (!prods.length && ctx && ["size", "stock", "price", "product"].includes(intent)) prods = [ctx];

    switch(intent){
      case "size": {
        if (prods.length && prods.every(p => p.cat === "Schoenen")) return { text: `Onze sneakers vallen normaal, dus pak gewoon je eigen maat.\n\n${prods.map(stockLine).join("\n")}`, chips: ["Wat is uitverkocht?", "Hoe bestel ik?"] };
        if (prods.length && prods.every(p => sizesOf(p).length === 1)) return { text: `${prods.map(p => p.name).join(" en ")} is one size, past iedereen.`, chips: ["Prijzen", "Hoe bestel ik?"] };
        if (cm) {
          const s = sizeFor(+cm), base = s.split(" ")[0];
          const check = prods.filter(p => sizesOf(p).includes(base));
          const extra = check.length ? "\n\n" + check.map(p => {
            const free = p.colors.filter(c => c.stock[base] > 0).map(c => c.n.toLowerCase());
            return `• ${link(p)} in ${base}: ${p.soon ? "binnenkort" : free.length ? "op voorraad in " + free.join(", ") : "uitverkocht"}`;
          }).join("\n") : "";
          return { text: `Met ${cm} cm zit je goed in maat ${s}. Alles valt oversized, dus wil je 'm strakker? Pak een maatje kleiner.${extra}`, chips: ["Maattabel", "Hoe bestel ik?"] };
        }
        return { text: "Hoe lang ben je? Typ bijv. \"ik ben 180\", dan fix ik je maat.\n\nS = 165-172 cm\nM = 172-178 cm\nL = 178-184 cm\nXL = 184-190 cm\n\nAlles valt oversized.", chips: ["Ik ben 175", "Ik ben 182", "Maattabel"] };
      }
      case "stock": {
        if (prods.length) return { text: `Dit is er nog:\n${prods.map(stockLine).join("\n")}\n\nIets uitverkocht? Klik op de productpagina op "laat het me weten bij restock", dan hoor je het als eerste.`, chips: ["Welke maat past mij?", "Hoe bestel ik?"] };
        const out = PRODUCTS.filter(isSoldOut), low = PRODUCTS.filter(isLow);
        return { text: `Helemaal uitverkocht:\n${out.map(p => "• " + link(p)).join("\n")}` + (low.length ? `\n\nBijna op, wees er fissa bij:\n${low.map(p => "• " + link(p)).join("\n")}` : "") + `\n\nVraag naar een specifiek item voor maten en kleuren, bijv. "is de core hoodie er nog in L?"`, chips: ["Bekijk de collectie", "Iets aanvragen"] };
      }
      case "price":
      case "product":
      case "catalog": {
        if (!prods.length && has(t, ["sale", "korting", "aanbieding"])) prods = PRODUCTS.filter(p => p.was);
        if (prods.length) return { text: prods.map(priceLine).join("\n") + `\n\nKlik op een item, kies je maat en gooi 'm in je winkelmand.`, chips: ["Wat is uitverkocht?", "Welke maat past mij?", "Hoe bestel ik?"] };
        const lines = CATS.map(c => {
          const ps = PRODUCTS.filter(p => p.cat === c).map(p => p.price);
          return `• <a href="shop.html?cat=${encodeURIComponent(c)}">${c}</a>: ${Math.min(...ps) === Math.max(...ps) ? euro(ps[0]) : euro(Math.min(...ps)) + " - " + euro(Math.max(...ps))}`;
        });
        return { text: `Dit zit er in ${CONFIG.dropName}:\n${lines.join("\n")}\n\nVraag naar een item voor de exacte prijs, bijv. "wat kost de nightrun puffer?"`, chips: ["Wat is uitverkocht?", "Hoe bestel ik?", "Bekijk de collectie"] };
      }
      case "ship":   return { text: `We sturen door heel NL met PostNL + track & trace. Binnen 1-2 werkdagen na betaling heb je 't binnen. ${shipText()}.`, chips: ["Ophalen", "Betalen", "Hoe bestel ik?"] };
      case "pickup": return { text: `Zit je in de buurt van ${CONFIG.pickupPlace || "Leiden"}? Kies bij het afrekenen voor ophalen, dat is gratis. We mailen je dan een tijd en plek.`, chips: ["Hoe bestel ik?", "Verzending"] };
      case "pay":    return { text: "Betalen gaat met iDEAL. Na je bestelling krijg je binnen 24 uur een betaalverzoek per mail. Eerst betalen, dan sturen we 't op. Binnen 24 uur niet betaald? Dan gaat je item terug in de voorraad.", chips: ["Hoe bestel ik?", "Verzending"] };
      case "order":  return { text: `Bestellen gaat gewoon hier op de site:\n1. Kies je item, kleur en maat en klik op "In winkelmand".\n2. Open je winkelmand en klik op "Afrekenen".\n3. Je krijgt een iDEAL-betaalverzoek. Na betaling ligt 't binnen 1-2 werkdagen bij je.`, chips: ["Bekijk de collectie", "Betalen", "Welke maat past mij?"] };
      case "request":return { text: `Staat 't er niet tussen? Vul het <a href="aanvragen.html">aanvraagformulier</a> in, met foto erbij als je hebt. Wij zoeken 't voor je en laten je de prijs weten.`, chips: ["Naar aanvraagformulier", "Prijzen"] };
      case "drop": {
        const fresh = PRODUCTS.filter(p => p.isNew), soon = PRODUCTS.filter(p => p.soon);
        return { text: (CONFIG.dropLive ? `${CONFIG.dropName} is live! Op is op, dus wees er fissa bij.` : `${CONFIG.dropName} komt eraan. Houd de site in de gaten!`) + (fresh.length ? `\n\nNieuw binnen:\n${fresh.map(p => "• " + link(p)).join("\n")}` : "") + (soon.length ? `\n\nBinnenkort:\n${soon.map(p => "• " + link(p)).join("\n")}` : ""), chips: ["Bekijk de collectie", "Wat is uitverkocht?"] };
      }
      case "returns":return { text: `Wil je iets ruilen of terugsturen? Mail ${mailLink} met je bestelnummer, dan fixen we 't samen.`, chips: ["Hoe bestel ik?", "Welke maat past mij?"] };
      case "human":  return { text: `Mail ons op ${mailLink}, of stuur een snap naar ${snapLink}.`, chips: ["Hoe bestel ik?", "Iets aanvragen"] };
      case "thanks": return { text: "Geen probleem, bro! Nog iets?", chips: DEFAULT_CHIPS };
      case "greet":  return { text: "Yo! Alles goed? Waar kan ik je mee helpen?", chips: DEFAULT_CHIPS };
      default:       return { text: `Hmm, daar heb ik geen antwoord op. Mail ${mailLink} ff, dan helpen we je persoonlijk.`, chips: DEFAULT_CHIPS };
    }
  }

  function add(html, who){
    const d = document.createElement("div");
    d.className = "cb-msg " + (who === "user" ? "cb-user" : "cb-bot");
    d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; return d;
  }
  function setChips(list){ chipsEl.innerHTML = list.map(c => `<button type="button" class="cb-chip">${c}</button>`).join(""); }

  const LINKS = { "Bekijk de collectie": "shop.html", "Naar aanvraagformulier": "aanvragen.html", "Maattabel": "maten.html" };
  function ask(q){
    q = q.trim(); if (!q) return;
    if (LINKS[q]){ location.href = LINKS[q]; return; }
    add(esc(q), "user"); setChips([]);
    const typing = add("…", "bot"); typing.classList.add("cb-typing");
    const map = {"Prijzen":"prijzen","Verzending":"verzending","Ophalen":"ophalen","Iets aanvragen":"aanvragen","Hoe bestel ik?":"hoe bestel ik","Betalen":"betalen","Wat is uitverkocht?":"uitverkocht"};
    const r = answer(map[q] || q);
    setTimeout(() => { typing.classList.remove("cb-typing"); typing.innerHTML = r.text; setChips(r.chips); log.scrollTop = log.scrollHeight; }, 450);
  }

  let started = false;
  function open(){
    panel.hidden = false; fab.hidden = true;
    if (!started){
      started = true;
      const ctx = window.currentProduct;
      add(ctx ? `Yo! Vragen over de ${esc(ctx.name)}? Vraag me naar maten, voorraad of hoe je bestelt.` : `Yo! Ik ben de OUTRUN-bot. Vraag me alles over maten, voorraad, prijzen, verzending of aanvragen.`, "bot");
      setChips(ctx ? ["Welke maat past mij?", "Nog op voorraad?", "Hoe bestel ik?"] : DEFAULT_CHIPS);
    }
    input.focus();
  }
  function close(){ panel.hidden = true; fab.hidden = false; fab.focus(); }

  fab.addEventListener("click", open);
  window.openChat = open;
  document.querySelectorAll("[data-open-chat]").forEach(b => b.addEventListener("click", open));
  $("cbClose").addEventListener("click", close);
  chipsEl.addEventListener("click", e => { const b = e.target.closest(".cb-chip"); if (b) ask(b.textContent); });
  form.addEventListener("submit", e => { e.preventDefault(); ask(input.value); input.value = ""; });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) close(); });
})();
