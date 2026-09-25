/* ====== INSTELLINGEN — pas deze aan ====== */
const CONFIG = {
  snapUsername: "outrun.store",      // Snapchat, alleen voor contact
  dropName: "Drop 02 · Winter",
  dropLive: true,                    // false = drop komt eraan, true = drop is live
  kvk: "volgt",                      // je KvK-nummer
  email: "outrun.store22@gmail.com", // bestellingen, aanvragen en contact komen hier binnen
  siteUrl: "https://outrunstore.github.io/",
  lowStock: 2,                       // vanaf dit aantal of minder: "Bijna op"
  shippingCost: 4.95,                // verzendkosten in euro's
  freeShippingFrom: 100,             // gratis verzending vanaf dit bedrag (0 = nooit gratis)
  pickupPlace: "Leiden"              // ophalen is gratis; leeg laten ("") = geen ophaaloptie
};

/* Producten
   price:  prijs in euro's
   was:    oude prijs (optioneel) -> sale-label
   isNew:  true -> label "Nieuw"
   soon:   true -> label "Binnenkort", reserveren via Snap
   extra:  extra foto's voor de productpagina (optioneel)
   colors: per kleur een naam, kleurcode, foto en voorraad per maat.
           Voorraad 0 = uitverkocht in die maat. Alles 0 = hele kleur uitverkocht. */
