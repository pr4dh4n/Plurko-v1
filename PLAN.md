# PlurkoTech Website Revamp Plan

## Overview

Revamp from 2-page static site to 6-page site based on PLT_Website_Content.docx. All pages follow the existing no-build, inlined CSS/JS pattern with GSAP animations and dark/light theme support.

---

## Pages to Build

### 1. HOME PAGE (`index.html`) — Revamp Existing

#### Hero Section — Multi-Slide Carousel (3 slides)
- **Slide 1**: "Accelerate Your Chip Design with Production-Ready IP Solutions" → CTA: Explore IP Core Products
- **Slide 2**: "Reliable IP for Next-Generation Semiconductor Innovation" → CTA: View Solutions
- **Slide 3**: "Custom IP Solutions Tailored for Your Application" → CTA: Raise an Inquiry
- Replace current single video hero with a carousel (keep video as background or transition to styled slides)

#### How It Works
- Headline: "From Search to Proven Solutions"
- Sub-heading: "A Simple Process to Access Semiconductor Solutions"
- 4 steps: Browse Catalogue → Shortlist IP Cores → Raise Inquiry → Get Desired Products & Solutions

#### Most Popular Offerings
- Headline: "End-to-End Semiconductor Expertise"
- 3 cards:
  1. Semiconductor High-Speed Interface IP Cores
  2. Memory Die Solutions
  3. Custom IP Development

#### Why PlurkoTech
- Headline: "Built by Engineers, for Engineers"
- Sub-heading: "A Trusted Technology Access Point"
- 5 value props: Market & Competitive Insight, Aligned with Future Technologies, Flexible Engagement Model, End-to-End Semiconductor Solutions, Global Outreach

#### Start an Inquiry (Form)
- Keep existing form structure but modify:
  - Replace "Quantity Scale" with "Type of Licensing" (White Box / Black Box dropdown)
  - Add: Project Name (blank text field)
  - Add: End Application (blank text field)
  - Add: Required Fab and Node (blank text field)
  - Rename "Project Timeline" to "Timeline" (blank text field)

#### Footer
- Keep existing

---

### 2. SOLUTIONS PAGE (`solutions.html`) — New Page

#### Hero Section
- Headline: "Comprehensive Semiconductor IP Solutions for Advanced System Design"
- Subtext: "Leverage scalable IP platforms engineered to support next-generation electronics across high-performance, automotive, connectivity, and secure applications."
- CTA: Discuss Your Requirements

#### Semiconductor Solutions (3 categories)
1. **Memory Die Solutions** — Features: High bandwidth optimization, Low-latency architectures, Power-efficient implementation, Scalable integration support
2. **High-Speed IP Cores** — Applications: PCIe, USB, Ethernet, MIPI, SerDes
3. **Custom IP Developments** — Capabilities: Protocol adaptation, Architecture optimization, Power tuning, Node migration support, System-level integration readiness

#### Core Markets
- Consumer Electronics, Industrial Systems, Automotive Industries, Telecom Sectors, AI-Edge & IoT, Data Centres, Medical Technology

---

### 3. IP CORE PRODUCTS PAGE (`ip-core-products.html`) — New Page

#### Hero Section
- Headline: "Explore Our Semiconductor IP Core Portfolio"
- Subtext: "Discover silicon-proven IP solutions designed for performance, scalability, and integration flexibility across multiple industries."
- CTA: Browse Categories

#### Featured IP Core Categories (9 categories from PLT_2026_IP_Portfolio PDF)
Excluded: Wireless & Bluetooth, EDA Tools, Memory Die Solutions

1. **High-Speed Interface IP Cores** — Ethernet, USB, MIPI, PCIe, Video, Display
2. **ISP (Image Signal Processing) IP Cores** — Noise Reduction, Scaling, Geometry, Demosaic
3. **Memory IP Cores** — DDR, LPDDR, MIPI, PHY
4. **SerDes IP Cores** — Combo SerDes, SerDes
5. **Peripheral & Cryptographic IP Cores** — Peripheral, CAN, Security
6. **Analog & Mixed-Signal IP Cores** — ADC/DAC, AFE, PLL, Power
7. **Verification IP Cores** — Interface VIP, Memory VIP, Peripheral VIP, Storage VIP, System VIP
8. **Network & Storage IP Cores** — Networking, Storage
9. **SoC/CPU/Interconnect IP Cores** — ADC/DAC, AFE, PLL, Power

#### Core Markets
- Same 7 industries as Solutions page

---

### 4. BLOGS PAGE (`blogs.html`) — New Page

#### Hero Section
- Headline: "Insights Shaping the Future of Semiconductor Innovation"
- Subtext: "Explore expert perspectives on IP integration, silicon architecture trends, connectivity evolution, and system-level optimization strategies."

#### Challenges Intro
- "Modern semiconductor teams face increasing complexity across performance targets, node transitions, integration timelines, and verification cycles."
- Topics: Reducing integration risk, Accelerating validation, Optimizing architecture decisions, Managing power efficiency targets, Scaling across technology nodes

#### Blog Posts
- Source content from https://dev.to/plurkotech
- Fresh images required (TBD from client)

---

### 5. CONTACT PAGE (`contact.html`) — New Page

#### Contact Section
- Headline: "Connect with Our Semiconductor Experts"
- Subtext: "Reach out to discuss requirements, request technical documentation, or explore collaboration opportunities."
- Email: contact@plurkotech.com
- HQ: Delhi, India

#### Raise Inquiry Section
- Reuse same inquiry form from Home Page

---

## Reusable Components (shared across all pages)

| Component | Notes |
|-----------|-------|
| **Header/Nav** | Same header with logo, search, theme toggle, hamburger menu. Update nav links for new pages. |
| **Footer** | Identical across all pages |
| **Theme System** | Same CSS custom properties + `data-theme` attribute + localStorage |
| **Core Markets Section** | Used on Solutions + IP Core Products pages — identical content |
| **Inquiry Form** | Used on Home + Contact pages — identical structure |
| **GSAP Animations** | Same reveal/scroll animations pattern |
| **Section Dividers** | Same `.section-divider` pattern between sections |

## Implementation Order

1. **Home Page revamp** — hero carousel, updated sections, modified inquiry form
2. **Solutions Page** — new page, establishes shared patterns (core markets)
3. **IP Core Products Page** — new page, catalog grid
4. **Contact Page** — new page, reuses inquiry form
5. **Blogs Page** — new page (depends on fresh images + dev.to content)
6. **Navigation update** — update header nav links across all pages

## Open Items

- [ ] Fresh blog images — waiting from client
- [ ] PLT_2026_IP_Portfolio PDF — needed to populate full IP catalog details
- [ ] Hero carousel: decide if video background stays or is replaced with styled slides
- [ ] Inquiry form backend/action endpoint
