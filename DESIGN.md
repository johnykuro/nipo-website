---
version: alpha
name: NIPO
description: "Precision After Dark: a refined Japanese-Brazilian hospitality system shaped by craft, fire, and nightfall."
colors:
  primary: "#15231F"
  premium-gold: "#F0E098"
  blossom-red: "#B02028"
  warm-ivory: "#F7F1DE"
  dark-bamboo: "#241E1C"
  muted-sage: "#8F9B7A"
  deep-teal: "#0A5552"
typography:
  display-xl:
    fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif'
    fontSize: 72px
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: -0.02em
  display-lg:
    fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif'
    fontSize: 56px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif'
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: -0.01em
  headline-md:
    fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif'
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: -0.005em
  title-lg:
    fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif'
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0em
  body-lg:
    fontFamily: '"Gotham", "Avenir Next", "Helvetica Neue", Arial, sans-serif'
    fontSize: 18px
    fontWeight: 300
    lineHeight: 1.65
    letterSpacing: 0em
  body-md:
    fontFamily: '"Gotham", "Avenir Next", "Helvetica Neue", Arial, sans-serif'
    fontSize: 16px
    fontWeight: 300
    lineHeight: 1.65
    letterSpacing: 0em
  body-sm:
    fontFamily: '"Gotham", "Avenir Next", "Helvetica Neue", Arial, sans-serif'
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  label-md:
    fontFamily: '"Gotham", "Avenir Next", "Helvetica Neue", Arial, sans-serif'
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.3em
  label-sm:
    fontFamily: '"Gotham", "Avenir Next", "Helvetica Neue", Arial, sans-serif'
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.22em
rounded:
  none: 0px
  control: 2px
  soft: 8px
  pill: 999px
spacing:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  6: 24px
  8: 32px
  12: 48px
  16: 64px
  24: 96px
  32: 128px
  gutter-mobile: 20px
  gutter-tablet: 32px
  gutter-desktop: 48px
components:
  button-primary-dark:
    backgroundColor: "{colors.warm-ivory}"
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
    height: 44px
  button-primary-light:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.warm-ivory}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
    height: 44px
  button-secondary-dark:
    backgroundColor: transparent
    textColor: "{colors.warm-ivory}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
    height: 44px
  link-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.premium-gold}"
    typography: "{typography.body-sm}"
  link-light:
    backgroundColor: "{colors.warm-ivory}"
    textColor: "{colors.deep-teal}"
    typography: "{typography.body-sm}"
  chip-botanical:
    backgroundColor: "{colors.muted-sage}"
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.pill}"
    padding: "8px 12px"
  feature-card:
    backgroundColor: "{colors.dark-bamboo}"
    textColor: "{colors.warm-ivory}"
    typography: "{typography.title-lg}"
    rounded: "{rounded.none}"
  notice-success:
    backgroundColor: "{colors.deep-teal}"
    textColor: "{colors.warm-ivory}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.control}"
    padding: 16px
  notice-warning:
    backgroundColor: "{colors.premium-gold}"
    textColor: "{colors.primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.control}"
    padding: 16px
  notice-error:
    backgroundColor: "{colors.blossom-red}"
    textColor: "{colors.warm-ivory}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.control}"
    padding: 16px
---

# NIPO Design System

## Overview

**Creative North Star: "Precision After Dark"**

NIPO is a premium Japanese-Brazilian restaurant on Newcastle Quayside. Its digital world combines Japanese discipline, balance, and craft with Brazilian fire, generosity, and warmth. Interfaces should feel like entering a considered dining room at night: immersive but controlled, botanical but never tropical, dramatic but never gimmicky.

The design is image-led and editorial. Deep Green Black creates the evening atmosphere, Warm Ivory creates breath, and Premium Gold appears as a precise glint. Spacious typography, thin rules, and quiet interaction states keep the experience refined. Full-bleed imagery and cinematic overlays may create immersion, but content remains legible and navigation remains sparse.

The approved NIPO brand guidelines and Brand DNA are authoritative. The supplied SVG logos are fixed approved artwork and must remain unchanged, even where their embedded colours differ slightly from the normative palette below. Amazónico is a structural reference for image-led pacing and atmosphere only; its jungle spectacle, tropical motifs, bright greens, animated fauna, and red/orange dominance are not NIPO.

**Key characteristics**