const PRODUCTS = [
  /* ---------- Jassen ---------- */
  {id:"nightrun", name:"Nightrun Puffer", cat:"Jassen", price:89, isNew:true,
   desc:"Lichte gewatteerde puffer met opstaande kraag. Waterafstotend, warm en toch niet log.",
   details:["Gewatteerd, waterafstotend nylon","Opstaande kraag, twee ritszakken","Regular fit"],
   colors:[{n:"Zwart", hex:"#1B1C20", img:"img/nightrun-zwart.jpg", stock:{S:2, M:0, L:3, XL:1}}]},
  {id:"gloss", name:"Gloss Puffer", cat:"Jassen", price:119,
   desc:"Glanzende oversized puffer met capuchon. Dikke vulling voor de koudste dagen.",
   details:["Glanzend ripstop, dikke vulling","Vaste capuchon","Oversized fit"],
   colors:[{n:"Zwart glans", hex:"#0E0F12", img:"img/gloss-zwart.jpg", stock:{S:0, M:0, L:0, XL:0}}]},
  {id:"aviator", name:"Aviator Jacket", cat:"Jassen", price:109,
   desc:"Jas van imitatieleer met teddy kraag en teddy manchetten. Stoer en warm.",
   details:["Imitatieleer, teddy voering","Drukknopen op de kraag","Boxy fit"],
   colors:[{n:"Bruin", hex:"#3E332C", img:"img/aviator-bruin.jpg", stock:{S:0, M:1, L:0, XL:2}}]},
  {id:"bomber", name:"Pace Bomber", cat:"Jassen", price:69, was:85,
   desc:"Lichte satijnen bomber met geribde boorden. Perfect voor tussen de seizoenen.",
   details:["Satijnlook, licht gevoerd","Geribde kraag en boorden","Regular fit"],
   colors:[{n:"Camel", hex:"#B86A45", img:"img/bomber-camel.jpg", stock:{S:3, M:4, L:2, XL:0}}]},
  {id:"biker", name:"Night Biker", cat:"Jassen", price:99,
   desc:"Klassieke bikerjack van imitatieleer met schuine rits en metalen details.",
   details:["Imitatieleer","Schuine rits, riem aan de onderkant","Slim fit, valt kleiner"],
   colors:[{n:"Zwart", hex:"#1B1C20", img:"img/biker-zwart.jpg", stock:{S:1, M:0, L:0, XL:0}}]},
  {id:"fleece", name:"Trail Fleece", cat:"Jassen", price:79, soon:true,
   desc:"Teddy fleece met colour-block panelen. Komt binnenkort, snap ons om er een te reserveren.",
   details:["Sherpa fleece","Nylon panelen en borstzak","Oversized fit"],
   colors:[{n:"Crème", hex:"#E6DFD2", img:"img/fleece-creme.jpg", stock:{S:0, M:0, L:0, XL:0}}]},

  /* ---------- Hoodies ---------- */
  {id:"core", name:"Core Hoodie", cat:"Hoodies", price:49, isNew:true,
   desc:"De basis van elke fit. Zware hoodie van 400 GSM met dubbele capuchon en kangoeroezak.",
   details:["400 GSM katoen/polyester","Dubbele capuchon, geen koordjes","Oversized fit"],
   colors:[
     {n:"Taupe", hex:"#7A6A60", img:"img/core-taupe.jpg", stock:{S:4, M:6, L:0, XL:2}},
     {n:"Zand", hex:"#CDBBA7", img:"img/core-zand.jpg", stock:{S:0, M:3, L:5, XL:1}},
     {n:"Lichtgrijs", hex:"#C9CACB", img:"img/core-grijs.jpg", stock:{S:2, M:1, L:3, XL:4}},
     {n:"Wit", hex:"#F2F1ED", img:"img/core-wit.jpg", stock:{S:0, M:0, L:0, XL:0}}]},
  {id:"clay", name:"Clay Hoodie", cat:"Hoodies", price:52,
   desc:"Hoodie in roestbruin met extra lange koorden. Was binnen een dag op.",
   details:["380 GSM","Lange platte koorden","Oversized fit"],
   colors:[{n:"Roestbruin", hex:"#9A5A3A", img:"img/clay-bruin.jpg", stock:{S:0, M:0, L:0, XL:0}}]},
  {id:"fog", name:"Fog Hoodie", cat:"Hoodies", price:49,
   desc:"Donkergroene hoodie met ruime capuchon. Rustige kleur, past bij alles.",
   details:["380 GSM","Ruime capuchon","Regular fit"],
   colors:[{n:"Flessengroen", hex:"#1F3B30", img:"img/fog-olijf.jpg", stock:{S:1, M:2, L:0, XL:1}}]},
  {id:"zip", name:"Zip Hoodie", cat:"Hoodies", price:55,
   desc:"Hoodie met doorlopende rits en geborduurde patch op de borst.",
   details:["350 GSM gemêleerd","Metalen rits, geborduurde patch","Regular fit"],
   colors:[{n:"Antraciet", hex:"#3A3B3F", img:"img/zip-antraciet.jpg", stock:{S:3, M:0, L:2, XL:2}}]},

  /* ---------- T-shirts ---------- */
  {id:"blank", name:"Blank Tee", cat:"T-shirts", price:25,
   desc:"Zwaar basic T-shirt dat na tien keer wassen nog steeds strak zit.",
   details:["240 GSM katoen","Stevige kraag","Regular fit"],
   colors:[
     {n:"Wit", hex:"#F2F1ED", img:"img/blank-wit.jpg", stock:{S:8, M:10, L:6, XL:3}},
     {n:"Zwart", hex:"#1B1C20", img:"img/blank-zwart.jpg", stock:{S:0, M:4, L:2, XL:0}}]},
  {id:"boxy", name:"Boxy Tee", cat:"T-shirts", price:29, isNew:true,
   desc:"Kort en wijd T-shirt met verlaagde schouders. De fit die je nu overal ziet.",
   details:["260 GSM katoen","Verlaagde schouders","Boxy fit, korter model"],
   colors:[{n:"Wit", hex:"#F2F1ED", img:"img/boxy-wit.jpg", stock:{S:0, M:2, L:1, XL:0}}]},
  {id:"teepack", name:"Tee 3-Pack", cat:"T-shirts", price:59, was:75,
   desc:"Drie Blank Tees in één pack: bordeaux, wit en navy. Voordeliger dan los.",
   details:["3x 240 GSM katoen","Bordeaux, wit en navy","Regular fit"],
   colors:[{n:"Mix", hex:"conic-gradient(#6E1C22 0 33%,#F2F1ED 0 66%,#16213F 0)", img:"img/tee-pack.jpg", stock:{S:2, M:0, L:3, XL:1}}]},

  /* ---------- Trainingspakken ---------- */
  {id:"track01", name:"Track Set 01", cat:"Trainingspakken", price:79,
   desc:"Hoodie en joggingbroek als set. Zacht van binnen, strak van buiten.",
   details:["Hoodie + joggingbroek","380 GSM, geborstelde binnenkant","Relaxed fit"],
   colors:[
     {n:"Zwart", hex:"#1B1C20", img:"img/track01-zwart.jpg", stock:{S:3, M:0, L:4, XL:2}},
     {n:"IJsblauw", hex:"#BCD0DC", img:"img/track01-ijsblauw.jpg", stock:{S:0, M:0, L:1, XL:0}}]},
  {id:"track02", name:"Track Set 02", cat:"Trainingspakken", price:79, isNew:true,
   desc:"Opvallende set in felle kleuren. Cropped hoodie en wijde joggingbroek.",
   details:["Cropped hoodie + wijde jogger","350 GSM","Oversized fit"],
   colors:[
     {n:"Geel", hex:"#F2B632", img:"img/track02-geel.jpg", stock:{S:2, M:3, L:0, XL:0}},
     {n:"Roze", hex:"#F6B8D9", img:"img/track02-roze.jpg", stock:{S:0, M:0, L:0, XL:0}}]},

  /* ---------- Broeken ---------- */
  {id:"jogger", name:"Lap Jogger", cat:"Broeken", price:39,
   desc:"Joggingbroek met elastische boorden en koord in de taille. Voor thuis en buiten.",
   details:["300 GSM","Elastische boorden, steekzakken","Regular fit"],
   colors:[
     {n:"Grijs", hex:"#A7A8AA", img:"img/jogger-grijs.jpg", stock:{S:5, M:3, L:4, XL:2}},
     {n:"Blauw", hex:"#2BA7D8", img:"img/jogger-blauw.jpg", stock:{S:1, M:0, L:2, XL:0}},
     {n:"Mint", hex:"#BDEBE0", img:"img/jogger-mint.jpg", stock:{S:0, M:0, L:0, XL:0}}]},
  {id:"cargo", name:"Cargo Pant", cat:"Broeken", price:59,
   desc:"Stevige cargobroek met zes zakken en verstelbare pijpen.",
   details:["Katoen twill","Zes zakken, trekkoord onderaan","Relaxed fit"],
   colors:[
     {n:"Zwart", hex:"#1B1C20", img:"img/cargo-zwart.jpg", stock:{S:2, M:3, L:0, XL:1}},
     {n:"Olijf", hex:"#5B5E45", img:"img/cargo-olijf.jpg", stock:{S:0, M:1, L:2, XL:0}}]},

  /* ---------- Schoenen ---------- */
  {id:"stride", name:"Stride Low", cat:"Schoenen", price:69,
   desc:"Leren low-top met suède hak en dikke witte zool.",
   details:["Leer en suède","Rubberen cupzool","Valt normaal"],
   colors:[{n:"Wit/zand", hex:"#E4D6C2", img:"img/stride-wit.jpg", stock:{"40":1, "41":3, "42":0, "43":2, "44":0, "45":1}}]},
  {id:"cloud", name:"Cloud Low", cat:"Schoenen", price:65, isNew:true,
   desc:"Strakke witte sneaker met een zachte, dikke zool. Past onder elke broek.",
   details:["Leer","Zachte binnenzool","Valt normaal"],
   colors:[{n:"Wit", hex:"#F1F1EE", img:"img/cloud-wit.jpg", stock:{"40":2, "41":0, "42":4, "43":3, "44":1, "45":0}}]},
  {id:"shadow", name:"Shadow Low", cat:"Schoenen", price:75,
   desc:"Volledig zwarte leren sneaker. Clean, zonder logo's.",
   details:["Leer","Zwarte zool","Valt normaal"],
   colors:[{n:"Zwart", hex:"#1B1C20", img:"img/shadow-zwart.jpg", stock:{"40":0, "41":0, "42":0, "43":0, "44":0, "45":0}}]},

  /* ---------- Petten ---------- */
  {id:"pace", name:"Pace Cap", cat:"Petten", price:22,
   desc:"Zes-panel pet met gebogen klep en verstelbare sluiting.",
   details:["Katoen","Verstelbare sluiting","One size"],
   colors:[
     {n:"Washed grijs", hex:"#6E6F72", img:"img/pace-grijs.jpg", stock:{"One size":6}},
     {n:"Wit", hex:"#F2F1ED", img:"img/pace-wit.jpg", stock:{"One size":3}},
     {n:"Geel", hex:"#F2B632", img:"img/pace-geel.jpg", stock:{"One size":0}}]},
  {id:"trucker", name:"Trucker Cap", cat:"Petten", price:20,
   desc:"Trucker met foam voorpaneel en mesh achterkant.",
   details:["Foam + mesh","Snapback-sluiting","One size"],
   colors:[
     {n:"Zwart/wit", hex:"conic-gradient(#1B1C20 0 50%,#F2F1ED 0)", img:"img/trucker-zwartwit.jpg", stock:{"One size":0}},
     {n:"Wit", hex:"#F2F1ED", img:"img/trucker-wit.jpg", stock:{"One size":0}}]},

  /* ---------- Mutsen ---------- */
  {id:"beanie", name:"Cold Lap Beanie", cat:"Mutsen", price:18,
   desc:"Dikke ribmuts met omslagrand. Blijft zitten, ook als het waait.",
   details:["Acryl/wol","Dikke rib, omslagrand","One size"],
   colors:[
     {n:"Zwart", hex:"#1B1C20", img:"img/beanie-zwart.jpg", stock:{"One size":9}},
     {n:"Oker", hex:"#C9971F", img:"img/beanie-oker.jpg", stock:{"One size":2}},
     {n:"Grijs gemêleerd", hex:"#B7B1A7", img:"img/beanie-grijs.jpg", stock:{"One size":0}}]},

  /* ---------- Accessoires ---------- */
  {id:"sling", name:"Sling Bag", cat:"Accessoires", price:35,
   desc:"Compacte crossbody tas voor je telefoon, sleutels en pasjes.",
   details:["Imitatieleer, verstelbare band","Twee ritsvakken","19 x 12 x 6 cm"],
   extra:["img/sling-look.jpg"],
   colors:[{n:"Zwart", hex:"#1B1C20", img:"img/sling-zwart.jpg", stock:{"One size":4}}]}
];

