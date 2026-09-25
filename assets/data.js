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
  pickupPlace: "Leiden",             // ophalen is gratis; leeg laten ("") = geen ophaaloptie
  nextDrop: {                        // aftellen op de homepage; aanmeldingen komen binnen op `email`
    name: "Drop 03",
    date: "2026-11-14T19:00:00+01:00"
  }
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

  {id:"storm", name:"Storm Shell", cat:"Jassen", price:75, isNew:true,
   desc:"Lichte windbreaker met capuchon en colour-block panelen. Waterafstotend en pakt klein in.",
   details:["Waterafstotend nylon","Capuchon met koord, borstzak","Relaxed fit"],
   colors:[{n:"Navy/zwart", hex:"conic-gradient(#1F2A44 0 50%,#16171B 0)", img:"img/storm-navy.jpg", stock:{S:2, M:4, L:3, XL:0}}]},
  {id:"vest", name:"Block Vest", cat:"Jassen", price:69,
   desc:"Gewatteerde bodywarmer in drie kleurvlakken. Over een hoodie of onder een shell.",
   details:["Gewatteerd, waterafstotend","Opstaande kraag, ritszakken","Regular fit"],
   colors:[{n:"Petrol/geel", hex:"conic-gradient(#1F5C72 0 50%,#F2B632 0)", img:"img/vest-block.jpg", stock:{S:1, M:0, L:1, XL:0}}]},
  {id:"overshirt", name:"Work Overshirt", cat:"Jassen", price:59,
   desc:"Stevig overshirt van gewassen katoen. Draag 'm open als jas of dicht als shirt.",
   details:["Gewassen katoen twill","Drukknopen, twee borstzakken","Boxy fit"],
   colors:[{n:"Camel", hex:"#9C7A55", img:"img/overshirt-bruin.jpg", stock:{S:3, M:2, L:0, XL:2}}]},

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

  {id:"crew", name:"Base Crew", cat:"Hoodies", price:45, isNew:true,
   desc:"Crewneck sweater zonder poespas. Zwaar katoen, geribde boorden, valt ruim.",
   details:["380 GSM katoen","Geribde kraag en boorden","Oversized fit"],
   colors:[
     {n:"Wit", hex:"#F2F1ED", img:"img/crew-wit.jpg", stock:{S:4, M:5, L:3, XL:2}},
     {n:"Zwart", hex:"#1B1C20", img:"img/crew-zwart.jpg", stock:{S:0, M:2, L:0, XL:1}}]},

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

  {id:"denim", name:"Loose Denim", cat:"Broeken", price:69, isNew:true,
   desc:"Wijde jeans met een lichte wassing en rafels bij de knie. De broek bij alles.",
   details:["100% katoen denim","Lichte wassing, ripped details","Loose fit"],
   extra:["img/denim-stack.jpg"],
   colors:[{n:"Light wash", hex:"#8FA9C4", img:"img/denim-blauw.jpg", stock:{S:2, M:3, L:1, XL:0}}]},
  {id:"shorts", name:"Tide Shorts", cat:"Broeken", price:35, soon:true,
   desc:"Zomershort van licht katoen met elastische band. Komt in de volgende drop.",
   details:["Licht katoen","Elastische band met koord","Knielengte"],
   colors:[
     {n:"Salie", hex:"#A9B7A0", img:"img/shorts-salie.jpg", stock:{S:0, M:0, L:0, XL:0}},
     {n:"Wit", hex:"#F2F1ED", img:"img/shorts-wit.jpg", stock:{S:0, M:0, L:0, XL:0}}]},

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

  {id:"bucket", name:"Drift Bucket", cat:"Petten", price:25,
   desc:"Bucket hat van zacht katoen met een korte rand. Zon, regen, maakt niet uit.",
   details:["Katoen twill","Ventilatiegaatjes","One size"],
   colors:[{n:"Zand", hex:"#D9C7A7", img:"img/bucket-zand.jpg", stock:{"One size":3}}]},

  /* ---------- Mutsen ---------- */
  {id:"beanie", name:"Cold Lap Beanie", cat:"Mutsen", price:18,
   desc:"Dikke ribmuts met omslagrand. Blijft zitten, ook als het waait.",
   details:["Acryl/wol","Dikke rib, omslagrand","One size"],
   colors:[
     {n:"Zwart", hex:"#1B1C20", img:"img/beanie-zwart.jpg", stock:{"One size":9}},
     {n:"Oker", hex:"#C9971F", img:"img/beanie-oker.jpg", stock:{"One size":2}},
     {n:"Grijs gemêleerd", hex:"#B7B1A7", img:"img/beanie-grijs.jpg", stock:{"One size":0}}]},

  {id:"balaclava", name:"Ghost Balaclava", cat:"Mutsen", price:22, isNew:true,
   desc:"Gebreide balaclava die je ook als col draagt. Warm, strak, iets anders.",
   details:["Acryl/wol rib","Past onder een capuchon","One size"],
   colors:[{n:"Wit", hex:"#F2F1ED", img:"img/balaclava-wit.jpg", stock:{"One size":2}}]},

  /* ---------- Accessoires ---------- */
  {id:"sling", name:"Sling Bag", cat:"Accessoires", price:35,
   desc:"Compacte crossbody tas voor je telefoon, sleutels en pasjes.",
   details:["Imitatieleer, verstelbare band","Twee ritsvakken","19 x 12 x 6 cm"],
   extra:["img/sling-look.jpg"],
   colors:[{n:"Zwart", hex:"#1B1C20", img:"img/sling-zwart.jpg", stock:{"One size":4}}]},
  {id:"transit", name:"Transit Pack", cat:"Accessoires", price:59, isNew:true,
   desc:"Strakke rugzak met laptopvak van 15 inch en een verborgen rugvak voor je pas.",
   details:["Waterafstotend polyester","Laptopvak 15\", verborgen rugvak","22 liter"],
   colors:[
     {n:"Zwart", hex:"#1B1C20", img:"img/transit-zwart.jpg", stock:{"One size":5}},
     {n:"Navy", hex:"#1F2A44", img:"img/transit-navy.jpg", stock:{"One size":0}}]},
  {id:"shellpack", name:"Shell Pack", cat:"Accessoires", price:79, was:95,
   desc:"Rugzak van imitatieleer met klep en magneetsluiting. Clean genoeg voor elke fit.",
   details:["Imitatieleer","Magneetsluiting, binnenvak","14 liter"],
   colors:[{n:"Zwart", hex:"#16171B", img:"img/shell-zwart.jpg", stock:{"One size":2}}]},
  {id:"tote", name:"Canvas Tote", cat:"Accessoires", price:19,
   desc:"Stevige tote bag van dik canvas. Past een laptop, je gymspullen of een hele drop.",
   details:["340 GSM canvas","Lange hengsels","38 x 42 cm"],
   extra:["img/tote-look.jpg"],
   colors:[{n:"Naturel", hex:"#E6DFD2", img:"img/tote-naturel.jpg", stock:{"One size":12}}]},
  {id:"socks", name:"Rib Socks", cat:"Accessoires", price:12,
   desc:"Hoge sokken met een grove rib. Blijven zitten en steken net boven je sneaker uit.",
   details:["Katoen/elastaan","Grove rib, versterkte hiel","Per paar"],
   colors:[
     {n:"Oker", hex:"#D9A23A", img:"img/socks-oker.jpg", stock:{"39-42":4, "43-46":0}},
     {n:"Flessengroen", hex:"#1F3B30", img:"img/socks-groen.jpg", stock:{"39-42":2, "43-46":3}},
     {n:"Grijs", hex:"#A7A8AA", img:"img/socks-grijs.jpg", stock:{"39-42":0, "43-46":0}}]},
  {id:"shield", name:"Shield Shades", cat:"Accessoires", price:39, isNew:true,
   desc:"Wrap-around zonnebril met één doorlopend glas. Futuristisch, en UV400.",
   details:["UV400-glas","Lichtgewicht frame","Inclusief hoesje"],
   colors:[{n:"Zwart", hex:"#0E0F12", img:"img/shades-shield.jpg", stock:{"One size":3}}]},
  {id:"orbit", name:"Orbit Shades", cat:"Accessoires", price:29,
   desc:"Ronde zonnebril met metalen frame. Klein, rond en een beetje retro.",
   details:["UV400-glas","Metalen frame","Inclusief hoesje"],
   colors:[{n:"Zwart", hex:"#1B1C20", img:"img/shades-orbit.jpg", stock:{"One size":0}}]},
  {id:"signal", name:"Signal Gloves", cat:"Accessoires", price:25,
   desc:"Handschoenen met reflecterende lijn en touchscreen-vingertoppen.",
   details:["Softshell met fleece","Touchscreen-vingertoppen","Reflecterende details"],
   colors:[{n:"Zwart/volt", hex:"conic-gradient(#16171B 0 70%,#C8FF2E 0)", img:"img/gloves-signal.jpg", stock:{"S/M":3, "L/XL":1}}]},
  {id:"knit", name:"Knit Gloves", cat:"Accessoires", price:15,
   desc:"Gebreide handschoenen voor elke dag. Zacht, warm en ze passen in je zak.",
   details:["Acryl/wol","Geribde manchet","One size"],
   colors:[{n:"Grijs gemêleerd", hex:"#B7B1A7", img:"img/gloves-knit.jpg", stock:{"One size":6}}]},
  {id:"belt", name:"Utility Belt", cat:"Accessoires", price:29,
   desc:"Brede leren riem met dubbele gesp. Gaat jaren mee.",
   details:["Rundleer","Metalen gesp","4 cm breed"],
   colors:[{n:"Bruin", hex:"#6B4A33", img:"img/belt-bruin.jpg", stock:{"85":2, "95":0, "105":1}}]},
  {id:"scarf", name:"Cloud Scarf", cat:"Accessoires", price:25,
   desc:"Lange, dikke sjaal die je ook over je neus trekt als het echt koud is.",
   details:["Acryl/wol","180 x 30 cm","Grof gebreid"],
   colors:[{n:"Grijs gemêleerd", hex:"#9EA3A8", img:"img/scarf-grijs.jpg", stock:{"One size":4}}]},

  /* ---------- Sieraden ---------- */
  {id:"chain", name:"Cuban Chain", cat:"Sieraden", price:35, isNew:true,
   desc:"Platte schakelketting van roestvrij staal. Verkleurt niet, ook niet onder de douche.",
   details:["Roestvrij staal","5 mm schakel","Karabijnsluiting"],
   extra:["img/chain-look.jpg"],
   colors:[{n:"Zilver", hex:"#C9CCD1", img:"img/chain-zilver.jpg", stock:{"50 cm":3, "60 cm":0}}]},
  {id:"bracelet", name:"Link Bracelet", cat:"Sieraden", price:25,
   desc:"Zware schakelarmband met een strakke sluiting. Past bij de Cuban Chain.",
   details:["Roestvrij staal","8 mm schakel","21 cm"],
   colors:[{n:"Zilver", hex:"#C9CCD1", img:"img/bracelet-zilver.jpg", stock:{"One size":5}}]},
  {id:"gridring", name:"Grid Ring", cat:"Sieraden", price:22,
   desc:"Brede ring met een raster van gaatjes. Klein detail, grote impact.",
   details:["Roestvrij staal","8 mm breed","Maten 17, 19 en 21"],
   colors:[{n:"Zilver", hex:"#C9CCD1", img:"img/ring-grid.jpg", stock:{"17":0, "19":2, "21":1}}]},
  {id:"bandring", name:"Band Ring Set", cat:"Sieraden", price:29, was:35,
   desc:"Set van twee ringen: een gladde en een geborstelde. Samen of los te dragen.",
   details:["Roestvrij staal","2 ringen","Maten 17, 19 en 21"],
   colors:[{n:"Zilver", hex:"#C9CCD1", img:"img/ring-band.jpg", stock:{"17":1, "19":0, "21":0}}]}
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
  {img:"img/sling-look.jpg", title:"Hands free", products:["sling","core"]},
  {img:"img/vest-block.jpg", title:"Color block", products:["vest","denim"]},
  {img:"img/storm-navy.jpg", title:"Storm day", products:["storm","transit"]},
  {img:"img/chain-look.jpg", title:"Detail", products:["chain","bracelet","gridring"]}
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
    setTimeout(() => root.classList.add("is-ready"), 6000); /* vangnet als motion.js niet laadt */
  }
  if (!seen && !calm) {
    root.classList.add("intro-pending");
    setTimeout(() => root.classList.remove("intro-pending"), 6000); /* vangnet */
  } else if (!calm) {
    /* kwamen we binnen via een pagina-overgang? dan start de pagina bedekt door het paneel */
    let wipe = false;
    try { wipe = sessionStorage.getItem("outrun-wipe") === "1"; sessionStorage.removeItem("outrun-wipe"); } catch(e){}
    if (wipe) {
      root.classList.add("wipe-in");
      setTimeout(() => root.classList.remove("wipe-in"), 3000); /* vangnet */
    }
  }
})();
