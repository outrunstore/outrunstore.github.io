# OUTRUN – Streetwear webshop (concept)

Conceptwebsite voor **OUTRUN**, een eigen streetwear-label dat kleding verkoopt. Klanten bestellen direct op de site: winkelmand, afrekenen en een bevestiging per mail. De site toont voorraad per kleur en maat, beantwoordt vragen met een chatbot en neemt aanvragen aan met foto's. Alles draait zonder backend, framework of build-stap.

> Dit is een conceptproject. De productfoto's zijn stockfoto's van [Unsplash](https://unsplash.com) en tonen niet de echte OUTRUN-producten.

![Homepage](docs/desktop.png)

## Pagina's

| Pagina | Wat staat erop |
| --- | --- |
| `index.html` | Hero, categorieën, nieuwe items, "Binnenkort"-banner, laatste stuks |
| `shop.html` | Alle producten met filters op categorie, maat, "Nieuw" en "Sale", zoeken, sorteren en "alleen op voorraad". De filters staan in de URL, dus je kunt een gefilterde pagina delen. |
| `product.html?id=…` | Fotogalerij per kleur, kleur- en maatkeuze, uitverkochte maten doorgestreept, voorraadmelding, "In winkelmand", gerelateerde items |
| `afrekenen.html` | Gegevens, verzenden of ophalen, overzicht met verzendkosten, bestelling plaatsen en bedankpagina met bestelnummer |
| `lookbook.html` | Looks met links naar de producten die erin zitten |
| `maten.html` | Maattabellen voor tops, broeken en sneakers, plus een maatcalculator op basis van lengte |
| `aanvragen.html` | Aanvraagformulier met foto-upload |
| `info.html` | FAQ over bestellen, betalen, verzenden, voorraad en ruilen |
| `over.html` | Over het merk |

## Features

- **Bestellen via de site**: winkelmand in een uitschuiflade (bewaard in de browser, aantallen begrensd door de voorraad), balk tot gratis verzending en een afrekenpagina. De bestelling gaat via [FormSubmit](https://formsubmit.co) naar de mail van de winkel, en de klant krijgt automatisch een bevestiging. Betalen gaat met een iDEAL-betaalverzoek.
- **Animaties**: startanimatie bij het eerste bezoek, woorden die in beeld schuiven, fade-ins en foto-reveals bij het scrollen, subtiele parallax, een header die wegschuift bij omlaag scrollen, een scrollbalk en zachte overgangen tussen pagina's
- **Eigen cursor** (alleen met muis): volgt de muis vloeiend, wordt groter boven knoppen en toont "Bekijk" boven producten. Knoppen trekken licht naar de cursor toe.
- **Voorraad per kleur en maat**: labels voor "Uitverkocht", "Bijna op", "Nieuw", "Binnenkort" en sale-percentages worden automatisch berekend uit de productdata
- **Chatbot** (regelgebaseerd, geen externe API) die intenties herkent (maat, voorraad, prijs, verzending, ophalen, betalen, bestellen, aanvragen). Hij geeft maatadvies op basis van lengte, weet wat er per maat en kleur nog op voorraad is en kent op een productpagina het product dat je bekijkt.
- **Aanvraagformulier** met foto-upload (max. 3, voorbeelden en validatie van de bestandsgrootte), verstuurd via FormSubmit naar e-mail
- **Responsive** van telefoon tot desktop, met **light en dark mode** (volgt het systeem, met een knop om te wisselen)
- **Toegankelijk**: toetsenbordfocus, `aria`-labels, Escape sluit de chat en de winkelmand. Met `prefers-reduced-motion` staan alle animaties en de eigen cursor uit.

| Collectie | Productpagina met chatbot | Mobiel |
| --- | --- | --- |
| ![Shop](docs/shop.png) | ![Chatbot](docs/chat.png) | ![Mobiel](docs/mobile.png) |

## Techniek

- HTML, CSS en vanilla JavaScript, zonder dependencies
- `assets/data.js`: instellingen, producten en lookbook
- `assets/site.js`: header, footer, winkelmand, productkaarten en voorraadlogica, gedeeld door alle pagina's
- `assets/motion.js`: startanimatie, scroll-animaties, cursor en pagina-overgangen
- `assets/chatbot.js`: de chatbot
- `assets/style.css`: alle styling
- Hosting getest op GitHub Pages

## Lokaal bekijken

Start een simpele webserver in de map, bijvoorbeeld `python -m http.server`, en open `http://localhost:8000`.

## Aanpassen

Alles staat in `assets/data.js`:

- `CONFIG`: e-mailadres waar bestellingen en aanvragen binnenkomen, verzendkosten, gratis verzending vanaf, ophaalplaats, naam van de drop, Snapchat (voor contact), vanaf hoeveel stuks "Bijna op" verschijnt
- `PRODUCTS`: per product een naam, categorie, prijs, optioneel `was` (oude prijs), `isNew` of `soon`, en per kleur een foto en de voorraad per maat. Zet een maat op `0` en die is uitverkocht.
- `LOOKS`: de foto's in het lookbook en welke producten erbij horen

> **Let op:** FormSubmit vraagt bij de eerste bestelling om het e-mailadres te activeren via een link in je mail. De voorraad in `data.js` wordt niet automatisch bijgewerkt na een bestelling. Pas die zelf aan.

---

Gemaakt door Omar Moussaten.
