# Huisstijl

Alle kleuren, letters en bouwblokken staan in [css/huisstijl.css](css/huisstijl.css).
Laad dat bestand als **laatste** stylesheet in de `<head>` van elke pagina:

```html
<link rel="stylesheet" href="/css/huisstijl.css" />
```

Wil je iets overal aanpassen (bijvoorbeeld de groene kleur of de ronde hoeken)? Verander dan alleen de waarden bovenaan dat bestand.

## Kleuren

| Naam | Waarde | Waarvoor |
| --- | --- | --- |
| `--hs-groen` | `#046553` | Merkkleur, navbar |
| `--hs-groen-knop` | `#156c46` | Knoppen |
| `--hs-accent` | `#3fbf8f` | Labels, bolletjes, hover |
| `--hs-tekst-zacht` | wit 70% | Lopende tekst |
| `--hs-tekst-stil` | wit 45% | Bijzaken (datums, pijltjes) |
| `--hs-rand` | wit 8% | Dunne randen en lijnen |

Achtergrond is donker (Bootstrap dark). Letter is Inter.

## Vormen

- Kaarten: hoeken van 20px (`--hs-radius`)
- Video's, invoervelden: 12px (`--hs-radius-klein`)
- Knoppen: helemaal rond (pil)

## Bouwblokken

### Sectiekop
Klein groen label, grote titel, eventueel een korte zin eronder.

```html
<div class="hs-head">
  <p class="hs-eyebrow">Diensten</p>
  <h2 class="hs-title">Video op maat voor uw woning of evenement</h2>
  <p class="hs-lead">Optionele korte zin.</p>
</div>
```

Gebruik `hs-head hs-head--links` om de kop links uit te lijnen (subpagina's).

### Kaart

```html
<article class="hs-card hs-card--hover h-100">
  <h3 class="hs-card-title">Vastgoed</h3>
  <p class="hs-text">Korte uitleg.</p>
  <ul class="hs-list">
    <li>Punt een</li>
    <li>Punt twee</li>
  </ul>
  <div class="hs-actions">
    <a class="btn btn-primary" href="contact.html">Offerte aanvragen</a>
    <a class="hs-link" href="portfolio.html">Bekijk voorbeelden <span aria-hidden="true">&rarr;</span></a>
  </div>
</article>
```

- `hs-card--hover`: kaart komt iets omhoog als je eroverheen gaat.
- Een hele kaart als link: `<a class="hs-card" href="...">`.
- Afbeelding of animatie bovenaan: `<div class="hs-visual">...</div>`.
- Kaarten onder elkaar: zet ze in `<div class="hs-stack">`.
- **Geen nummers** (01, 02 of "1.") bij kaarten of titels.

### Knoppen en links
- Hoofdactie: `btn btn-primary` (één per kaart).
- Tweede actie: `hs-link` met pijltje, geen tweede knop.
- Terug naar overzicht: `<a class="hs-back" href="/portfolio.html"><span aria-hidden="true">&larr;</span> Portfolio</a>`

### Video
`<iframe class="video-embed" style="aspect-ratio: 16 / 9;" ...>`

### Formulier
Zet `hs-form` op het formulier en gebruik altijd een `<label class="form-label">` boven elk veld.

### Lopende tekst
Projectpagina's: zet de tekst in `<div class="hs-prose">` met `<h2>` per onderdeel.

## Standaard pagina-opbouw

```html
<header><script src="/javascript/navbar.js"></script></header>
<main class="container hs-section">
  ...sectiekop en kaarten...
</main>
<footer><script src="/javascript/footer.js"></script></footer>
```
