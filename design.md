# Design System — Villa Barbarina Nature Resort

*Locked design system generated per Hallmark & UI/UX Pro Max standards.*

## 1. Provenance & Identity
- **Project**: Villa Barbarina Nature Resort (Alghero, Sardinia)
- **Macrostructure**: Atelier / Editorial Magazine
- **Genre**: Editorial (Luxury Mediterranean Nature Sanctuary)
- **Nav Archetype**: N1b (Elevated Editorial Nav with Language Switcher & Direct Booking Action)
- **Footer Archetype**: Ft5 (Statement Architectural Colophon)
- **Tone**: Quiet Luxury · Tactile · Earthy · Mediterranean Minimalist

---

## 2. Typography Rules (Hallmark Discipline)
- **Display Typeface**: `Cormorant Garamond` (Weights: 300 Light, 400 Regular, 500 Medium)
  - *Hard Rule*: All headings and display titles are upright / Roman (`font-style: normal`). No italic headers.
- **Body Typeface**: `Plus Jakarta Sans` (Weights: 400, 500, 600)
- **Technical & Coordinates Typeface**: `JetBrains Mono` / Monospace for labels, room dimensions, timestamps, coordinates.

---

## 3. Color Palette Tokens (OKLCH)
- **Paper Primary**: `oklch(98.2% 0.008 75)` (`#FAF7F2` — Mineral plaster)
- **Paper Subtle**: `oklch(94.8% 0.012 78)` (`#EFECE5` — Sun-warmed sand)
- **Ink Primary**: `oklch(18.5% 0.02 135)` (`#172017` — Deep vegetal pine)
- **Accent Terracotta**: `oklch(53% 0.13 42)` (`#A25336` — Terracotta stone)
- **Accent Ochre / Gold**: `oklch(72% 0.12 85)` (`#C6A24D` — Mediterranean ochre)
- **Border Hairline**: `oklch(88% 0.01 80)` (10% ink opacity)

---

## 4. Interaction & 8-State Standards
All interactive elements (buttons, inquiry form inputs, tabs, booking triggers) strictly implement:
1. `default`: Clean tactile border / solid mineral tone.
2. `hover`: Subtle scale / background shift with `var(--ease-out)`.
3. `:focus-visible`: 2px high-contrast outline (`var(--color-focus)`), zero delay.
4. `:active`: 1px translateY compression.
5. `disabled`: Opacity 40%, cursor not-allowed.
6. `loading`: Inline spinner + disabled state.
7. `error`: Explicit red outline + error message below input.
8. `success`: Inline green confirmation.

---

## 5. Exports

### tokens.css
See `/tokens.css` for root CSS custom properties.
