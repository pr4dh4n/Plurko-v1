# REDESIGN_NOTES.md

Running changelog for the Plurko visual &amp; motion redesign.
Append-only — new entries at the top.

---

## 2026-04-19 — Phase 2 · Home page redesign

### Shipped
- `v1/index_v2.html` — full home-page redesign. All v1 copy, IDs, and form fields preserved. v1 `index.html` untouched.

### Approach
- **Copy-first, override-second.** Did not rewrite from scratch. Copied v1 verbatim, swapped `:root` tokens to Phase 1 palette (keeping v1 aliases like `--purple`, `--bg`, `--border` so existing selectors keep resolving), then appended one large "PHASE 2" block at the end of the `<style>` scoped to `body.v2 …` that redesigns each section.
- **`body.v2` class** is the global scope hook — every Phase 2 selector is prefixed with `.v2` so v1 styles remain intact and only activate on this page.
- **Minimal markup edits** — only the sections that genuinely needed new structure got rewritten. Everything else inherits the new look via token swap + CSS override.

### Sections redesigned
| Section | Approach | Markup change? |
|---------|----------|----------------|
| Header | Paper + blur, scrolled state with hairline, CTA recoloured to `--brand-ink` fill-sweep | No |
| Menu overlay | Paper surface, Poppins links, brand hover | No |
| Mega-nav (L1→L2→L3) | Neutral rows, mono head labels, brand-tint hover, pill count-badges | No (JS-generated) |
| Hero carousel | **Asymmetric split** (45% copy / 55% image), vertical progress bars on the right, CTA over paper instead of dark scrim, eyebrow-style slide label. Two variants available via Tweaks: mask-reveal / zoom-fade. | No (layout driven by CSS) |
| How It Works | Big serif-scale numbered badges in `--brand`, connecting horizontal hairline animates in on scroll | No |
| Most Popular Offerings | Replaced v1's expand-panel accordion with 3 cards. Image overflows top edge by 24px. Arrow-link at bottom grows gap on hover. | **Yes** — markup rewritten `expand-panels` → `offering-cards` |
| Cine-banner | Ink surface, outline tags, gold eyebrow | No |
| Why PlurkoTech | Tabs moved to left column (280px rail) + panel on right showing image + text + mono tags. 5 tabs, 5 slides. | No (existing tab markup works) |
| Protocol ticker | Paper-2 surface, hairline top/bottom, faded icons brighten on hover | No |
| Blog | Paper cards with hairline, mono+dot tag, hover-scale image, lift on hover | No |
| Inquiry form | Paper-2 section wrap, form container lifted onto paper with `--r-xl`. Inputs use underline sweep via `.form-group::after` (no new span). Licensing label restyled as mono section header; license-cards pick up active state. | No markup changes; JS added to toggle `.active` on license-card click |
| Footer | Ink surface, gold hover for links | No |

### New UI — Tweaks panel
- Bottom-right ⚙ toggle. Panel exposes:
  - **Hero transition** — Mask-reveal (default) / Zoom-fade. Writes `data-hero-variant` on `<body>`, persisted via localStorage key `plurko-hero-variant`.
  - **Theme** — Light / Dark. Writes `data-theme` on `<html>`, reuses existing `plurko-theme` localStorage key.
- Tweaks panel is QA-only — will be removed in the final merge of v2 → canonical (tracked in Phase 5 TODOs).

### Motion
- All `.reveal` / `.reveal-stagger` hidden under `.js-ready .v2` — graceful fallback when JS disabled.
- Hero mask-reveal: `clip-path:inset(0 100% 0 0) → inset(0 0 0 0)` on active slide's image, 900ms `ease-out-expo`.
- Hero zoom-fade: `transform:scale(1.08) → scale(1)` + opacity 0.4→1, 1400ms.
- Both honour `prefers-reduced-motion` — `animation:none !important` on the slide image.
- Card hover: `translateY(-4px)` + `--shadow-hover`, no scale.
- CTA fill-sweep: `scaleX(0) → 1` from left, 300ms (v1 was ~150ms).
- How-It-Works hairline: `scaleX(0) → 1` from left, 1200ms ease-out-expo, triggered by `.line-revealed` class that v1 JS already sets on scroll.

