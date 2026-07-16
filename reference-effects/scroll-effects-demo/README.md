# Scroll Effects — Reference Demos

Two effects from the "Scroll Effects" spreadsheet tab, built as standalone,
self-contained files. Not final styling — colors, sizing, and placeholder
images are stand-ins for your real style guide and photos.

## Files

- **parallax-scroll.html** — background layer moves slower than foreground
  text as you scroll. Reusable class: `.parallax-bg`.
- **pixelated-image-entrance.html** — two stacked images (pixelated + clear)
  crossfade into focus as they scroll into view. Reusable class:
  `.pixel-entrance` (trigger class: `.in-view`).
- **images/** — synthetic placeholder photo pair (`photo-clear.jpg` /
  `photo-pixelated.jpg`) used only so the pixelated demo has something real
  to crossfade between. Swap these for your actual sourced images later.

## How to view

Just double-click either `.html` file to open it in a browser — no server
or build step needed. Scroll down to see the effect trigger.

## Status

Not finalized — these are working references to look at and tweak once you
start building the real sections, not drop-in final code.

## reference/ folder — the 6 CodePen sources from your Scroll Effects tab

Each file below opens directly in a browser (double-click) except the
text-scroll one, which needs a Pug/SCSS compiler and is saved as source
notes instead. Every file credits its original CodePen author/URL at the
top — none of these have a stated license, so treat them as learning
material to study and adapt, not to publish verbatim in your final site.

- **3d-spatial-zoom.html** — Adam Argyle. Pure CSS, no JS. Chromium-only
  (native CSS scroll-driven animation).
- **slice-slider.html** — Stephen Scaff. Converted from SCSS to plain CSS;
  uses jQuery (via CDN). Intended for your "if...then..." History beat.
- **scroll-based-animation.html** — johnson5409. Plain HTML/CSS/JS
  (jQuery). Intended for your "people have always dreamed of..." beat.
- **zoom-and-blur-background.html** — zrichard. RECONSTRUCTED — the
  original page came through partially garbled when fetched, so this is
  a faithful rebuild of the same technique, not a byte-exact copy. Worth
  a quick check against the live pen before relying on exact values.
- **css-scroll-subgrid-gallery.html** — Jhey. The most advanced/heaviest
  of the six — native CSS subgrid + scroll-driven animation + a GSAP
  fallback + a debug panel (delete the debug panel before real use).
  Chromium-only for the native scroll-driven part.
- **text-scroll-reveal-SOURCE-NOTES.md** — Ana Tudor. NOT directly
  runnable — original is Pug + SCSS with a generative SVG-filter loop.
  Raw source included with an honest explanation of why it wasn't
  auto-converted; see the file for options going forward.
