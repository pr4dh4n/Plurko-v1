# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Codex will review the after every generation.

## Project Overview

PlurkoTech (Plurko Technologies) — a static marketing website for a semiconductor IP marketplace offering 302+ silicon-proven IP cores. The site showcases IP products (USB, PCIe, DDR, etc.) from verified global vendors.

## Architecture

This is a **no-build, no-framework static site**. There is no bundler, package manager, or build step.

- **All CSS and JS are inlined** within monolithic HTML files (~3000 lines each). There are no external CSS files or app JS files — styles live in `<style>` blocks and scripts in `<script>` blocks at the bottom of each HTML file.
- **Pages**: `index.html` (homepage), `product-pcie-gen5.html` (product detail page). New product pages follow the same self-contained pattern.
- **Animations**: GSAP + ScrollTrigger (vendored in `assets/js/`). Both are minified vendor files — do not modify them.
- **Fonts**: Google Fonts loaded via CDN — Poppins (headings), Raleway (body), JetBrains Mono (technical/mono text).
- **Theme system**: Light/dark mode via `data-theme` attribute on `<html>`. CSS custom properties in `:root` switch values under `[data-theme="dark"]` and `[data-theme="light"]` selectors. Theme persists via `localStorage` key `plurko-theme`.

## Key Patterns

- **CSS variables**: All colors, borders, and easing functions are defined as CSS custom properties in `:root`. Use these variables — don't hardcode colors. Primary brand color is `--purple` (#744897), accent gold is `--gold` (#FFD166).
- **Dark mode**: When adding new components, you must add corresponding `[data-theme="dark"]` CSS overrides. The light theme is the default.
- **Sections**: Each page section has a class like `.hero`, `.problem-section`, `.steps-section`, `.products-section`, etc. Sections are separated by `.section-divider` elements.
- **Reveal animations**: Elements with class `reveal` are animated on scroll via GSAP ScrollTrigger.
- **Search**: Header has a live search (`Ctrl+K` or type-ahead) that filters an inline IP core catalog defined in JS. There's also a floating search popup for typing anywhere on the page.
- **Smooth scrolling**: Custom GSAP-based smooth scroll on non-touch devices. Touch devices fall back to native scroll.
- **Product page**: `product-pcie-gen5.html` includes an embedded PDF viewer using pdf.js (loaded from CDN) for the product datasheet from `docs/`.

## Assets

- `assets/images/` — logos (`logo-dark.png`, `logo-light.png`), hero/blog images
- `assets/icons/` — IP category icons (png format, named by protocol: `pci-express.png`, `usb40.png`, etc.)
- `assets/js/` — vendored GSAP and ScrollTrigger (do not edit)
- `assets/chip-assembly-web.mp4` — hero background video
- `docs/` — product PDF datasheets

## Development

No build commands. Open HTML files directly in a browser or use any static file server:

```
# Python
python -m http.server 8000

# Node
npx serve .
```
