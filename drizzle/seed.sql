INSERT OR IGNORE INTO posts (
  id, slug, title, description, content, tags, series, featured, draft, pub_date, created_at, updated_at
) VALUES 
(
  'post-01-vibe-coding',
  '01-vibe-coding-with-persistent-context',
  'The Vibe Coder''s Guide: Transforming AI Agents with Persistent Context',
  'Why structured .md files like SECURITY.md, CODE_STYLE.md, and ARCHITECTURE.md turn AI coding tools from chaotic autocomplete into senior pair programmers.',
  '# The Vibe Coder''s Guide to Persistent Context

AI coding models can generate high-velocity boilerplate in seconds, but without persistent, disciplined context, they stumble on project conventions, hallucinate dependencies, and weaken existing security controls.

When building applications—like this very blog operating at `blog.bretmuchoni.dev`—relying solely on chat prompts creates cognitive fatigue. Instead, anchoring your project with structured Markdown documentation establishes persistent ground truth for both humans and AI coding agents.

---

## 1. The Core Context Suite

Rather than overloading an AI agent''s initial prompt with endless instructions, structure your repository with a dedicated `docs/` suite:

```text
my-app/
├── docs/
│   ├── AGENTS.md        # AI agent instructions & pre-flight rules
│   ├── PRD.md           # Product requirements & user stories
│   ├── DESIGN_SYSTEM.md # Visual tokens, palettes, and typography
│   ├── ARCHITECTURE.md  # Framework boundaries & rendering strategy
│   ├── SECURITY.md      # Authentication, secrets & input sanitization
│   ├── CODE_STYLE.md    # Conventions, naming & testing rules
│   ├── DATABASE.md      # Data schemas, models & migration rules
│   └── API.md           # Endpoints, feeds & communication formats
```

Each file has a single, well-defined responsibility.

---

## 2. Why Vibe Coding Needs Guardrails

Consider what happens when an AI assistant encounters a new feature request without project documentation:

1. **Token Inconsistency:** It invents random hex colors instead of adhering to your design system.
2. **Architecture Drift:** It introduces new third-party libraries when built-in utilities already exist.
3. **Security Degradation:** It might bypass server-side validation or expose sensitive environment variables on the client.

---

## 3. Real Example: Enforcing Design System Tokens

```tsx
export function TacticalButton({ label }: { label: string }) {
  return (
    <button className="tactile-btn px-4 py-2 font-mono text-xs uppercase border-2 border-[var(--panel-border-color)]">
      {label}
    </button>
  );
}
```

---

## 4. The Golden Rule of Project Context

> **These files are context, not magic.**

Document the project you *actually have*, not the hypothetical project you once intended to build.',
  '["AI","Architecture","Engineering","NextJs"]',
  'Tactical Workflows',
  1,
  0,
  1793491200,
  strftime('%s', 'now'),
  strftime('%s', 'now')
),
(
  'post-02-tactical-hud',
  '02-tactical-hud-design-system-v2',
  'Tactical HUD v2.2: Blending Pop Art with 90s Anime UI',
  'How we engineered a distinctive web design system combining chamfered panels, Ben-Day halftone dithering, caution tickers, and authentic Win95 cursors.',
  '# Tactical HUD v2.2: Pop Art Meets 90s Anime UI

Most modern developer blogs look identical: interchangeable minimalism, rounded pastel cards, and sterile sans-serif fonts.

For `bretmuchoni.dev` and its companion publication `blog.bretmuchoni.dev`, we wanted something deliberate, tactile, and expressive—a synthesis of late-90s tactical anime terminal HUDs and comic Pop Art.

---

## 1. Core Architectural Pillars

The design system operates on five visual pillars:

1. **Hard Outlines & Chamfered Geometry:** Content sits inside solid 2px borders with 45° corner cuts.
2. **Selective Halftone & Dithering:** Bayer dithering and Ben-Day dots provide tactile micro-textures without cluttering typography.
3. **Restrained High-Chroma Accents:** Acid-yellow is strictly reserved for single-instance status beacons.
4. **Mechanical Motion:** Buttons and cards exhibit low-latency tactile presses.
5. **Authentic Web 1.0 Heritage:** Custom pixel cursors celebrate the tactile era of early web software.

---

## 2. Implementing Chamfered Panels in CSS

```css
.chamfer-panel {
  clip-path: polygon(
    0 0,
    calc(100% - 14px) 0,
    100% 14px,
    100% 100%,
    0 100%
  );
}
```

---

## 3. High-Contrast Accessibility (WCAG AAA)

Despite the bold chromatic palette, all primary text passes WCAG AAA contrast ratios:
- Canvas background: `#0d0d12` (deep void)
- Off-white paper text: `#f4f2e8` (yielding a >15:1 contrast ratio)
- Cyan accents: `#00e5ff` (providing clear focus rings)',
  '["Design","CSS","Architecture","Web"]',
  'Tactical Workflows',
  0,
  0,
  1793318400,
  strftime('%s', 'now'),
  strftime('%s', 'now')
);
