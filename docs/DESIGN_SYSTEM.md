# DESIGN_SYSTEM.md — Distilled Editorial System

This document specifies the visual identity and structural rules for `blog.bretmuchoni.dev`, grounded in Impeccable's **Mode: Read** principles.

---

## 1. Aesthetic Identity

* **Concept:** Calm, high-contrast engineering publication.
* **Core Rule:** The reading column stays serene, legible, and uncluttered. Brand identity lives in the quiet frame (restrained 1px borders, monospaced metadata, custom Win95 cursor, and subtle cyan/magenta selection highlights).

---

## 2. Color Palette & Design Tokens

### 2.1 Core Palette
| Token | Hex Value | Role / Usage |
| :--- | :--- | :--- |
| `--canvas-bg` | `#0d0d12` (dark) / `#f9f9fa` (light) | Main canvas base |
| `--surface-bg` | `#14141a` (dark) / `#ffffff` (light) | Inputs, code frames, cards |
| `--text-primary` | `#f4f2e8` (dark) / `#121217` (light) | High-contrast reading text |
| `--text-secondary` | `#9a9aa8` (dark) / `#585866` (light) | Descriptions & body copy |
| `--text-muted` | `#666675` (dark) / `#8c8c9a` (light) | Dates, reading times, parameter labels |
| `--border-color` | `rgba(244, 242, 232, 0.12)` | Subtle 1px structural dividing lines |
| `--accent` | `#00e5ff` (dark) / `#007d8c` (light) | Links, focus outlines, search states |
| `--accent-secondary` | `#ff2e88` | Text selection background |

---

## 3. Typography Hierarchy

* **Headlines & Narrative:** `Space Grotesk` (weights: 400, 600, 700).
* **Code & Telemetry:** `JetBrains Mono` for code snippets, dates, tags, and parameters.
* **Brand Mark:** Clean `B` mark with `Bret Muchoni` brand signature.

### Reading Hierarchy
* Article H1: Space Grotesk Bold, `clamp(2rem, 4vw, 2.75rem)`, high contrast.
* Article H2: Space Grotesk Bold, `1.5rem–1.75rem`.
* Body Paragraphs: Space Grotesk 400, `1rem`, line-height `1.65–1.75`, measure `65–72ch`.
* Code Blocks: JetBrains Mono, `0.875rem`, inside dark code container with copy action.

---

## 4. Craft Floor Directives
* **Selection:** `::selection` highlighted in solid `--accent-secondary` with white contrast.
* **Scrollbar:** Quiet 6px scrollbar styled with `--border-color`.
* **Caret & Focus:** `caret-color: var(--accent)`, `:focus-visible` with 2px offset.
* **No Slop:** No robotic techno-babble, no flashing caution tape, no neon drop-shadow halos, and no fake 3-dot window buttons.
