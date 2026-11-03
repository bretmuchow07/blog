# CODE_STYLE.md — Coding Standards & Conventions

## 1. Stack & Tooling

* **Framework:** Next.js (App Router)
* **Language:** TypeScript 5+ (Strict Mode)
* **Styling:** CSS Variables (Modular Tokens) + Tailwind CSS (mapped to tokens)
* **Linting & Formatting:** ESLint with Next.js rules + Prettier

---

## 2. Naming Conventions

* **React Components:** PascalCase (e.g., `PostCard.tsx`, `HudNavbar.tsx`, `TacticalTicker.tsx`).
* **Utility Functions & Hooks:** camelCase (e.g., `getAllPosts()`, `useReadingProgress()`).
* **Types and Interfaces:** PascalCase (e.g., `PostMetadata`, `TagCount`).
* **Constants:** UPPER_SNAKE_CASE (e.g., `SITE_URL`, `POSTS_PER_PAGE`).
* **Content Files:** kebab-case prefixed with numerical or date ordering (e.g., `01-tactical-hud-design.mdx`).

---

## 3. Component Architecture

* **Default to Server Components:** Only add `'use client'` at the top of a file when hooks (`useState`, `useEffect`, `usePathname`) or DOM browser APIs are required.
* **Token Fidelity:** Always use design tokens for colors, shadows, and fonts:
  ```tsx
  // Good:
  <div className="border-2 border-[var(--paper)] shadow-[var(--hard-shadow)]" />
  
  // Avoid:
  <div className="border-2 border-[#f4f2e8] shadow-[4px_4px_0_#ff2e88]" />
  ```
* **Props Typing:** Always define explicit interfaces for component props:
  ```tsx
  interface PostCardProps {
    post: Post;
    index: number;
  }
  ```

---

## 4. Code Quality Checklist Before Committing

- [ ] Run `npm run build` to verify type checking and static generation pass with 0 errors.
- [ ] Run `npm run lint` to confirm zero linting warnings.
- [ ] Verify that dark mode and light mode both render cleanly without contrast issues.
- [ ] Remove unused imports, console logs, and dead code.