- Refined, warm, atmospheric, confident, premium, textured, botanical, and culturally grounded.
- Social but not loud. Dramatic but not gimmicky.
- Customer-facing restaurant websites and mobile experiences only.
- Concise copy, generous space, cinematic imagery, and restrained interaction.
- Japanese-Brazilian heritage expressed with care and credibility, never costume or novelty.

## Colors

Nightfall leads. The palette uses Deep Green Black as its foundation, with Warm Ivory for readable space, Premium Gold for precision, Dark Bamboo for depth, botanical greens for support, and Blossom Red held in reserve.

### Core palette

- **NIPO Deep Green Black, Primary (`#15231F`):** Main brand backdrop, navigation, dark sections, image overlays, and primary controls on light surfaces.
- **Premium Gold (`#F0E098`):** Wordmark context, fine rules, icons, section labels, and small premium details. It should glint, not become a large decorative fill.
- **Deep Blossom Red (`#B02028`):** Logo blossom, small artwork highlights, and compact semantic errors. Never use it for large backgrounds, general buttons, price callouts, or campaign blocks.
- **Warm Ivory (`#F7F1DE`):** Light sections, paper-like panels, body space, and primary controls on dark surfaces.
- **Dark Bamboo (`#241E1C`):** Secondary dark surface, footer depth, and warm image-overlay support.
- **Muted Sage (`#8F9B7A`):** Botanical support, selected chips, quiet labels, and subtle pattern details.
- **Deep Teal (`#0A5552`):** Alternative botanical accent, links on ivory, success states, and focus treatment on light surfaces.

### Balance

Use the brand guideline proportions as an overall composition target, not a per-component formula: approximately 50% Deep Green Black, 20% Warm Ivory, 15% Premium Gold detail, 7% Dark Bamboo, 5% controlled Blossom Red, and 3% Sage or Teal.

### Accessible pairings

- Use Warm Ivory on Deep Green Black, Premium Gold on Deep Green Black, and Deep Green Black on Warm Ivory for primary reading.
- Use Warm Ivory on Deep Teal for success messages and Deep Green Black on Premium Gold for warnings.
- Use Warm Ivory on Blossom Red only for compact semantic errors.
- Never set Deep Green Black text on Blossom Red; the contrast is approximately 2.39:1.
- Never use small Premium Gold text on Warm Ivory. Use Deep Green Black or Deep Teal instead.

**The Nightfall Leads Rule.** When a composition loses its NIPO identity, restore Deep Green Black first and remove red first.

**The Gold Glints Rule.** Gold is a line, label, icon, or moment of emphasis. It is not a default surface.

## Typography

**Display font:** Playfair Display, with Georgia and Times New Roman fallbacks.

**Supporting font:** Gotham, with Avenir Next, Helvetica Neue, Arial, and system sans-serif fallbacks.

Playfair Display carries elegance, appetite, and editorial presence. Gotham provides modern discipline and legibility. The NIPO wordmark is fixed artwork and must never be retyped.

### Hierarchy

- **Display XL:** Playfair Display Regular, 72px/0.98, used only for high-impact desktop hero statements.
- **Display LG:** Playfair Display Regular, 56px/1, used for desktop section openings.
- **Headline LG:** Playfair Display Medium, 40px/1.08, used for major content headings.
- **Headline MD:** Playfair Display Medium, 32px/1.12, used for cards and mobile section openings.
- **Title LG:** Playfair Display Medium, 24px/1.2, used for dish names and feature titles.
- **Body LG:** Gotham Light, 18px/1.65, used for short editorial introductions.
- **Body MD:** Gotham Light, 16px/1.65, used for primary body copy.
- **Body SM:** Gotham Book, 14px/1.55, used for supporting details and form help.
- **Label MD:** Gotham Medium, 12px/1.2, uppercase with `0.3em` tracking, used sparingly for navigation and major labels.
- **Label SM:** Gotham Medium, 11px/1.2, uppercase with `0.22em` tracking, used for buttons, tags, and metadata.

On screens narrower than 768px, use 48px for Display XL, 40px for Display LG, 34px for Headline LG, 28px for Headline MD, and keep body text at a minimum of 16px for sustained reading. Keep body lines between 55 and 72 characters.

