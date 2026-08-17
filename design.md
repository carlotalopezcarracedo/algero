# Design System — Villa Barbarina Nature Resort

*Locked application-wide visual system. Future work should extend this world, not reinterpret it.*

## 1. Identity and structure

- **Project**: Villa Barbarina Nature Resort, Alghero.
- **Genre**: editorial hospitality.
- **Macrostructure**: Photographic Chapters — full-bleed real photography alternates with quiet editorial spreads, ledgers and field notes.
- **Navigation**: transparent masthead over photography, with language switcher and a permanent terracotta direct-booking action.
- **Footer**: Ft5 architectural statement and factual colophon.
- **Tone**: quiet, tactile, earthy, Mediterranean and precise.

The homepage opens on a single aerial field image with a staggered three-line statement and factual estate rail. Interior pages share the same type, palette, rules and controls but change composition by subject: an asymmetric estate sequence for the resort, a viewport-scale room index, a dense kitchen spread, field-note rows for itineraries and a direct utility layout for contact.

## 2. Typography

- **Display**: `Cormorant Garamond`, weights 300–500. Headings are always upright; never italic.
- **Body and controls**: `Instrument Sans`, weights 400–700.
- **Technical register**: `JetBrains Mono`, limited to coordinates, labels, indexes and factual metadata.
- Headlines may balance across lines, but words should only break as a last-resort overflow safeguard.
- Prose uses a 48–68ch measure and body text never drops below 16px.

## 3. Colour

- **Mineral paper**: `oklch(98.2% 0.008 75)`.
- **Sun-warmed paper**: `oklch(94.8% 0.012 78)`.
- **Vegetal ink**: `oklch(18.5% 0.02 135)`.
- **Pine chapter**: `oklch(24% 0.032 138)`.
- **Terracotta action**: `oklch(53% 0.13 42)`.
- **Ochre detail**: `oklch(72% 0.12 85)`.

Use terracotta for booking and directional emphasis, not decoration. Dark sections always switch to the dedicated on-dark ink token. All neutrals carry a warm or vegetal chroma; pure black and white are excluded.

## 4. Layout and imagery

- Base spacing follows the 4px scale in `tokens.css`; outer gutters are fluid.
- Structure is expressed with full-bleed fields, asymmetric image crops, hairline rules and deliberate open space, not rounded cards.
- Photography must be real Villa Barbarina or destination imagery recovered from approved source material. Do not introduce stock luxury imagery, gradients or abstract filler.
- Room lists are editorial indexes, itineraries are field-note rows and facts are presented as ledgers rather than feature-card grids.
- Mobile collapses to one reading column, preserves 44px targets and never permits horizontal scrolling.

## 5. Interaction and motion

- Focus rings appear immediately and remain visibly distinct on light and dark surfaces.
- Hover is only enabled for precise pointers; active controls use a restrained `scale(0.97)` response.
- Inputs keep constant 1px borders across states, use native validation and preserve visible labels.
- Motion is limited to the rare opening reveal, directional arrow feedback and the mobile navigation reveal. UI transitions remain below 300ms; `prefers-reduced-motion` keeps only gentle state changes.
- Booking always opens the official Octorate flow. Contact submissions retain the official endpoint and open its confirmation in a separate tab.

## 6. Durable assets

- Semantic design tokens: `/tokens.css`.
- Application styles and responsive rules: `/src/styles.css`.
- Route content, URLs and room facts: `/src/data.ts`.
- Approved photography: `/public/images/villa/`.
- Product truth and non-invention constraints: `/PRODUCT.md`.
