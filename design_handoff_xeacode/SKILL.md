---
name: xeacode-design
description: Use this skill to generate well-branded interfaces and assets for XeaCode — a senior independent software studio that ships bespoke web, mobile, and .NET API products — either for production or for throwaway prototypes, mocks, slides, and pitch material. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

# XeaCode design skill

Read `README.md` in this skill folder first — it covers brand voice, content fundamentals, visual foundations, and iconography. Then explore the other files:

- `colors_and_type.css` — drop-in CSS variables (color, type, spacing, radius, shadow, easing). Dark by default; add `class="light"` to `<html>` to flip.
- `assets/` — wordmark, monogram, and any product imagery.
- `preview/` — small reference cards illustrating each design-system token in isolation.
- `ui_kits/marketing/` — pixel-faithful React + Babel recreation of the XeaCode portfolio site, with reusable components (`Header`, `Hero`, `ServiceCard`, `ProcessStep`, `WorkRow`, `Marquee`, `Field`, `Footer`).

## How to apply this skill

If creating visual artifacts (slides, mocks, throwaway prototypes, marketing pages), copy the assets and CSS variables out and produce static HTML files for the user to view. Lift component patterns from `ui_kits/marketing/app.jsx` rather than re-deriving them.

If working on production code, read the rules in `README.md` and use the tokens in `colors_and_type.css` as the source of truth.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask focused questions about scope and audience, and then act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Non-negotiables

- One accent color only (desaturated emerald). No gradients in UI; gradients only in the hero backdrop ambience.
- Type is Geist Sans (display & body) + Geist Mono (eyebrows, labels, meta). Never substitute for Inter or system stacks if you can avoid it.
- Hairline row groups are strongly preferred over heavy card chrome for lists.
- No emoji. No drawn-from-scratch SVG icons — use the Phosphor-style stroke set already in the kit, or copy from a CDN match and flag it.
- Copy is plain, slightly formal, sentence-case. No exclamation marks. No "we're excited to" / "supercharge" / "delight".
