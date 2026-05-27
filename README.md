# Portfolio

Personal portfolio site, built incrementally from the Figma source of truth.
React + TypeScript + Vite.

## Getting started

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
npm run lint     # lint the project
```

## Project structure

```
src/
├── styles/                     # Global styles and design tokens
│   ├── tokens.css              # Colors, fonts, spacing — the single source of truth
│   ├── typography.css          # H1..H4, Body 1..3, Button text
│   ├── reset.css               # Minimal modern reset / base
│   └── global.css              # Imports the three above (in the right order)
│
├── components/
│   └── layout/
│       ├── Container.tsx       # Responsive max-width container
│       └── Container.module.css
│
├── pages/
│   ├── StyleGuide.tsx          # Visual reference for tokens & typography
│   └── StyleGuide.module.css
│
├── assets/                     # Images, SVGs, etc.
├── App.tsx                     # Renders the current page
├── main.tsx                    # React entry point
└── index.css                   # Thin entry that imports styles/global.css
```

## Design system

The whole design system is driven by CSS custom properties in
`src/styles/tokens.css`. Change a value there and it propagates everywhere.

### Colors

| Token                       | Value     |
| --------------------------- | --------- |
| `--color-black-primary`     | `#1A1A1A` |
| `--color-black-secondary`   | `#555555` |
| `--color-white-primary`     | `#FFFFFF` |
| `--color-white-secondary`   | `#F2F2F2` |
| `--color-stroke`            | `#DFDFDF` |
| `--color-blue`              | `#0054F3` |
| `--color-dot`               | `#CFCFCF` |

Semantic aliases (`--color-text`, `--color-bg`, `--color-border`,
`--color-accent`, …) point at the raw values above so we can re-theme later
without touching every component.

### Background pattern

The whole page sits on a subtle dotted grid — `--color-dot` (#CFCFCF) dots
at `--dot-gap` (14px) spacing. It's a pure CSS `radial-gradient` applied to
the body, so it costs nothing and scales infinitely. Tune `--dot-size`,
`--dot-gap`, or `--color-dot` in `tokens.css` to re-tune it.

### Typography

Geist Mono is used for headings and buttons. Instrument Sans is used for body
copy. Caveat is used for handwritten accents. All three are loaded from Google
Fonts in `index.html`.

| Style       | Font / Weight                  | Size / Line height | Tracking |
| ----------- | ------------------------------ | ------------------ | -------- |
| Heading 1   | Geist Mono Medium              | 64 / 74            | +1%      |
| Heading 2   | Geist Mono Medium              | 54 / 64            | +1%      |
| Heading 3   | Geist Mono Regular             | 24 / 32            | +1%      |
| Heading 4   | Geist Mono Regular             | 20 / 30            | +1%      |
| Body 1      | Instrument Sans Regular        | 18 / 24            | —        |
| Body 2      | Instrument Sans Regular        | 16 / 22            | —        |
| Body 3      | Instrument Sans Regular        | 14 / 22            | —        |
| Button      | Geist Mono Medium              | 18 / 24            | —        |
| Handwritten | Caveat Bold                    | 26 / 32            | —        |

Apply them either as semantic tags (`<h1>`, `<p>`) or as utility classes
(`className="h1"`, `className="body-2"`, `className="button-text"`).

### Layout

Page max-width is **1440px**. On a 1440px screen the side gutter is **100px**
(so the content area is 1240px). Below that, the gutter scales fluidly via
`clamp(20px, 6.94vw, 100px)` down to a 20px minimum on mobile.

Use the `<Container>` component for anything that should respect the page
gutters:

```tsx
import { Container } from './components/layout/Container'

<Container>
  <h1>Hello</h1>
</Container>
```

## Adding the next section

1. Create a new component under `src/components/<feature>/` (with its own
   `.module.css` for component-local styles).
2. Or create a new page under `src/pages/` if it's a full-page surface.
3. Always reference design tokens (`var(--color-…)`, `var(--space-…)`) rather
   than hard-coding values.
4. Wrap top-level page content in `<Container>` so it respects the layout
   gutters.
