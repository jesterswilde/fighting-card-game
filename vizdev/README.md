# Card Lab

Open `vizdev/index.html` directly in your browser. No install, build, server, network, or game backend needed.

Pick any of the 160 cards to compare six directions:

- Xerox riot: bold yellow-and-black photocopied poster.
- Brutalist dojo: cobalt paint, red ink, exposed rebar and concrete.
- Unsanctioned bout: red-and-cream boxing ticket.
- Wheatpaste wall: Xerox headline and cream action paper pasted onto raw concrete.
- Demolition notice: Xerox warning-color stock, reinforcement lines and stamped action blocks.
- Night shift: dark concrete, a fluorescent Xerox title plate and pale action tiles.

Previous/next and Random help explore different card densities. Press `R` to pick a different random card when you are not using a form field. The internal tool uses a compact dark interface without an introductory hero.

Every layout embeds card-level requirement icons in the fighting-style bar, without a visible “Requires” label. Priority remains a small footer detail. Every footer reserves exactly 42 CSS pixels, with or without tags. Conditional requirements remain attached to their mechanics. Original game icons represent states; supplemental inline SVG symbols cover axes without existing icons. Hover or focus a symbol for its complete description. The cursor remains a normal arrow over symbols and tooltips. Target arrows mean ↓ Me, ↑ Them, and ↕ Both; tooltips include those targets. Amounts and effect details remain visible. Escape dismisses the tooltip.

Each card has a styled image placeholder. “Try your artwork” applies a local image to all six versions of the selected card. Artwork stays in this page session, separately per card, and is never uploaded. Clear art restores the placeholder.

The preview preserves the current `cards/*.json` schema: requirements, effects, amounts, targets, effect details, mechanics (including conditions, enhancement tags, and Pick One branches), priority, fighting style, and tags. The source disclosure shows the selected JSON. Every card stays 600 CSS pixels tall. Dense cards reduce artwork height, then tighten spacing and symbol sizes across three fit levels. Fitting runs on selection, font load and resize; rules are not hidden or put in scrolling panels. Xerox’s paper action panel starts lower on simpler cards. These are aesthetic studies, not final print layouts. Textures and ornamental marks use CSS and a local SVG.

`data.js` is a bundled snapshot of the game's card files. To refresh it and the copied original icons after game changes, run from the repository root:

```sh
bun vizdev/sync-data.js
```

Anton Regular and Barlow Condensed Bold are bundled in `assets/fonts/`, with their SIL Open Font License files. They came from the Google Fonts repository (`ofl/anton` and `ofl/barlowcondensed`). No system font installation or remote font request is required.

All preview files and assets live in this folder. Existing game files are unchanged.

## Palettes

All six studies have four named color buttons each. A choice applies to the selected fighting style within that visual direction: another Finesse card inherits the same Xerox palette, for example. Choices remain for the page session and reset on reload. Each scheme coordinates its main color, paper, accent, material surface and deep structural color. Palette buttons preview the main/paper/accent trio, and Wheatpaste uses saturated title stock with a contrasting offset shadow. Colors use local CSS variables and do not tint uploaded artwork.

## Browser layout check

With Chromium installed and Bun, run:

```sh
bun vizdev/check-layout.js
```

The check renders all 160 cards in all six styles at 1440, 1051, 768, 650, 390 and 320px viewport widths (5,760 variants). It checks the 600px card height, horizontal/vertical overflow, requirements and mechanics, palette inheritance and the R shortcut. It writes a detailed report and a screenshot of the complex Targeted Strike card to the operating system’s temporary directory. No test dependencies are needed.

Conditional “If” labels sit in compact diamond or cut-corner badges. Actual tags use contrasting notched chips with a small inset accent. Empty tags add no placeholder, and all card footers now contain only tags and priority.