Expected local WOFF2 files live under `assets/fonts/`: Gotham Light, Book, and Medium plus Playfair Display Regular, Medium, and Bold. Interfaces must remain usable with the documented fallbacks until the licensed files are present.

**The Two Voices Rule.** Playfair speaks for appetite and story. Gotham speaks for action and detail. Do not add a third typeface.

## Layout

NIPO uses an editorial grid with full-bleed exceptions for heroes and photography. Content should feel composed rather than uniformly boxed.

### Responsive grid

- **Mobile, below 768px:** 4 columns, 20px outer gutters, 12px internal gaps.
- **Tablet, 768px to 1099px:** 8 columns, 32px outer gutters, 20px internal gaps.
- **Desktop, 1100px and above:** 12 columns, 48px outer gutters, 24px internal gaps.
- **Content maximum:** 1440px for structured content. Heroes, photographs, and tonal bands may extend edge to edge.

Use the 4px spacing foundation. Common component spacing is 8, 12, 16, 24, and 32px. Major section rhythm is 64px on mobile, 96px on tablet, and 128px on desktop.

Prefer asymmetric editorial splits such as 5/7 or 4/8 columns. Allow imagery to carry more visual weight than copy. Avoid filling every grid cell or placing every section in an identical container.

### Image treatment

- Use a minimum 70vh desktop hero and a minimum 60vh mobile hero when photography is the opening experience.
- Use `16:10` for wide editorial features, `4:5` for portrait cards, and `1:1` for food or cocktail details.
- Apply dark overlays only as strongly as needed for legibility. Keep focal subjects clear.
- Prefer warm, low-light photography with craft, fire, hands, brass, bamboo, intimate tables, and deep green-black surroundings.

## Elevation & Depth

NIPO is flat by default. Depth comes from tonal layers, full-bleed photography, controlled overlays, thin rules, and changes in scale rather than decorative shadows.

- Use Deep Green Black, Warm Ivory, and Dark Bamboo as distinct environmental layers.
- Use 1px gold, sage, or low-opacity ivory rules to structure dense information.
- Do not add default shadows to cards, fields, buttons, or navigation.
- A temporary shadow may be used only when platform behavior requires spatial separation, such as a floating mobile navigation panel. Keep it diffuse and nearly black.
- Hover states may shift colour, reveal a fine rule, or move by no more than 2px. Never use bounce or elastic motion.

Motion uses `180ms` for controls and `320ms` for larger transitions with `cubic-bezier(0.16, 1, 0.3, 1)`. Under `prefers-reduced-motion: reduce`, remove transforms and non-essential transitions.

**The Tonal Depth Rule.** Change colour, image density, or scale before reaching for a shadow.

## Shapes

The shape language is precise and architectural.

- **0px:** Image frames, editorial cards, menu rows, dividers, and large content regions.
- **2px:** Buttons, inputs, notices, and standard controls.
- **8px:** Rare soft supporting surfaces such as a compact informational inset. Never use it for every container.
- **999px:** Compact chips only. Do not turn standard buttons or cards into pills.
- Use thin 1px borders. Avoid thick decorative outlines or coloured side stripes.

Logo clearspace is the height of the blossom mark on every side. Minimum stacked-lockup width is 120px digitally, dropping the tagline below 160px. The mark alone may be used from 32px.

## Components

### Buttons

- **Booking buttons:** Use the approved wordmark artwork's gold (`#F6DF98`) with Deep Green Black text, including the header, mobile menu and main hero CTA. Label the hero CTA “Book a table” and omit decorative diagonal arrows. Pair it with a transparent “View menus” button with a Warm Ivory border and text, inverting to an ivory fill on hover. Place the buttons side by side on desktop and stack them on mobile, with the scroll prompt and SVG arrow below the pair.
- **Primary on dark:** Warm Ivory fill, Deep Green Black text, 44px minimum height, 12px by 24px padding, 2px radius.
- **Primary on light:** Deep Green Black fill with Warm Ivory text using the same dimensions.
- **Secondary:** Transparent with a 1px contextual border. Use Warm Ivory or Premium Gold on dark surfaces and Deep Green Black on light surfaces.
- **Hover:** Invert or shift to a closely related tonal surface; translate vertically by no more than 2px.
- **Focus:** Use a 2px Premium Gold outline on dark surfaces and a 2px Deep Teal outline on light surfaces, offset by 3px.
- **Disabled:** Reduce contrast without dropping below legibility requirements and remove motion. Do not communicate disabled state through opacity alone.
- **Loading:** Preserve width, retain the label for assistive technology, and show a restrained rotating line indicator unless reduced motion is requested.

