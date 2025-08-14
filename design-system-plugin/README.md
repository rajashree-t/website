# Travel Design System Generator

This local Figma plugin creates a complete "Design System" page with foundations and reusable components for a mobile-first AI-powered travel planning app. It uses a 390x844 base frame and 8px spacing.

## Install (Local)
1. Download or clone this folder to your machine.
2. In Figma Desktop: `Menu > Plugins > Development > Import plugin from manifest...`
3. Select the `manifest.json` in this folder.

## Run
- `Menu > Plugins > Development > Travel Design System Generator`
- The plugin will create a page named `Design System` with:
  - Foundations (colors, typography, icon style)
  - Core components (nav bars, buttons, cards, map module, indicators, forms & filters, media, AI modules)
  - A reusable base device frame (390x844)

## Notes
- Fonts used: Poppins (Bold) for headings, Inter (Regular/Medium) for body and captions. Figma will auto-load Google Fonts.
- Icons are rounded with 2px strokes and provided as reusable components.
- Components are named for reuse (e.g., `Button/Primary`, `Card/Destination`).
- All items use Auto Layout with 8px spacing.