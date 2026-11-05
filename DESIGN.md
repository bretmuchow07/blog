---
name: blog-bretmuchoni-dev
description: Clean architectural design system with controlled accents — personal and technical publication for Bret Muchoni
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
  surface-subtle-light: "#eeeef2"
  text-primary-light: "#111116"
  text-secondary-light: "#525260"
  text-muted-light: "#76768a"
  accent-cyan: "#00e5ff"
  accent-magenta: "#ff2e88"
  accent-yellow: "#f5ff00"
  border: "rgba(244, 242, 232, 0.1)"
  border-accent: "rgba(0, 229, 255, 0.35)"
  grid-dot: "rgba(244, 242, 232, 0.05)"
typography:
  display:
    fontFamily: "Bungee, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.05
    usage: "Site title only"
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
  stamp:
    fontFamily: "Silkscreen, monospace"
    fontSize: "0.65rem"
    fontWeight: 400
    letterSpacing: "0.08em"
    textTransform: "uppercase"
    usage: "Small status badges only (PINNED, NEW, NOTE)"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "64px"
components:
  masthead:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.text-primary-dark}"
    padding: "64px 0 48px"
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
  index-row:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary-dark}"
    padding: "24px 0"
  search-input:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.text-primary-dark}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
  stamp:
    backgroundColor: "transparent"
    textColor: "{colors.accent-cyan}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
---

# Design System Specification — Distilled Architectural

## 1. Overview

`blog.bretmuchoni.dev` is a personal publication designed for comfortable reading. It pairs simple layouts and clear typography with high-contrast text and zero distractions.

The site is organized into two distinct zones:

1. **The reading column is quiet:** Article text, code blocks, and section headings remain calm, legible, and unadorned.
2. **The borders carry visual personality:** Expressive details—such as the site title, post list, footer badges, and navigation bar—feature subtle retro accents in small, controlled amounts.

Decorative accents follow strict rules (Section 9). If a decorative detail is not explicitly approved in this specification, do not add it.

---

## 2. Colors

- **Dark Background (`#0b0b0f`):** Deep dark-slate base for comfortable reading in low light.
- **Card and Surface Layers (`#121218`, `#181822`, `#1c1c28`):** Subtle dark tones for featured cards, search fields, code blocks, and hover states.
- **Primary Text (`#f4f2e8`):** Off-white text that provides high contrast without harsh glare.
- **Secondary Text (`#9c9cae`):** Muted gray for article summaries and descriptive text.
- **Metadata Text (`#606072`):** Darker gray for dates, reading time estimates, row numbers, and tags.
- **Accent Cyan (`#00e5ff`):** Used sparingly (under 10% of the screen) for links, focus outlines, active table-of-contents items, small badges, and the start of the reading progress bar.
- **Accent Magenta (`#ff2e88`):** Used for selected text highlights, author signatures, pull-quote quotation marks, and the end of the reading progress bar.
- **Warning Yellow (`#f5ff00`):** Reserved strictly for warnings and note callouts. Never used for regular text, links, or general decoration.
- **Light Mode:** `#f7f7f9` page background, `#ffffff` card surfaces, and `#111116` body text. Cyan darkens to an accessible teal for text on light backgrounds; bright `#00e5ff` is kept for solid fills and thin borders.

### Topic Dots

Each topic uses a 6px colored dot in article lists, filter buttons, and post headers. Colors come only from the cyan and magenta accent family. The dot always accompanies a written text label; it never replaces text.

---

## 3. Typography

- **Display:** `Bungee`, used only for the main site title in the header and nowhere else.
- **Headings and Body Text:** `Space Grotesk` (weights 400, 600, 700). Clear, open geometric lettering for easy reading.
- **Code and Post Details:** `JetBrains Mono` for code snippets, dates, tags, row numbers, table of contents items, and technical values.
- **Status Badges:** `Silkscreen`, uppercase and small, used only for short tags like `PINNED` or `NEW`.
- **Line Length and Spacing:** Article text is limited to 65–72 characters per line (`max-w-3xl`) with comfortable line height (`1.65–1.75`).

---

## 4. Layout

- **Header:** A single left-aligned section with the Bungee site title and a one-line description below it in Space Grotesk. No profile photo or author badge. The background features a faint dot grid (`grid-dot`, ~5% opacity, 24px spacing) that gently fades out toward the bottom.
- **Featured Post:** The latest pinned article sits in a subtly highlighted card with a `PINNED` badge.
- **Article List:** Chronological rows separated by thin 1px lines (see Section 7).
- **Article Page:** A centered single-column reading layout. On desktop screens (1200px and wider), a fixed table of contents sits in the right margin.
- **Next and Previous Navigation:** Simple cards at the bottom of each article linking to the previous and next posts.
- **Footer:** A short colophon line and a row of retro badges (see Section 7).

---

## 5. Visual Hierarchy and Depth

- Cards and surfaces are separated by thin 1px borders (`border`), never heavy drop shadows.
- Hover states use a color change to accent cyan and a brighter 1px border (`border-accent`).
- Do not use glowing borders, multi-layer shadows, or comic-book offset shadows.