### IDs / classes preserved
Audited before editing: 34 JS-referenced IDs and 25 critical class hooks. All still present after redesign, verified by grep. The two missing IDs (`cursorDot`, `marqueeTrack`) were already absent in v1 — their JS blocks have safe early-return guards.

### Trade-offs
- **Kept multi-step form structure.** Brief wanted "clearer section grouping via thin dividers + mono section labels" — the existing 3-step form already provides grouping, and the existing step-indicator labels ("1 — Project Scope" etc.) now render as mono labels via the new CSS. Adding additional in-step labels felt redundant; instead I restyled the existing `.licensing-label` as a thin-divider mono header inside Step 2. If user wants flattened-single-page form with 4 visible section labels, that's a separate revision.
- **Offerings went from accordion to static cards.** The v1 expand-panel hover-to-expand pattern was creative but hid content until hover. Cards show all three offerings equally, match the brief's "3 cards with image overflow", and eliminate a mobile-hostile pattern.
- **Did not reorder Why section layout.** The v1 tabbed showcase reads clearly once styled; swapping to a 5-card grid would erase the interactive tabs without a compelling reason. Kept tabs + 2-column panel layout instead.
- **v1 aliases preserved in :root.** Tokens like `--purple`, `--bg`, `--border` now alias to Phase 1 values via `var()`. Keeps v1 HTML/CSS rendering sensibly so my overrides only need to catch visual cases that changed — not every rule.

### Known limitations / not-yet-addressed
- **Hero intro `.hero-cta { scale: 0.8 → 1 }` in GSAP timeline** technically violates the "no scale" reveal rule. Leaving for Phase 4 motion pass — one-shot intro tween, landing state is correct.
- **Dark mode not end-to-end audited yet** — all tokens derive, but need browser-test pass with theme toggle on every section.
- **Responsive not walked** through 900 / 768 / 560 / 480. Most breakpoints set, but needs visual QA.
- **Image contrast pairing** — the chip-render PNGs against the new section surfaces haven't been empirically sampled. Current pairings use `--paper-3` card plates and neutral section bgs as safe defaults. Per-image refinement deferred to Phase 5.
- **Floating CTA + cursor-dot** — Phase 4 additions, not Phase 2.

### Files touched
- `v1/index_v2.html` (created, all changes inside)
- `v1/index.html` — untouched
- No new dependencies, no new fonts, no new images.

---

## 2026-04-19 — Phase 1 · Visual system foundation

### Shipped
- `v1/_system.html` — canonical design-system reference. Not linked from the live site.

### Sections in `_system.html`
1. Tokens — light + dark swatches side-by-side, radii (4/6/8/16), shadow samples, motion tokens
2. Typography — Hero H1, Section H2, Page H1, Card H3, Eyebrow, Body, Body SM, Tech label, CTA — each using real copy pulled from `index.html`
3. Buttons — Primary (fill-sweep), Secondary (outline), Tertiary (gap-grow arrow), Ghost
4. Forms — all 11 inquiry-form fields with floating-label + focus-glow + licensing card selector (replaces the toggle)
5. Cards — Offering (image overflows top edge), Why (numbered 01–05), Blog (16/10 image, mono+dot tag), Step (4-across with connecting hairline), Product (catalog tile)
6. Tags &amp; Chips — neutral / dot / brand-soft / ink-fill / outline
7. Motion — 6 replay-able demos (reveal, stagger, CTA sweep, card lift, arrow gap, input focus)

### Palette — retuned from v1 (kept brand system, deepened contrast)
| Token | v1 | Phase 1 | Role |
|-------|----|---------|------|
| `--ink` | `#222222` | `#161518` | Text / dark surfaces |
| `--paper` | `#FFFFFF` | `#FAF7F5` | Page bg (warmer) |
| `--paper-2` | `#F7F5F2` | `#F2EEE9` | Alt surface |
| `--brand` | `#744897` | `#5B3B82` | Deeper purple, AA on paper |
| `--brand-ink` | `#4E3166` | `#2C1A47` | CTA fill rest-state |
| `--brand-soft` | — | `#EFE6F7` | Badge / subtle surface (new token) |
| `--gold` | `#FFD166` | `#D9A84A` | Less candy, more bronze |
| `--gold-d` | `#E8B84B` | `#B88A30` | Gold hover |

