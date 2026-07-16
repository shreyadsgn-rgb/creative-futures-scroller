# PRD: AI Training Data & Bias — Scrolling Website Prototype
**Project:** MACSD / OurWorlds AI Literacy Curriculum  
**Owner:** Shreya, Director of Learning Experience  
**Output:** Single HTML file, self-contained  
**Purpose:** Typography + scroll interaction exploration tool for a scrolling narrative website on AI training data, bias, and data center community impact

---

## 1. Overview

A single-page HTML prototype that lets the designer rapidly evaluate:
1. **Five scroll interaction styles** (switched via top tab bar)
2. **Typography combinations** (per-role dropdowns in a persistent control bar)

Content is placeholder-level: real headers and stat callouts, lorem ipsum for body text, labeled gray boxes for images/charts. No backend, no build step — opens directly in a browser.

---

## 2. Narrative Structure

The prototype contains **8 sections** in sequence. Every scroll theme renders all 8 sections.

| # | Section ID | Header (real copy) | Visual Placeholder |
|---|---|---|---|
| 1 | `intro` | "Did AI catch you off guard?" | Animated text only |
| 2 | `history` | "It's been in the making since 1956" | Horizontal scroll strip — 4 cards labeled [Timeline Card 1–4] with year labels (1956 / 1988 / 2012 / 2017) |
| 3 | `internet` | "The internet solved the data problem" | [Training Data Visualization Placeholder] + [CAPTCHA Visual] |
| 4 | `bias-data` | "But the internet doesn't represent all of humanity" | [Pictograph — Gender in Training Data] + [Language Breakdown Chart] |
| 5 | `bias-output` | "So AI models inherit those blind spots" | Horizontal scroll strip — 3 cards labeled [Bias Example 1–3] |
| 6 | `not-invisible` | "AI is not invisible — it needs data centers" | [Energy Comparison Visual] + [Water Usage Visual] |
| 7 | `communities` | "And those data centers don't appear in empty fields" | [Map Placeholder — Data Centers + Tribal Lands] + Horizontal scroll strip — 4 cards labeled [Community Photo 1–4] |
| 8 | `reflection` | "So — where do you want to create?" | 3 large reflection questions, no visuals |

Each section has:
- **Eyebrow label** (e.g. "SECTION 03 — BIAS IN DATA")
- **Big type headline** (real copy as above)
- **Subtitle** (one real sentence of context)
- **Body** (2–3 sentences of lorem ipsum)
- **Visual placeholder** (gray box with label, aspect ratio appropriate to content type)
- **Stat callout** where applicable (e.g. "66% of completions mentioned violence" — real stat, large display treatment)

---

## 3. Scroll Themes (Tabs)

Five tabs sit in a fixed bar at the top of the page. Switching tabs re-renders the scroll behavior without reloading content. Active tab is highlighted in teal.

### Theme 1 — Sticky World
**Concept:** Background is fixed and persistent. Content panels scroll up over it like windows opening onto the same dark space. The background has a subtle teal dot-matrix grid that never moves.  
**Mechanic:** `position: fixed` background layer. Content panels are `position: relative`, scroll naturally. Each panel has slight opacity fade-in on entry via IntersectionObserver.  
**Inspired by:** Democracy / voting piece (image 1)

### Theme 2 — Cinematic Parallax  
**Concept:** Full-bleed section backgrounds (dark graphic placeholders with teal gradient overlays) move at 60% of scroll speed. Text enters from left or right depending on section. Feels like moving through a film.  
**Mechanic:** CSS `background-attachment: fixed` per section + `transform: translateX` on text triggered by scroll position.  
**Inspired by:** BMW Annual Report (image 2)

### Theme 3 — Scale Ruler  
**Concept:** Persistent horizontal ruler bar at the bottom of the viewport showing section progress (not a year timeline — a proportional scale bar that fills left to right). Content is centered, sparse, large type. Very little decoration. The scale bar is the signature.  
**Mechanic:** Fixed bottom bar updates width % based on `scrollY / documentHeight`. Sections fade in centered. Stat callouts are the visual focal points.  
**Inspired by:** JoshWorth solar system scale (image 4)

### Theme 4 — Into the Screen  
**Concept:** Content items start at ~20% size in the center of the screen and zoom toward the viewer as they scroll into focus, then recede as they scroll past. Feels like flying through data. Most effective for stat callouts and single-idea sections.  
**Mechanic:** Each section element gets a CSS scale transform driven by its IntersectionObserver ratio — `scale(0.2 + ratio * 0.8)` and `opacity(ratio)`. Horizontal scroll sections use standard strip behavior within this theme.  
**Inspired by:** original brief description ("words coming at you from the distant center")

### Theme 5 — Horizontal Chapters  
**Concept:** Vertical scroll is the primary motion. When the reader reaches a multi-item section (History, Bias Examples, Community Photos), the page locks vertical scroll and drives a horizontal track instead until all cards in that section have passed. Then releases back to vertical.  
**Mechanic:** Scroll-jacking only within designated horizontal sections. Uses a sentinel div to detect entry, then captures `wheel` and `touchmove` events to translate a horizontal container. Progress indicator (small dots) shows position within horizontal track.  
**Inspired by:** brief description of "horizontal sections for history and photo sets"

