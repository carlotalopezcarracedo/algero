# Villa Barbarina — Modern Mediterranean Hospitality

## Design principle

Villa Barbarina is presented as a calm, premium and highly usable resort experience. Visual identity comes from real photography, proportion, typography, warm natural colour and precise motion. Every element belongs to a clear section or interaction; decorative overlaps, oversized display words and disconnected compositions are excluded.

## User journey

The homepage follows one readable sequence:

1. **Discover** — one property photograph, a concise promise and direct actions.
2. **Understand** — introduction, location context and verified property facts.
3. **Feel** — one balanced resort composition with two complementary photographs.
4. **Stay** — a single interactive room explorer on desktop and complete room stories on mobile.
5. **Experience** — a quiet visual pause and the restaurant.
6. **Explore** — a destination explorer and useful location information.
7. **Book** — a photographic direct-booking close and a functional footer.

## Grid and spacing

- Maximum content width: `1380px`.
- Horizontal padding: `clamp(24px, 5vw, 80px)`.
- Internal desktop layouts use a consistent twelve-column grid.
- Section spacing: `clamp(96px, 10vw, 144px)`.
- Asymmetry stays within balanced 60/40 or 55/45 relationships.
- Text and photography remain separate except for the hero and final booking scene, where local overlays guarantee contrast.

## Typography

- **Display:** Cormorant Garamond, weights 500–600.
- **Interface and body:** Manrope, weights 400–700.
- Hero and page H1: large enough to establish hierarchy, never decorative or outside the viewport.
- Section H2: approximately 44–77px on desktop and 38–52px on mobile.
- Body: 16–18px with generous line height.
- Practical labels: Manrope uppercase at 11–12px.

Only these two typefaces are loaded.

## Colour

- Warm ivory canvas: `#f5f1e8`.
- Soft sand: `#ebe4d7`.
- Paper: `#fcfaf5`.
- Warm charcoal: `#252820`.
- Muted sage: `#68735f`.
- Deep vegetal green: `#263a2e`.
- Restrained terracotta booking accent: `#ad5b3f`.

The experience remains predominantly light. Deep green is reserved for location utility, footer and mobile booking; photography supplies most chromatic variation.

## Interaction system

- Fast: 220ms.
- Normal: 380–420ms.
- Slow image reveal: 850ms.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Header changes from transparent to warm ivory after 80px.
- Images share one inset-and-scale viewport reveal.
- Room and destination changes use crossfade and a subtle mask or 10px translation.
- Links and buttons move their arrow by 5px.
- Mobile navigation uses a calm opacity/10px stagger.
- Reduced motion removes mask, scale and scroll transforms.

## Components

- Three button styles only: primary, secondary outline and text link.
- Controls use a 6px radius; photography uses a 2px radius.
- Room detail pages separate their title and commercial information from the room image.
- The gallery is a keyboard-accessible modal; Escape closes it and focus begins on the close control.
- The mobile menu makes background page content inert while open.
- The mobile dock keeps phone, WhatsApp and the real booking action accessible.

## Function and content integrity

- Octorate remains the direct-booking destination.
- The official contact endpoint and native date validation remain intact.
- Child age fields respond to the selected number of children.
- WhatsApp, Smartness, map, English site and legal identifiers remain real.
- All routes preserve one H1, semantic landmarks, useful alternative text and visible keyboard focus.

## Durable sources

- Components and route composition: `src/App.tsx`
- Responsive visual system: `src/styles.css`
- Tokens: `tokens.css`
- Verified content and integrations: `src/data.ts`, `PRODUCT.md`
- Real photography: `public/images/villa/`
