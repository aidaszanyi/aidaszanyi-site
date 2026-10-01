# aidaszanyi-site

## Cikkoldalak

A cikkek címeit, kártyaszövegeit és kategóriáit kizárólag a
`data/irasok.json` fájlban szerkeszd. Módosítás után futtasd az `npm run build`
parancsot: ez frissíti a kártyák közös adatfájlját, valamint az érintett cikk
`<title>` és `<h1>` elemét. A generált `js/irasok-adatok.js` fájlt ne szerkeszd
közvetlenül. Az `npm run check` írás nélkül ellenőrzi, hogy minden naprakész-e.

A teljes cikkoldalak közös stíluslapja: `css/cikk.css`. Új cikkben a
`<link rel="stylesheet" href="../css/cikk.css">` hivatkozást használd,
ne másold a CSS-t a HTML-be.

- `article-highlight`: kiemelt bekezdés sötét háttérrel.
- `article-question`: záró kiemelés alsó margó nélkül.
- `article-highlight-roomy`: az `article-highlight` mellé adható, tágasabb belső térközzel.
- `article-title-compact`: kisebb főcím hosszabb címekhez.
- `quote-block`: több bekezdésből álló idézetblokk.

Az `irasok/index.html` listázóoldal külön stíluslapokat használ.
Az `irasok/amikor-a-csendben-osszeall.html` egy befejezetlen HTML-részlet,
nem teljes cikkoldal.
