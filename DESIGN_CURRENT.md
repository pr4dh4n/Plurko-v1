# DESIGN_CURRENT.md — PlurkoTech Design DNA Audit

Generated: 2026-04-09

---

## 1. COLOR PALETTE

### CSS Custom Properties (`:root`)

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#FFFFFF` (light) / `#1A1A1E` (dark) | Page background |
| `--bg-alt` | `#F7F5F2` (light) / `#2A2A2E` (dark) | Alternate section background |
| `--bg-dark` | `#222222` (light) / inherited (dark) | Dark section background |
| `--bg-dark-deep` | `#1A1A1E` (light: `#E8E4EC`) | Deep dark / Why section bg |
| `--text` | `#222222` (light) / `#E8E8E8` (dark) | Primary text |
| `--text-light` | `#666666` (light) / `#AAAAAA` (dark) | Secondary text |
| `--text-muted` | `#999999` (light) / `#777777` (dark) | Muted/meta text |
| `--purple` | `#744897` | **Primary brand color** |
| `--purple-l` | `#987AB3` | Purple light variant |
| `--purple-xl` | `#C09FD8` | Purple extra-light |
| `--purple-d` / `--purple-dark` | `#4E3166` | Purple dark variant |
| `--gold` | `#FFD166` | **Accent / CTA color** |
| `--gold-d` | `#E8B84B` | Gold dark (hover state) |
| `--accent` | `var(--purple)` | Alias for primary |
| `--accent-light` | `var(--purple-l)` | Alias for primary light |
| `--white` | `#FFFFFF` | White constant |
| `--border` | `rgba(34,34,34,0.08)` (light) / `rgba(255,255,255,0.08)` (dark) | Border color |
| `--border-dark` | `rgba(255,255,255,0.08)` / `rgba(34,34,34,0.08)` | Inverted border |

