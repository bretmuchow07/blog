# AGENTS.md

## 1. Operating Directives for AI Coding Agents

You are acting as an autonomous software engineering agent developing and maintaining **`blog.bretmuchoni.dev`**, the official engineering blog companion to **`bretmuchoni.dev`**.

Before writing or modifying any code in this repository, you must read and adhere to the project context files:

1. **`docs/SECURITY.md`** — Critical security constraints, input validation, and content sanitization.
2. **`docs/CODE_STYLE.md`** — Coding conventions, component structure, TypeScript strictness, and token usage rules.
3. **`docs/DESIGN_SYSTEM.md`** — Visual identity tokens (v2.2 Tactical Anime HUD & Pop Art), typography, and component styling.
4. **`docs/ARCHITECTURE.md`** — Framework boundaries, SSG rendering pipeline, content collections, and routing.
5. **`docs/DATABASE.md`** — Content frontmatter schemas and validation.
6. **`docs/API.md`** — RSS 2.0 feed, sitemap generation, and endpoint specifications.

---

## 2. Inviolable Design & Architecture Constraints

* **Strict Visual Cohesion:** Never introduce soft, generic "modern SaaS" rounded components (`rounded-xl`, generic blur backdrops, soft pastel palettes). All UI elements must use hard borders (`2px solid`), 45-degree chamfers, authentic drop-shadows (`4px 4px 0 var(--magenta)`), or industrial caution stripes.
* **Token Fidelity:** Never hardcode arbitrary hex colors (`#ff00ff`, `#123456`) directly in component styles. All colors, shadows, and textures must use CSS variables declared in `tokens.css` or Tailwind classes mapped to them.
* **Component Boundaries:** Keep Server Components as the default. Client Components (`'use client'`) should be restricted to user-interactive widgets (e.g., `ThemeToggle`, copy buttons, search/filter input).
* **Static Generation First:** Use Static Site Generation (`generateStaticParams`) for article pages to maximize speed, SEO, and reliability.
* **Documentation Synchronization:** If you introduce a new convention, dependency, or schema field, you must update the relevant markdown file in `docs/`.

---

## 3. Pre-Flight Checklist Before Completing Any Task

- [ ] All new components adhere to `docs/DESIGN_SYSTEM.md` and support both Dark Mode and Light Mode.
- [ ] No secrets or personal API tokens are hardcoded.
- [ ] Type checking passes cleanly without `any` escapes (`npm run build` or `tsc --noEmit`).
- [ ] Responsive design verified down to 360px mobile viewport.
- [ ] Reduced motion (`prefers-reduced-motion`) is respected for ticker marquee and panel animations.