---

## 4. Typography Control Bar

A fixed panel at the **bottom** of the viewport, always visible. Collapsed to a single row; expands on click to show all controls.

Four independent dropdowns, one per type role:

| Role | Applied To | Options |
|---|---|---|
| **Display font** | Section headlines | Poppins / Rajdhani / Playfair Display |
| **Display size** | Section headlines | 48px / 64px / 80px / 96px |
| **Subtitle font** | Eyebrow + subtitle line | Poppins / Rajdhani / monospace (system) |
| **Subtitle size** | Eyebrow + subtitle | 14px / 16px / 18px |
| **Body font** | Lorem body text | Poppins / Rajdhani / system-ui |
| **Body size** | Body paragraphs | 14px / 16px / 18px |
| **Stat callout font** | Large stat numbers | Poppins / Rajdhani / monospace (system) |
| **Stat callout size** | Large stat numbers | 64px / 80px / 112px |

Fonts load from Google Fonts (Poppins, Rajdhani, Playfair Display). Changes apply instantly via CSS custom properties updated by JS.

Control bar has a small label: "TYPOGRAPHY CONTROLS" in teal monospace. Collapsed state shows only a `▲ TYPE` toggle button so it doesn't obscure content during scroll evaluation.

---

## 5. Visual Style

### Color
| Token | Value | Use |
|---|---|---|
| `--bg` | `#050a0a` | Page background |
| `--teal` | `#0899A9` | Accents, active states, stat callouts, grid |
| `--teal-dim` | `#0899A930` | Subtle backgrounds, borders |
| `--white` | `#F8F6F3` | Body text |
| `--gray` | `#9DA8A9` | Eyebrow labels, captions |
| `--placeholder` | `#21262A` | Image/chart placeholder boxes |

### "AI Themed" Texture
- Dot matrix grid on background (teal, 1px dots, 24px grid, 8% opacity) — CSS `radial-gradient` background pattern, no image file needed
- Stat callouts have a faint teal glow: `text-shadow: 0 0 40px #0899A960`
- Section dividers are single-pixel teal lines
- Placeholder boxes have a dashed teal border and centered label in monospace gray

### Horizontal Scroll Strips
- Cards are `280px wide × 380px tall` on desktop
- Container is `overflow-x: auto` with `scroll-snap-type: x mandatory`
- Each card snaps to position
- Visible overflow on right edge signals scrollability
- Cards have `[LABEL]` in center + section identifier in top-left corner

---

## 6. Interactions & Animation

| Interaction | Behavior |
|---|---|
| Section entry | Fade in + 20px upward translate, 0.5s ease, triggered by IntersectionObserver at 20% threshold |
| Stat callout | Counts up from 0 to value over 1.2s when entering viewport |
| Horizontal strip (Themes 1–4) | Standard CSS scroll snap, drag/swipe |
| Horizontal strip (Theme 5) | Scroll-jacked: wheel events drive horizontal translation |
| Tab switch | Instant re-class on `<body>`, CSS handles the rest — no page reload |
| Typography change | Instant via CSS custom property update |
| Reduced motion | All transitions skipped if `prefers-reduced-motion: reduce` |

---

## 7. File Structure

Single file: `ai-scroll-prototype.html`

Internal organization:
```
<head>
  Google Fonts import (Poppins, Rajdhani, Playfair Display)
  <style> — all CSS, organized by:
    1. CSS custom properties (colors, fonts, sizes)
    2. Base reset + layout
    3. Section structure (shared across themes)
    4. Theme 1–5 overrides (scoped to body[data-theme="1"] etc.)
    5. Horizontal scroll strip
    6. Typography control bar
    7. Stat callout + counter animation
</style>
</head>

<body data-theme="1">
  <!-- Tab bar (fixed top) -->
  <!-- Sections 1–8 -->
    <!-- Each: eyebrow, headline, subtitle, body, visual placeholder(s), stat callout -->
    <!-- Sections 2, 5, 7 include horizontal scroll strips -->
  <!-- Typography control bar (fixed bottom) -->
  
  <script>
    // Tab switching
    // IntersectionObserver for fade-ins + stat counters
    // Theme 5 scroll-jack logic
    // Typography dropdown handlers
  </script>
</body>
```

---

## 8. Scope Boundaries (what this prototype does NOT do)

- No real images or charts — all placeholders
- No mobile optimization (desktop-first for prototype evaluation)
- No real map visualization
- No animation of the dot-matrix background (static texture only)
- No routing or deep-linking between themes
- Fonts rely on Google Fonts CDN — requires internet connection

---

## 9. Success Criteria

The prototype is successful if Shreya can:
1. Scroll through all 8 sections in each of the 5 themes and feel a meaningfully different experience between them
2. Change any typography role and immediately see the result across all sections
3. Identify which 1–2 scroll themes to carry forward into real development
4. Identify a preferred type combination to carry into the real site