### Category Colors (search results)
| Category | Color | Background |
|----------|-------|------------|
| Interface | `--purple-l` (#987AB3) | `rgba(116,72,151,0.12)` |
| Memory | `--gold` (#FFD166) | `rgba(255,209,102,0.12)` |
| Security | `#6BCB77` | `rgba(107,203,119,0.12)` |
| Analog | `#64B5F6` | `rgba(100,181,246,0.12)` |

### Easing Functions
| Token | Value |
|-------|-------|
| `--ease-out-expo` | `cubic-bezier(0.16,1,0.3,1)` |
| `--ease-smooth` | `cubic-bezier(0.4,0,0.2,1)` |

---

## 2. TYPOGRAPHY

### Font Stack
| Usage | Font Family | Weights | Source |
|-------|-------------|---------|--------|
| **Headings** (h1-h6) | `Poppins` | 400, 500, 600, 700, 800 | Google Fonts CDN |
| **Body** | `Raleway` | 300, 400, 500, 600 | Google Fonts CDN |
| **Mono / Technical** | `JetBrains Mono` | 300, 400, 500 | Google Fonts CDN |

### Font Import URL
```
https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Raleway:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap
```

### Typography Scale
| Element | Size | Weight | Line-height | Letter-spacing |
|---------|------|--------|-------------|----------------|
| Hero H1 | `clamp(2.8rem, 6vw, 5.5rem)` | 800 | 0.95 | — |
| Carousel H1 | `clamp(2.4rem, 5vw, 4.5rem)` | 800 | 1.0 | — |
| Section H2 | `clamp(2rem, 4.5vw, 3.8rem)` | 700 | 1.05 | -0.02em |
| Card H3 | 18-22px | 700 | 1.05 | -0.02em |
| Body text | 14-18px (Raleway) | 400 | 1.6-1.7 | — |
| Tags/Labels | 9-13px (JetBrains Mono) | 600-700 | — | 0.08-0.35em |
| CTA buttons | 11-14px (Poppins) | 600-700 | — | 0.15em |

### Helper Classes
- `.font-display` → Poppins
- `.font-mono` → JetBrains Mono

---

## 3. LOGO & BRANDING

### Logo Files
| File | Usage |
|------|-------|
| `assets/images/logo-dark.png` | Footer logo, dark backgrounds |
| `assets/images/logo-light.png` | Header (scrolled, light theme) |

### Logo Dimensions
- Header: `height: 32px` (auto width)
- Footer: `height: 32px`

### Header Logo Behavior
- Before scroll: white version (on transparent header)
- After scroll (`.scrolled`): switches based on theme
- Logo swap handled in JS via `data-theme` attribute

---

## 4. FOOTER (FROZEN — DO NOT CHANGE)

### Structure
```
footer.site-footer
├── .footer-grid
│   ├── .footer-brand (logo + mission statement)
│   ├── .footer-col "Products" (5 links)
│   ├── .footer-col "Solutions" (4 links)
│   └── .footer-col.footer-newsletter
│       ├── description text
│       ├── email input + subscribe button
│       └── .footer-social (LinkedIn, Twitter/X, GitHub, YouTube)
└── .footer-bottom
    ├── .copyright "© 2026 Plurko Technologies"
    └── .legal (Privacy, Terms, Cookie, GDPR, Export Control)
```

### Footer Links
**Products:** Interface IPs, Memory IPs, Peripheral & Crypto, Analog IPs, Cellular IPs
**Solutions:** Verification IPs, EDA Tools, ASIC Turn-Key, Test Services
**Legal:** Privacy Policy, Terms of Service, Cookie Policy, GDPR Compliance, Export Control

---

## 5. INQUIRY FORM (Field Names & Types)

### Current Fields
| Field ID | Type | Label | Required | Grid |
|----------|------|-------|----------|------|
| `fname` | text | Full Name | Yes | half |
| `org` | text | Organization / Company | Yes | half |
| `email` | email | Email | Yes | half |
| `phone` | tel | Phone | No | half |
| `ipCategory` | select | IP Category | No | full |
| `licensing` | select | Type of Licensing | No | half |
| `projectName` | text | Project Name | No | half |
| `endApplication` | text | End Application | No | half |
| `fabNode` | text | Required Fab and Node | No | half |
| `timeline` | text | Timeline | No | full |
| `notes` | textarea | Additional Notes | No | full |

### IP Category Options
- SoC Design — Mobile
- SoC Design — Automotive
- SoC Design — Data Center
- FPGA Prototyping
- ASIC Development
- IoT / Edge Computing
- Security / Crypto Module
- Other

### Licensing Options
- White Box
- Black Box

### Form Validation
- Floating label pattern (label moves up on focus/value)
- `.has-value` class toggled via JS on input/change
- Required fields: fname, org, email
- Submit via POST to Google Apps Script endpoint

---

## 6. CURRENT PAGE STRUCTURE (index.html)

### Sections in Order
1. **Header** (fixed, 72px height, hamburger menu + search + theme toggle + CTA)
2. **Menu Overlay** (slide-in from left, 380px width, backdrop blur)
3. **Mega Navigation** (3-column flyout: L1 categories → L2 subcategories → L3 items)
4. **Hero** (3-slide carousel, fade transitions, progress dots + arrows)
5. **How It Works** (4-step horizontal grid, numbered icons)
6. **Most Popular Offerings** (3 cards: High-Speed Interface, Memory Die, Custom IP)
7. **Why PlurkoTech** (5 value prop cards in 3×2 grid)
8. **Inquiry Form** (2-column layout: headline left, form grid right)
9. **Footer** (4-column grid)

### Missing Sections (CSS exists but no HTML)
- `.problem-section` — Industry challenges / pain points
- `.products-section` — Product catalog cards
- `.blog-section` — Blog post cards
- `.sustainability-section` / `.capabilities-grid` — Capability showcase
- `.marquee-section` — Scrolling text/logo strip
- `.efficiency-section` / `.number-card` — Stats/metrics

---

## 7. THEME SYSTEM

### Mechanism
- `data-theme` attribute on `<html>` element
- Values: `"dark"` or `"light"`
- Persisted via `localStorage` key `plurko-theme`
- Toggle button in header (`.theme-toggle`)
- Sun/Moon SVG icons swap via CSS display

### Dark Mode Default Colors
- Background: `#1A1A1E`
- Surface: `#2A2A2E`
- Text: `#E8E8E8`
- Border: `rgba(255,255,255,0.08)`

### Light Mode Overrides
- Background: `#FFFFFF`
- Surface: `#F7F5F2`
- `--bg-dark` becomes `#EFECF0` (lavender tint)
- `--bg-dark-deep` becomes `#E8E4EC`

---

## 8. ANIMATION SYSTEM

### Scroll Reveal (GSAP + ScrollTrigger)
- `.reveal` class: `opacity: 0 → 1`, `translateY(30px → 0)`, duration 0.7s
- `.reveal-stagger`: same, applied with stagger timing
- `.split-word span`: word-by-word reveal, `translateY(100% → 0)`
- All gated behind `.js-ready` class (set after GSAP init)

### Hover Patterns
- Cards: `translateY(-4px to -6px)` + `box-shadow` increase + `border-color` transition
- CTAs: `scale(1.03)` + fill sweep animation (`.cta-fill` scaleX)
- Icons: background color fill on parent hover
- Links: `gap` increase for arrow links

### Hero Animations
- Pixel trail canvas (mouse-following grid effect)
- Hero glow pulse (radial gradient, 6s infinite)
- Background drift (25s infinite translate + scale)
- Slide transitions: opacity 0.8s fade

### Custom Cursor
- `.cursor-dot` (12px circle, follows mouse with lerp 0.15)
- `.hovering` state: scales up on interactive elements
- Disabled on touch devices

---

## 9. ASSETS INVENTORY

### Images
| File | Usage |
|------|-------|
| `1.jpg`, `2.jpg`, `3.jpg` | Hero carousel slide backgrounds |
| `4.jpg`, `5.jpg`, `6.jpg`, `7.jpg` | Section backgrounds / decorative |
| `blog-datacenter.jpg` | Blog card image |
| `blog-semiconductors.jpg` | Blog card image |
| `hero-semiconductor.jpg` | Alternate hero image |
| `logo-dark.png` | Dark version of logo |
| `logo-light.png` | Light version of logo |

### Icons (26 protocol icons in `assets/icons/`)
5g, adc, afe, ble, bluetooth, can-fd, dac, ddr, display-port, ethernet1, gnss, hdmi, lc3, lc3plus, ldo, mipi, nb-iot, onfi, pci-express, pll, pmu, sdr, serdes, usb40, wifi, zigbee

### JavaScript (vendored, DO NOT EDIT)
- `assets/js/gsap.min.js`
- `assets/js/ScrollTrigger.min.js`

### Video
- `assets/chip-assembly-web.mp4` — Hero background video (not currently used in carousel)

---

## 10. RESPONSIVE BREAKPOINTS

| Breakpoint | Usage |
|------------|-------|
| `900px` | Grid collapse (3-col → 2-col) |
| `768px` | Mobile: hide header CTA, hide hero arrows, hide mega-nav, stack grids to 1-col |
| `560px` | Further grid collapse |
| `480px` | Search results width adjustment |

### Smooth Scroll
- Desktop: custom GSAP-based smooth scroll via `#smooth-wrapper` / `#smooth-content`
- Touch devices (`pointer: coarse`): native scroll, wrapper positioned relative
