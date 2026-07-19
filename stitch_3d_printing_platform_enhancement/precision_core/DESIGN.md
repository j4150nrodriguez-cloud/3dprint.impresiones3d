---
name: Precision Core
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#d2bbff'
  on-secondary: '#3f008e'
  secondary-container: '#6001d1'
  on-secondary-container: '#c9aeff'
  tertiary: '#ffeac0'
  on-tertiary: '#3e2e00'
  tertiary-container: '#fec931'
  on-tertiary-container: '#6f5500'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#ffdf96'
  tertiary-fixed-dim: '#f3bf26'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  slate-surface: '#1E293B'
  electric-cyan: '#00E5FF'
  filament-orange: '#F97316'
  status-green: '#22C55E'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 16px
  max-width: 1440px
---

## Brand & Style

The design system is engineered for a premium additive manufacturing audience, evoking the precision of high-end CNC machinery and industrial 3D printing. The aesthetic is rooted in **Modern Tech Glassmorphism**, balancing deep, layered surfaces with high-energy accents that mimic laser paths and cooling filaments.

The personality is technical, authoritative, and sophisticated. It utilizes a high-contrast dark environment to highlight structural details and material quality. Visuals should lean into transparency, light refraction, and ultra-crisp execution to mirror the accuracy of the product's output.

## Colors

The palette is anchored in a deep charcoal (`#121212`) base to provide maximum depth. The primary brand color is an **Electric Cyan**, used for interactive states and to represent high-tech laser/nozzle precision. 

**Secondary accents** include a vibrant violet derived from the reference material, used sparingly for advanced features or luxury tiering. Backgrounds utilize a slate-toned hierarchy to define depth tiers, ensuring the UI doesn't feel flat. Gradients should be used as subtle "glows" rather than solid fills, appearing as if light is catching the edge of a transparent material.

## Typography

This design system uses **Geist** for its systematic, developer-centric clarity and geometric precision. It scales from heavy display weights for impact down to highly legible body copy. 

To reinforce the engineering narrative, **JetBrains Mono** is introduced as a secondary label font for technical specifications, dimensions, and metadata. Headlines should maintain tight tracking to feel "machined," while body text requires standard spacing for technical readability.

## Elevation & Depth

Depth is achieved through **Glassmorphism and Tonal Layering** rather than traditional drop shadows. 

1.  **Base Layer:** Solid `#121212`.
2.  **Surface Layer:** Slate-tinted backgrounds with 40-60% opacity and a 12px backdrop-blur.
3.  **Floating Elements:** Higher transparency (20-30%) with a subtle 1px white inner-border (stroke) at 10% opacity to simulate the edge of glass.

Shadows, where used, should be ultra-soft, large radius, and tinted with a hint of the secondary violet or primary cyan to create an "ambient glow" effect rather than a dark void.

## Shapes

The shape language is **Soft (0.25rem)**, prioritizing a "precision-tooled" look. While 3D printing involves organic shapes, the interface itself should feel like the hardware: rigid, reliable, and expertly assembled. 

Standard components use `rounded-sm`, while large content cards or modal containers use `rounded-lg`. Interactive elements like pills or toggles may use full rounding to distinguish them from structural layout elements.

## Components

### Buttons
Primary buttons utilize a vibrant Cyan fill with dark text. Secondary buttons are "Ghost" style with a 1px Cyan border and backdrop blur.

### Cards
Cards are the primary vehicle for Glassmorphism. They must feature a `1px` top-and-left white border at 15% opacity to catch light, creating a 3D-effect.

### Technical Inputs
Input fields use a dark-slate background with a monospace font for values. Focus states trigger an "outer glow" in Cyan, simulating a laser scanning the field.

### Status Indicators
Filament status and print progress are represented by high-contrast neon accents (Green for success, Orange for active heating). These should always be paired with the technical label font.

### Progress Visuals
Progress bars should use a subtle gradient from `#7C3AED` to `#00E5FF`, representing the transition from raw material to finished product.