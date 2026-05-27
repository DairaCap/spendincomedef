---
name: Aura Finance
colors:
  surface: '#101319'
  surface-dim: '#101319'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a30'
  surface-container-highest: '#32353b'
  on-surface: '#e1e2ea'
  on-surface-variant: '#dcbed4'
  inverse-surface: '#e1e2ea'
  inverse-on-surface: '#2d3037'
  outline: '#a4899d'
  outline-variant: '#564052'
  surface-tint: '#ffabf3'
  primary: '#ffabf3'
  on-primary: '#5b005b'
  primary-container: '#ff00ff'
  on-primary-container: '#510051'
  inverse-primary: '#a900a9'
  secondary: '#dcb8ff'
  on-secondary: '#480081'
  secondary-container: '#7701d0'
  on-secondary-container: '#dcb7ff'
  tertiary: '#ffb77d'
  on-tertiary: '#4d2600'
  tertiary-container: '#db7800'
  on-tertiary-container: '#452100'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd7f5'
  primary-fixed-dim: '#ffabf3'
  on-primary-fixed: '#380038'
  on-primary-fixed-variant: '#810081'
  secondary-fixed: '#efdbff'
  secondary-fixed-dim: '#dcb8ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6700b5'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#101319'
  on-background: '#e1e2ea'
  surface-variant: '#32353b'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  container-margin: 20px
  stack-gap: 16px
  section-gap: 32px
  grid-columns-mobile: '4'
  grid-columns-desktop: '12'
---

## Brand & Style
The design system is engineered for a high-end personal finance experience that feels futuristic, secure, and data-driven. It utilizes a **Modern Dark / Flat 2.0** aesthetic, moving away from traditional corporate finance visuals toward a lifestyle-centric, immersive interface. 

The brand personality is sophisticated yet energetic. By pairing a deep, void-like background with high-energy neon accents, the UI creates a "cockpit" feel where financial data becomes the focal point. The emotional response is one of total control and clarity, stripping away visual noise through borderless containers and expansive negative space.

## Colors
This design system employs a **Deep Night** palette. The foundation is `#05070A`, providing a pure, high-contrast base for data visualization. 

Surface elements use **Anthracite Gray** (`#1A1D23`) to create subtle separation without the need for borders. Interactive elements and status indicators are driven by vibrant neon gradients (Magenta-to-Pink for primary actions, Orange for warnings or growth, and Violet for secondary information). All primary text is pure white for maximum legibility against the dark background, while secondary labels use a muted gray to maintain visual hierarchy.

## Typography
The system relies on **Inter**, a geometric sans-serif, to convey technical precision. 

- **Data Emphasis:** Large monetary values use `display-lg` with tight letter-spacing to emphasize scale.
- **Hierarchy:** Primary headings are pure white (`#FFFFFF`). Secondary body text and metadata use a desaturated slate-gray to recede into the background.
- **Labels:** Small utility labels use `label-caps` with increased tracking to ensure readability at small sizes on mobile devices.

## Layout & Spacing
The layout follows a **fluid-to-fixed** hybrid model. For mobile, it utilizes a 4-column grid with 20px margins. 

The rhythm is built on an **8px base unit**. Spacing between related cards should be 16px (`stack-gap`), while distinct functional sections should be separated by 32px (`section-gap`). Elements are grouped within "invisible" containers, where the heavy rounding of the backgrounds defines the structure rather than physical lines.

## Elevation & Depth
Depth is achieved through **Tonal Layering** and soft shadows rather than traditional elevation. 

- **Level 0:** Background (`#05070A`).
- **Level 1:** Cards and Sheets (`#1A1D23`). These utilize a very soft, high-spread shadow (`0px 20px 40px rgba(0,0,0,0.4)`) to lift them from the void background.
- **Interaction:** On tap or hover, cards do not lift further; instead, they may feature a subtle interior glow or a 1px tint shift to the primary neon color.
- **No Borders:** Physical borders are strictly forbidden. Use color contrast and shadows to define boundaries.

## Shapes
The design system uses a **Pill-shaped (3)** rounding logic to soften the technical nature of financial data. 

- **Cards:** Use `rounded-xl` (24px - 32px) for a friendly, organic feel.
- **Buttons:** Fully pill-shaped (rounded-full).
- **Inputs:** Use `rounded-lg` (16px) to maintain a slightly more structured look for data entry.

## Components
- **Buttons:** Primary buttons are pill-shaped with the Magenta gradient. Text is white and bold. Secondary buttons are semi-transparent gray with white text.
- **Cards:** All content modules sit on `#1A1D23` backgrounds with 24px padding. No borders.
- **Input Fields:** Background matches the card color (`#1A1D23`) but uses a slightly darker shade or an inner shadow to create an "inset" feel. No borders.
- **Bottom Navigation:** A fixed bar with a subtle background blur (backdrop-filter: blur(20px)). Icons are minimal 2px stroke weight outlines. The active state is indicated by a small neon dot below the icon.
- **Chips/Badges:** Small, high-contrast capsules used for transaction categories (e.g., "Food", "Rent") using the secondary violet or orange gradients.
- **Data Visualization:** Line charts use the neon gradients for the stroke, with a subtle glow (drop-shadow) effect on the line itself to simulate a light-pipe or fiber-optic aesthetic.