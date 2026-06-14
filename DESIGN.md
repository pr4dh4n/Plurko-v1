# PlurkoTech — Design System

Authoritative design reference, extracted from the production `index.html`. Every page (and the React rebuild) must use these tokens — **do not hardcode colors, fonts, radii, or easing.** Light theme is the default; every component needs a `[data-theme="dark"]` counterpart.

---

## 1. Color Tokens

Defined as CSS custom properties on `:root`. Theme switches override a subset under `[data-theme="dark"]` / `[data-theme="light"]`.

### Brand
| Token | Value | Use |
|---|---|---|
| `--purple` | `#744897` | Primary brand / accent |
| `--purple-l` | `#987AB3` | Lighter brand |
| `--purple-xl` | `#C09FD8` | Lightest brand (tints) |
| `--purple-d` / `--purple-dark` | `#4E3166` | Deep brand |
| `--gold` | `#FFD166` | Accent — CTAs, highlights, tags |
| `--gold-d` | `#E8B84B` | Gold hover / fill |
| `--accent` | `var(--purple)` | Semantic accent alias |
| `--accent-light` | `var(--purple-l)` | Semantic accent-light alias |

### Light theme (default `:root`)
| Token | Value |
|---|---|
| `--bg` | `#FFFFFF` |
| `--bg-alt` | `#F7F5F2` |
| `--bg-dark` | `#222222` → light override `#EFECF0` |
| `--bg-dark-deep` | `#1A1A1E` → light override `#E8E4EC` |
| `--text` | `#222222` |
| `--text-light` | `#666666` |
| `--text-muted` | `#999999` |
| `--white` | `#FFFFFF` |
| `--border` | `rgba(34,34,34,0.08)` |
| `--border-dark` | `rgba(255,255,255,0.08)` → light override `rgba(34,34,34,0.08)` |

### Dark theme (`[data-theme="dark"]`)
| Token | Value |
|---|---|
| `--bg` | `#1A1A1E` |
| `--bg-alt` | `#2A2A2E` |
| `--text` | `#E8E8E8` |
| `--text-light` | `#AAAAAA` |
| `--text-muted` | `#777777` |
| `--border` | `rgba(255,255,255,0.08)` |
| section-tag accent | `#e6b830` (gold shifts warmer in dark) |

**Tinted overlays** (recurring): purple `rgba(116,72,151,0.04–0.3)`, gold `rgba(255,209,102,0.06–0.3)`.

---

## 2. Typography

Loaded via Google Fonts:
```
Poppins:wght@400;500;600;700;800   — headings, CTAs, eyebrows
Raleway:wght@300;400;500;600       — body (default on <body>)
JetBrains Mono:wght@300;400;500    — technical labels, tags, codes
```

| Role | Family | Notes |
|---|---|---|
| Body | `'Raleway', sans-serif` | Default text color `var(--text)` |
| Headings / CTAs | `'Poppins', sans-serif` | Weights 600–800 |
| Technical / tags / mono | `'JetBrains Mono', monospace` | Uppercase eyebrows, spec codes |

### Fluid heading scale (`clamp(min, vw, max)`)
| Level | Value |
|---|---|
| Hero display | `clamp(4rem, 10vw, 7rem)` |
| H1 / page hero | `clamp(2.2rem, 4.5vw, 3.8rem)` |
| H2 / section | `clamp(2rem, 4.5vw, 3.5rem)` · `clamp(2.5rem, 5vw, 3.5rem)` |
| H3 / sub | `clamp(1.8rem, 3.5vw, 2.4rem)` · `clamp(20px, 3vw, 28px)` |
| Lead / intro | `clamp(16px, 2vw, 22px)` |
| Body | `clamp(14px, 1.2vw, 17px)` |
| Small / label | `clamp(11px, 0.9vw, 13px)` |

### Eyebrow / section tag (`.section-tag`)
```
font: 600 11px 'JetBrains Mono'; text-transform: uppercase;
letter-spacing: 0.2em; color: var(--purple);   /* gold (#e6b830) in dark */
```

### Letter-spacing scale
Uppercase labels: `0.1em` / `0.12em` / `0.15em` / `0.2em`. Tight headings: `-0.02em`.

---

## 3. Shape, Elevation, Motion

