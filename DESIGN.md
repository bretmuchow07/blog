---
name: blog-bretmuchoni-dev
description: Distilled Architectural Engineering Publication for Bret Muchoni
colors:
  canvas-dark: "#0b0b0f"
  surface-dark: "#121218"
  surface-elevated: "#181822"
  surface-subtle: "#1c1c28"
  text-primary-dark: "#f4f2e8"
  text-secondary-dark: "#9c9cae"
  text-muted-dark: "#606072"
  canvas-light: "#f7f7f9"
  surface-light: "#ffffff"
  text-primary-light: "#111116"
  text-secondary-light: "#525260"
  accent-cyan: "#00e5ff"
  accent-magenta: "#ff2e88"
  border: "rgba(244, 242, 232, 0.1)"
typography:
  headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.15
  body:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  card-featured:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.text-primary-dark}"
    rounded: "{rounded.lg}"
    padding: "32px"
  card-post:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary-dark}"
    rounded: "{rounded.sm}"
    padding: "24px 0"
  search-input:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.text-primary-dark}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
---

# Design System Specification — Distilled Architectural

## 1. Overview

`blog.bretmuchoni.dev` is an engineering publication designed around **Mode: Read**. It marries structural, architectural restraint with crisp typography and editorial depth. The connection to Bret's engineering work is reflected in intentional details: an architectural masthead, monospaced metadata, subtle hover transitions, themed browser surfaces, and clean responsive layout.

---

## 2. Colors

- **Architectural Void (`#0b0b0f`):** Dark slate-void base for glare-free reading.
- **Surface Elevation (`#121218` & `#181822`):** Subtle background tints for featured spotlight and search.
- **Off-White Paper (`#f4f2e8`):** High-contrast primary reading text.
- **Muted Secondary (`#9c9cae`):** Clear descriptive copy.
- **Muted Label (`#606072`):** Dates, reading times, parameter tags.
- **Electric Cyan Accent (`#00e5ff`):** Applied under the 10% rule for links, focus outlines, and the reading progress bar.
- **Accent Magenta (`#ff2e88`):** Text selection background and author signature touches.

---

## 3. Typography

- **Headlines & Narrative:** `Space Grotesk` (weights 400, 600, 700). High legibility, distinct character, open geometric letterforms.
- **Code & Telemetry:** `JetBrains Mono` for code snippets, dates, tags, and parameters.
- **Reading Measure:** Article body column strictly bounded to 65–72 characters (`max-w-3xl`) with comfortable line height (`1.65–1.75`).

---

## 4. Layout

- Masthead: 2-column architectural balance with bold title, thesis, and author metadata chip.
- Featured Spotlight: Highlights the latest pinned article inside an elevated container.
- Chronological List: Separated by quiet 1px border lines with smooth hover color transitions.
- Sequential Article Navigation: Next & Previous article links at the bottom of each post.

---

## 5. Elevation & Depth

- Restrained planes defined by subtle 1px borders (`border-color`).
- Hover elevation is expressed through color shift (`--accent`) and hairline border brightening (`--border-accent`), never heavy block shadows or noisy glows.

---

## 6. Shapes

- Subtle, disciplined rounding (`rounded-md` / `rounded-lg`).
- Geometric integrity without chaotic cuts.

---

## 7. Components

- **Navbar:** Sticky, frosted header with brand mark, Articles, RSS, Portfolio link, and Theme toggle.
- **Featured Card:** Elevated spotlight container with metadata, arrow link, and topic tags.
- **Search Bar:** Real-time filter input with topic pills and zero visual clutter.
- **Code Frame:** Terminal surface with language indicator and 1-click clipboard copy.
- **Post Navigation:** Previous and Next article cards.

---

## 8. Do's and Don'ts

### Do:
- Keep the reading column quiet, comfortable, and focused on comprehension.
- Use human, dignified copy ("Writing", "Articles", "Read time").
- Maintain WCAG AAA contrast ratios across dark and light modes.

### Don't:
- Never use robotic sci-fi techno-babble ("TRANSMITTING DISPATCHES", "FREQUENCY", "SYS.LOG").
- Never add animated marquees or caution stripes to a reading page.
- Never use thick side-tab borders (`border-l-4`) or neon block shadows.
