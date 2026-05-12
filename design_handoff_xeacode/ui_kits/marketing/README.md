# XeaCode marketing site — UI kit

Pixel-faithful recreation of the XeaCode single-page-scroll site as a click-through HTML prototype. Built from the source code at [`GagiuFilip1/XeaCode`](https://github.com/GagiuFilip1/XeaCode) — every section, hover state, and copy fragment is lifted from the codebase, not redrawn from a screenshot.

## What's here

- `index.html` — the full marketing site, all eight sections (Header → Hero → Services → Process → Work → Stack → Team → FAQ → Contact → Footer), clickable nav, theme toggle, working contact form (mock), magnetic CTAs, scroll-reveal stagger.
- `components.jsx` — React leaf components (`Header`, `Hero`, `ServiceCard`, `ProcessStep`, `WorkRow`, `Marquee`, `FaqRow`, `Field`, `Footer`, `Paw`, icon set).
- `app.jsx` — composes the page.

## Run

Open `index.html` directly — no build. React 18 + Babel standalone via CDN.

## Component coverage

| Component | Notes |
|---|---|
| `Header` | Sticky, transparent at top, glass-blur on scroll. 7-item nav. Theme toggle. |
| `Hero` | Asymmetric grid (58% / 1fr). Eyebrow + display headline + lead + trust strip + 2 CTAs. Three drifting gradient blobs + dot-grid + paw easter egg. |
| `ServiceCard` | 2×2 grid. Icon badge in `accent-soft`, h3, body, mono engagement footer. Hover: lift + shadow. |
| `ProcessStep` | Numbered (`01 / 04`), deliverable mono label, display title, body. |
| `WorkRow` | Hairline-separated rows, large display title, stack tags, mono meta, italic outcome. |
| `Marquee` | Twin counter-scrolling rows of stack tiles, masked edges. |
| `Principle` | Mono accent label + body in hairline group. |
| `FaqRow` | `<dt>`/`<dd>` always-visible Q/A pairs. |
| `Field` | Form input with mono label, focus, error states. |
| `Footer` | 3-col + bottom row + centered easter-egg line with paw mark. |

## Deliberate omissions

- No image carousels — XeaCode never uses photography.
- No testimonials — every client list is under NDA.
- No pricing card — bands are quoted in the FAQ copy only.

## Iteration notes

Adjust the typography scale or accent intensity in `colors_and_type.css` at the project root — every component here reads from those CSS variables.