### Border radius
| Token | Use |
|---|---|
| `100px` | Pills, buttons, tags |
| `16px` | Cards (often `16px 16px 0 0` for card heads) |
| `12px` | Inner cards / inputs |
| `8px` / `4px` / `2px` | Small elements |
| `50%` | Circular icons/avatars |

### Box shadow
| Use | Value |
|---|---|
| Card (light) | `0 8px 32px rgba(0,0,0,0.06)` |
| Card (dark) | `0 8px 32px rgba(0,0,0,0.2)` |
| Card hover (light) | `0 20px 60px rgba(0,0,0,0.08)` |
| Purple glow | `0 8px 32px rgba(116,72,151,0.3)` |
| Gold glow | `0 8px 24px rgba(255,209,102,0.3)` |

### Easing (tokens)
| Token | Value |
|---|---|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` |

Standard transitions: `0.3s var(--ease-smooth)` (interactive), `0.4s var(--ease-smooth)` (fills/reveals).

---

## 4. Layout

| Token | Value |
|---|---|
| Page container max-width | `1400px` |
| Content blocks | `900px`, `800px`, `700px`, `560px`, `520px`, `480px` |
| Breakpoints | `480px`, `560px`, `768px` (primary), `900px` |
| Touch | `@media(pointer:coarse)` — disables custom smooth-scroll/hover effects |
| Motion | `@media(prefers-reduced-motion:reduce)` honored |

---

## 5. Components

### Primary CTA (pill button — `.hero-cta` / `.header-cta` / `.form-submit`)
```
background: var(--gold); color: #222222;
font: 600 clamp(11px,0.9vw,13px) 'Poppins'; text-transform: uppercase; letter-spacing: 0.15em;
padding: 12px 28px; border-radius: 100px; border: none; overflow: hidden;
hover: transform: scale(1.03) + .cta-fill (gold-d) slides in from left (scaleX 0→1, 0.4s)
```
A `.cta-fill` span animates the hover wash; label/icon sit at `z-index:1`.

### Cards
`var(--bg-alt)` surface, `var(--border)` 1px border, radius `16px`, card shadow above. Dark overrides use `#2a2a2e` and `rgba(255,255,255,0.06)` borders.

### Forms
Underline inputs (`border-bottom`), floating labels (`.form-label` lifts on focus/`has-value`), gold focus underline in dark / purple in light. License selector = radio cards (`.license-card`, White Box / Black Box) with gold/purple active border.

---

## 6. Theming Mechanism

- `data-theme` attribute on `<html>` (`"light"` default, `"dark"`).
- Persisted in `localStorage` under key **`plurko-theme`**.
- Toggle button swaps sun/moon icons; gold stroke in dark.

---

## 7. Animation Stack

- **GSAP + ScrollTrigger** (vendored, `assets/js/`). Do not edit vendor files.
- Elements with class `.reveal` animate in on scroll.
- Custom GSAP smooth-scroll on non-touch devices; touch falls back to native scroll.
- Home hero is a multi-slide carousel; header has live search (`Ctrl+K`).

---

## 8. Assets

| Asset | Path |
|---|---|
| Logos | `assets/images/logo-dark.png`, `logo-light.png` |
| Hero video | `assets/chip-assembly-web.mp4` |
| Hero slides | `assets/images/hero-slide-1..3.{jpg,png}` |
| Offerings | `assets/images/offering-{interface-ip,memory-die,custom-ip}.{jpg,png}` |
| Why section | `assets/images/why-{silicon-proven,future-tech,e2e-solutions,global,section-bg}.{jpg,png}` |
| Blog images | `assets/images/blog-{pcie-gen5,ucie-chiplet,verification,hbm-memory}.{jpg,png}` |
| Misc | `assets/images/{how-it-works,banner-industries}.{jpg,png}`, `assets/images/1..7.jpg` |
| IP icons | `assets/icons/*.png` (named by protocol) |
| Datasheets | `docs/*.pdf` |

---

## 9. Voice / Brand Rules

- Premium, engineering-led tone ("Built by Engineers, for Engineers").
- Gold = action/highlight; purple = brand/identity. Never use raw hex in code — reference tokens.
- Every new component ships with both light and dark styling.