/* Lookbook: foto + welke producten erin zitten */
const LOOKS = [
  {img:"img/look-hero.jpg", title:"Night shift", products:["blank","cargo","nightrun"]},
  {img:"img/aviator-bruin.jpg", title:"Teddy season", products:["aviator","beanie"]},
  {img:"img/cargo-olijf.jpg", title:"Park lap", products:["cargo","beanie"]},
  {img:"img/track02-geel.jpg", title:"Court side", products:["track02"]},
  {img:"img/fleece-creme.jpg", title:"Underpass", products:["fleece","beanie"]},
  {img:"img/nightrun-zwart.jpg", title:"Cold start", products:["nightrun","jogger"]},
  {img:"img/look-beanie.jpg", title:"Close up", products:["beanie"]},
  {img:"img/sling-look.jpg", title:"Hands free", products:["sling","core"]}
];
/* ========================================= */

/* thema en intro meteen zetten, voordat de pagina tekent */
(() => {
  const root = document.documentElement;
  root.classList.add("js");
  try { const t = localStorage.getItem("outrun-theme"); if (t) root.dataset.theme = t; } catch(e){}
  /* startanimatie alleen bij het eerste bezoek per sessie */
  let seen = true;
  try { seen = sessionStorage.getItem("outrun-intro") === "1"; } catch(e){}
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!calm) {
    root.classList.add("motion");
    setTimeout(() => root.classList.add("is-ready"), 4000); /* vangnet als motion.js niet laadt */
  }
  if (!seen && !calm) {
    root.classList.add("intro-pending");
    setTimeout(() => root.classList.remove("intro-pending"), 4000); /* vangnet */
  }
})();