---

## 6. Shapes and Corners

- Use clean rectangular shapes with subtle rounded corners: 4px (`rounded-sm`) for badges and input fields; 6px to 8px (`rounded-md` / `rounded-lg`) for cards and code containers.
- Avoid angled cuts, clipped corners, or irregular shapes.

---

## 7. Components

### Navigation and Frame

- **Top Navigation Bar:** Fixed header with a subtle blur effect containing the site logo, Articles link, RSS feed link, Portfolio link, and theme toggle. Directly below the header, a 1–2px progress line transitions from cyan to magenta as the reader scrolls through an article.
- **Focus Rings:** A clear 2px cyan outline with a 2px offset on all interactive buttons, links, and inputs.
- **Cursor:** A retro pixel arrow cursor is used on clickable links, buttons, and toggles only. Body text always keeps the standard text-selection cursor.

### Article List and Search

- **Article Row:** A muted number on the left (`01`, `02`, etc.), followed by the article title in medium weight, a one-line summary, and a details line (`date · read time · topic`) with the topic dot. On hover, the title moves slightly to the right (4px), the number turns cyan, and an arrow appears on the right. Transitions are fast (200ms or less) and respect reduced-motion settings.
- **Featured Card:** A highlighted box with article details, an arrow link, topic tags, and a `PINNED` badge.
- **Search Bar:** A live filter input with clickable topic buttons (colored dot plus topic name), free of clutter.

### Status Badges

- **Small Badges:** A compact label in Silkscreen font inside a 1px cyan box with 4px rounded corners. Allowed values: `PINNED`, `NEW` (posts published within the last 14 days), `NOTE`, and `DRAFT`. Maximum of one badge per row or card.

### Article Page

- **Article Details:** A single monospaced line directly beneath the headline: `date · read time · topic`.
- **Pull Quotes:** A large magenta opening quotation mark above the quote, set in italic Space Grotesk. No vertical side borders.
- **Heading Links:** A subtle `#` symbol appears next to headings on hover, turning cyan when selected.
- **Code Blocks:** A dark container showing the file name, programming language, and a one-click copy button. Monospaced text on a slightly lighter surface with a 1px border.
- **Table of Contents:** A fixed monospaced menu in the right margin on desktop screens (1200px and wider). Highlights the active section in cyan and keeps other sections muted. Hidden on smaller screens.
- **Next and Previous Cards:** Navigation links at the end of each post displaying the title and date.

### Footer

- **Colophon:** A single short line explaining the site setup, such as: "Static. No trackers. RSS-first."
- **Badge Row:** Small, classic web badges (like 88×31 pixel buttons) for RSS, Next.js, and theme mode, with flat colors and 1px borders.

---

## 8. Guidelines and Rules

### What to Do

- Keep the reading area calm, comfortable, and easy to read.
- Use plain, natural language for labels ("Writing", "Articles", "Reading time").
- Ensure all reading text meets high accessibility contrast standards (WCAG AAA) in both dark and light modes.
- Limit decorative accents to the header, post list, footer, and navigation bar.
- Keep all animations subtle, quick, and optional (always respect `prefers-reduced-motion`).

### What to Avoid

- Do not use sci-fi jargon, technical clichés, or simulated terminal chatter ("TRANSMITTING DISPATCHES", "FREQUENCY", "SYS.LOG").
- Do not use scrolling text banners, warning stripes, or scanline overlays on reading pages.
- Do not use thick colored side borders (`border-l-4`) or heavy glowing shadows.
- Do not use decorative display fonts (Bungee or Silkscreen) for body paragraphs, article headings, or code.
- Do not use bright yellow outside of warning callouts and notes.
- Do not apply custom pixel cursors over body text.
- Do not add decorative elements that are not defined in the Accent Limits table below.

---

## 9. Accent Limits

Decorative details have strict boundaries so the site remains easy to read.

| Area | Allowed Elements | Limit |
|---|---|---|
| **Header** | Bungee title font, one-line summary, subtle dot grid | Most expressive area; appears only on the home page |
| **Article List** | Monospaced row numbers, subtle hover shift with arrow, topic dots, status badges | At most one badge per row; animations 200ms or faster |
| **Navigation Bar** | Gradient scroll-progress line, pixel cursor on clickable items, frosted background | Progress line is 1–2px thick; no extra animations |
| **Footer** | Single summary line, small retro web badges | Safe location for subtle retro touches |
| **Article Header** | Monospaced date and read time, topic dot | No decorative images or complex badges |
| **Article Body** | Magenta quotation mark for pull quotes, hover link anchors, code blocks with file tabs | Clean text; at most one pull quote per 800 words |
| **Right Margin** | Fixed monospaced table of contents | Desktop only; never overlaps the article text |

**The rule:** If a decorative detail appears in the header, post list, footer, or navigation bar, it is allowed within limits. If it interferes with the reading column, remove it.
