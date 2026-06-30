---
name: Institutional Web3 Ledger
colors:
  surface: '#0f1418'
  surface-dim: '#0f1418'
  surface-bright: '#353a3e'
  surface-container-lowest: '#0a0f13'
  surface-container-low: '#171c20'
  surface-container: '#1b2024'
  surface-container-high: '#252b2f'
  surface-container-highest: '#30353a'
  on-surface: '#dee3e9'
  on-surface-variant: '#bec8d2'
  inverse-surface: '#dee3e9'
  inverse-on-surface: '#2c3135'
  outline: '#88929b'
  outline-variant: '#3e4850'
  surface-tint: '#89ceff'
  primary: '#89ceff'
  on-primary: '#00344d'
  primary-container: '#0ea5e9'
  on-primary-container: '#003751'
  inverse-primary: '#006591'
  secondary: '#d2bbff'
  on-secondary: '#3f008e'
  secondary-container: '#6001d1'
  on-secondary-container: '#c9aeff'
  tertiary: '#ffb86e'
  on-tertiary: '#492900'
  tertiary-container: '#de8712'
  on-tertiary-container: '#4d2b00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c9e6ff'
  primary-fixed-dim: '#89ceff'
  on-primary-fixed: '#001e2f'
  on-primary-fixed-variant: '#004c6e'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#ffb86e'
  on-tertiary-fixed: '#2c1600'
  on-tertiary-fixed-variant: '#693c00'
  background: '#0f1418'
  on-background: '#dee3e9'
  surface-variant: '#30353a'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 280px
  sidebar-collapsed: 64px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
  stack-xl: 48px
---

## Brand & Style

The design system is engineered for high-stakes financial operations within the Stellar ecosystem. It balances the cutting-edge nature of Web3 with the sober reliability of institutional SaaS. The aesthetic is a fusion of **Corporate Modern** and **Minimalism**, prioritizing information density without sacrificing clarity.

The interface evokes a sense of "precision-grade utility." Drawing inspiration from the developer-centric elegance of Linear and the financial rigors of Stripe, the system utilizes a disciplined dark theme, razor-sharp typography, and subtle depth through tonal layering rather than aggressive decoration. The goal is to make complex funding agreements feel manageable, secure, and technologically advanced.

## Colors

The palette is rooted in deep obsidian tones to provide a stable foundation for high-contrast data visualization. 

- **Foundation:** The system uses `#09090B` for the deep background and `#18181B` for elevated surface elements like cards and sidebars.
- **Accents:** The primary Sky blue (`#0EA5E9`) is reserved for primary actions and active states, while the Violet (`#7C3AED`) is used sparingly for secondary brand moments or specific Web3/Stellar-related identifiers.
- **Semantic:** Success, Warning, and Danger colors follow industry standards but are calibrated for high legibility against dark backgrounds, ensuring critical transaction statuses are immediately recognizable.

## Typography

The typography system utilizes **Geist** for its neutral, technical appearance and exceptional legibility in dark mode interfaces. It provides a "developer-tool" aesthetic that translates well to financial dashboards.

For data-heavy elements—such as wallet addresses, transaction hashes, and currency amounts—the system employs **JetBrains Mono**. This monospaced font ensures that numerical data aligns perfectly in tables and lists, reinforcing the feeling of technical precision. Letter spacing is slightly tightened on headlines to create a premium, "locked-in" look.

## Layout & Spacing

This design system uses a **Fluid-Fixed Hybrid Grid**. The main navigation is a collapsible sidebar that anchors to the left, while the content area expands to a maximum width of 1440px to prevent excessive line lengths on ultra-wide monitors.

A strict 8px spacing scale (8, 16, 24, 32, 48, 64) is used to maintain vertical rhythm. Layouts should utilize generous whitespace between major sections to reduce cognitive load when viewing dense financial tables. 

**Breakpoints:**
- **Mobile (<768px):** Sidebar converts to a bottom sheet or hidden drawer. Margins reduce to 16px. Content stacks vertically.
- **Tablet (768px - 1024px):** Sidebar collapses to icon-only mode.
- **Desktop (>1024px):** Full sidebar visible. 12-column grid for dashboard widgets.

## Elevation & Depth

Depth in the design system is achieved through **Tonal Layers** and **Subtle Outlines** rather than heavy shadows.

1.  **Level 0 (Base):** `#09090B` — Used for the main app background.
2.  **Level 1 (Surface):** `#18181B` — Used for cards, sidebars, and modals.
3.  **Level 2 (Overlay):** `#27272A` — Used for popovers, tooltips, and dropdown menus.

**Borders:** All interactive surfaces must have a 1px solid border using `#27272A`. This creates definition between dark surfaces.
**Shadows:** When necessary (e.g., Modals), use a very soft, large-radius shadow: `0 20px 25px -5px rgba(0, 0, 0, 0.5)`. Avoid colored shadows to maintain the professional, institutional feel.

## Shapes

The design system adopts a **Rounded** shape language to soften the "coldness" of the dark, technical theme. 

- **Standard Elements:** 0.5rem (8px) for buttons, inputs, and small widgets.
- **Containers:** 1rem (16px) for main dashboard cards and the sidebar.
- **Large Components:** 1.5rem (24px) for major sections or empty state illustrations.

This `rounded-xl` approach for containers creates a distinct, modern "app-like" feel that differentiates the product from traditional, sharp-edged legacy banking software.

## Components

- **Buttons:** 
  - *Primary:* Sky background, black text, no border. 
  - *Secondary:* Transparent background, `#27272A` border, white text.
  - *Ghost:* No background or border, primary color text.
- **Input Fields:** `#09090B` background with a `#27272A` border. On focus, the border transitions to the primary Sky color with a 2px outer glow (ring).
- **Cards:** `#18181B` background, 1px `#27272A` border, 16px corner radius. Title areas should have a subtle bottom border to separate header from content.
- **Chips/Status:** Small labels with 20% opacity background of the semantic color (e.g., Success green at 20% alpha) and 100% opacity text.
- **Tables:** No vertical borders. Horizontal borders only between rows (`#27272A`). Header row uses `label-sm` typography in a muted gray.
- **Sidebar:** Fixed left, `#18181B` background, right-side border only. Active navigation items use a subtle ghost-white background and a vertical primary-color pill indicator on the left.
- **Data Visualizations:** Use a single-color gradient (Sky to transparent) for area charts to maintain the minimalist aesthetic.