Dark-mode tokens re-derived — brand lifts to `#A78BC9` for AA on `#121116`; paper becomes warm near-black `#121116`.

### Design rules locked in Phase 1
- Radii: **4 / 6 / 8 / 16** — no other values.
- Shadows: **none at rest**, hover-only, soft purple-tinted (`--shadow-hover`).
- Borders: 1px hairlines in `--line` as the primary separator; avoid drop-shadows for separation.
- Reveal: opacity 0→1 + translateY 24px→0. **No scale, no blur.** 700ms `ease-out-expo`.
- Hover: card `translateY(-4px)` + shadow. **Never `scale()` on cards.** 250ms `ease-smooth`.
- CTA fill sweep: `scaleX 0→1` from left, **300ms** (slowed from v1), fill colour `--brand` over `--brand-ink` rest.
- Arrow link: gap grows 8px → 14px on hover.
- Category chips: **collapsed from 4-colour rainbow** (v1) to a single neutral chip with optional ink-coloured dot for category differentiation.
- `prefers-reduced-motion` respected — replaces scroll reveals with opacity-only fades; replay demos skip straight to end state.

### Frozen — not touched
- Fonts (Poppins / Raleway / JetBrains Mono), Google Fonts import URL, weights.
- All copy on every page.
- Architecture (inline CSS + JS, GSAP vendored, no bundler).
- Footer structure per `DESIGN_CURRENT.md §4`.
- Form fields — all 11 IDs + labels + options preserved.
- Theme system (`data-theme` attr on `<html>`, `localStorage` key `plurko-theme`).

### Trade-offs &amp; decisions
- **Chose card image overflow (offering card) over bordered-frame approach.** Image overflows top edge by 20px with its own hairline border, so the card defines its boundary even when bg tones collide with baked image tones. Alternative (a full hairline around image flush inside card) felt more conservative — can revisit in Phase 2 if specific images fight.
- **Licensing control rendered as two selector cards, not a sliding toggle.** v1's toggle hid the black/white-box descriptions; cards expose both side-by-side. IDs/values preserved (`licensing` radio, `White Box` / `Black Box`) so the submit handler is unaffected.
- **Aliased v1 token names** (`--purple`, `--purple-d`, `--bg`, `--bg-alt`, `--border`) to the new tokens so the v1 JS/CSS that references them by string keeps working in intermediate states during Phase 2+.
- **Page-level H1 vs Hero H1.** Kept two display scales — Hero H1 (home, 2.4→4.5rem) is larger than Page H1 used on Solutions/Contact (2→3.2rem). Matches v1's implicit hierarchy.

### Open questions (for Phase 2)
- Hero transition — spec calls for two variants surfaced via Tweaks (mask-reveal vs crossfade-with-zoom). Need to confirm whether Tweaks panel should be an in-page overlay or a URL param (`?hero=mask`).
- Image dark-mode handling — three chip-renders (hero-slide-1, why-silicon-proven, why-future-tech) have light baked backgrounds. Plan: wrap in a warm-light panel (“own little stage”) inside dark sections. Will verify per-image in Phase 2.
- Whether to promote `--gold` to replace the brand-ink CTA fill anywhere. Current rule: gold is rare accent only. Revisit if a page feels under-warmed.

### TODO (deferred to Phase 2)
- Home hero asymmetric split (image 55%, copy 45%).
- How-It-Works: connecting horizontal hairline behind step numbers (pattern defined in `_system.html`, apply to live page).
- Offering card image overflow behaviour in the real section (currently only in style guide).
- Why-section: decide 3×2-with-empty vs 2-then-3 layout.
- Form section-grouping with mono section labels (pattern defined, apply to live page).
- Mega-nav 3-column visual redesign.
- Tweaks panel for hero variants.

---
