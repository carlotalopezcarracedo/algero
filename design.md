# Design System — Villa Barbarina / Sardinian Editorial Escape

## Art direction

Villa Barbarina is presented as an inhabited landscape rather than a catalogue of hotel features. The interface uses oversized editorial typography, photographic planes, controlled overlaps and large changes of scale. Its visual sequence moves through mineral daylight, deep vegetation, night charcoal and the warm colour of the table.

The homepage is intentionally composed as scenes:

1. **Arrival** — layered property photography and the split BARBARINA word plane.
2. **First breath** — a quiet magazine opening with one human-scale pool detail.
3. **Estate coordinates** — real facts arranged as a typographic rail.
4. **Landscape** — a deep-olive photographic chapter.
5. **Rooms** — a desktop sticky journey and mobile photographic chapters.
6. **Interruption** — one aerial image without promotional copy.
7. **Table** — a wine-coloured food feature with displaced imagery.
8. **Sardinia** — a typographic destination index with a changing photograph.
9. **Arrival at night** — the direct-booking close.

## Typography

- **Display**: `Bodoni Moda`, including its restrained italic. It carries large compositional words and editorial headlines.
- **Body**: `Manrope`, used for readable copy and controls.
- **Technical register**: `IBM Plex Mono`, limited to coordinates, numbering, facts and chapter labels.

Headlines may cross image boundaries but remain semantic HTML headings. Italian line breaks drive every composition; mobile is recomposed rather than mechanically stacked.

## Colour and material

- Mineral canvas: `#f3efe5`
- Linen paper: `#fbf8ef`
- Sun-warmed field: `#e8d7b8`
- Vegetation: `#1d2a20`
- Night charcoal: `#141713`
- Restaurant wine: `#5a2c27`
- Plaster clay: `#a9482f`

The only texture is an extremely low-opacity grain. Colour changes create chapters; cards, rounded containers, decorative gradients and fake luxury effects are excluded.

## Interaction

- The room journey changes image, title and facts as the visitor crosses four scroll chapters on desktop; mobile receives four independent, usable room stories.
- The destination index swaps its image on hover, focus and click; mobile displays complete destination chapters.
- Route and hero images use short mask reveals. Selected large photographs use no more than 24px of parallax travel.
- UI transitions use the editorial ease `cubic-bezier(0.23, 1, 0.32, 1)` and avoid spring or bounce motion.
- `prefers-reduced-motion` removes parallax and collapses timing without hiding information.

## Function and accessibility

- Octorate remains the single direct-booking endpoint.
- The official contact endpoint, child-age fields, date validation, WhatsApp and Smartness marketplace remain functional.
- Desktop and mobile navigation are keyboard accessible; Escape closes the full-screen menu and gallery.
- The gallery is a semantic modal dialog and focus begins on its close control.
- Visible controls use at least 44px touch targets, visible focus states and WCAG-oriented contrast.
- All pages preserve one H1, meaningful landmarks, real alternative text and the original legal identifiers.

## Durable sources

- Visual implementation: `src/App.tsx`, `src/styles.css`, `tokens.css`
- Verified business content: `src/data.ts`, `PRODUCT.md`
- Original property photography: `public/images/villa/`
- GitHub Pages route preparation: `scripts/prepare-pages.mjs`