### Navigation

- Keep desktop navigation sparse, horizontally composed, and set in tracked Gotham labels.
- Navigation may overlay a hero only when every item retains strong contrast.
- Use a solid Deep Green Black full-screen panel for mobile navigation.
- Give every interactive target at least 44px by 44px of usable area.
- Keep Reservations visually distinct with the primary inverse treatment, not Blossom Red.

### Links

- Use Premium Gold or Warm Ivory on dark surfaces and Deep Teal or Deep Green Black on Warm Ivory.
- Inline links retain a visible underline with a comfortable offset.
- Hover may change the underline colour or thickness. Focus always uses an explicit outline.

### Menu lists

- Build menus from typographic rows, not boxed cards.
- Use Playfair for dish names, Gotham for descriptions, and tabular-aligned prices.
- Separate groups with whitespace and thin rules. Keep dietary labels concise and adjacent to the relevant dish.

### Feature cards

- Use edge-to-edge media with a controlled bottom overlay.
- Place a Playfair title over the calmest portion of the image and keep metadata concise.
- Use square corners and no shadow.
- On touch devices, keep essential information visible without hover.

### Forms

- Use persistent Gotham labels above controls.
- Simple text and email fields may use an editorial underline. Selects, textareas, and grouped controls use a complete 1px border.
- Set controls to at least 44px high with 16px minimum input text on mobile.
- Use Deep Teal focus treatment on light surfaces and Premium Gold on dark surfaces.
- Place help and error text immediately below the related field. Never rely on colour alone.

### Chips and tabs

- Use pills only for compact chips. Tabs remain rectilinear and use a fine underline or border for selection.
- Muted Sage with Deep Green Black is the preferred botanical chip treatment.
- Blossom Red is not a selected-state default.

### Feedback

- **Success:** Deep Teal background with Warm Ivory text.
- **Warning:** Premium Gold background with Deep Green Black text.
- **Error:** Deep Blossom Red background with Warm Ivory text, kept compact.
- Add a clear text label and, where useful, a simple line icon. Do not rely on colour alone.

### Footer

- Use Warm Ivory for editorial information or Dark Bamboo for an evening close.
- Keep columns sparse, links underlined on focus, and the blossom mark small.
- Avoid dense logo walls unless they represent a real group relationship.

## Do's and Don'ts

### Do

- **Do** lead with Deep Green Black and use Warm Ivory to create breathing room.
- **Do** use Premium Gold as precise detail and controlled emphasis.
- **Do** use image-led editorial pacing, asymmetric layouts, and full-bleed hospitality photography.
- **Do** show sushi craft, robata fire, picanha, hands at work, intimate dining, brass, bamboo, and warm low light.
- **Do** keep interactions calm, keyboard accessible, and compliant with WCAG 2.2 AA.
- **Do** describe NIPO as Japanese-Brazilian and reference Nipo-Brasileiro heritage with care.
- **Do** have every Japanese character checked by a fluent Japanese speaker before production.
- **Do** preserve the supplied logo artwork, clearspace, proportions, and approved backgrounds.

### Don't

- **Don't** present NIPO as a steakhouse or generic Brazilian-and-Japanese fusion.
- **Don't** make NIPO look or sound like "Rio downstairs." It is a sibling to Rio, not a sub-brand.
- **Don't** use red-heavy compositions, large red fields, red buttons, or Rio-style campaign blocks.
- **Don't** use tropical carnival imagery, bright white sushi-bar photography, loud party scenes, buffet cues, or generic steakhouse shots.
- **Don't** copy Amazónico's jungle spectacle, animated fauna, bright greens, tropical motifs, or orange-red dominance.
- **Don't** use novelty Japanese fonts, distressed fonts, tropical display faces, or playful type.
- **Don't** rotate, stretch, recolour, rebuild, decorate, shadow, or place the logo on busy photography.
- **Don't** use blossom-pink outside supplied artwork; it is not a brand colour.
- **Don't** use heavy shadows, glassmorphism, gradient text, decorative side stripes, or repetitive identical card grids.
- **Don't** hide essential content behind hover or motion.
