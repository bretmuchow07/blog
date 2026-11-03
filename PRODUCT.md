# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Curious minds, peers, technologists, designers, and readers seeking authentic essays, notes, and ideas across software, architecture, culture, design, and life.

## Product Purpose

`blog.bretmuchoni.dev` exists as Bret Muchoni's autonomous, versatile personal publication and digital garden companion to `bretmuchoni.dev`. It is not limited to engineering notes—it serves as an open medium to publish across any subject of interest (systems engineering, essays, culture, book notes, philosophy, creative writing, and life observations) with zero friction, zero tracking bloat, and an engaging tactical visual experience.

## Positioning

Unlike cookie-cutter, minimalist developer blogs with rounded pastel components and generic styling, this blog is deliberately tactile and engineered—synthesizing Pop Art comic panels with 90s tactical anime terminal HUDs while delivering instantaneous static performance.

## Operating Context

Technical reading across mobile, tablet, and widescreen desktop monitors; offline or low-connectivity reading via RSS readers; cross-navigation to and from Bret's main portfolio.

## Capabilities and Constraints

- Next.js (App Router) with Static Site Generation (`generateStaticParams`).
- Git-backed Markdown/MDX content collections with Zod schema validation.
- Subdomain routing on `blog.bretmuchoni.dev` via CNAME to main domain `bretmuchoni.dev`.
- Zero third-party tracker cookies; privacy-first architecture.
- Full dark/light mode toggle with theme persistence in `localStorage`.
- Automated RSS 2.0 syndication at `/rss.xml` and dynamic sitemap at `/sitemap.xml`.

## Brand Commitments

- Inherits visual authority from Bret Muchoni's Tactical Design System v2.2.
- Palette anchors: `--ink` (`#0d0d12`), `--paper` (`#f4f2e8`), `--magenta` (`#ff2e88`), `--cyan` (`#00e5ff`), `--acid-yellow` (`#f5ff00`).
- Typography anchors: `Bungee` (titles), `Space Grotesk` (narrative), `JetBrains Mono` (code/telemetry), `Silkscreen` (stamps).
- Authentic retro Win95 pixel cursors and Web 1.0 micro-stamp badges.

## Evidence on Hand

- Main portfolio repository and live deployment at `bretmuchoni.dev`.
- Portfolio design specification (`portfolio/DESIGN.md` v2.2).
- Vibe Coder Markdown starter guide (`vibe_coding_md_files_beginner_guide.docx.md`).
- Fully functional Next.js 15 App Router codebase in `bretscorner presents/blog`.

## Product Principles

1. **High Signal, Zero Bloat:** Content and speed come first. No popups, no consent walls, no tracking scripts.
2. **Commit to the World:** Every surface—from cursors to code blocks—carries the tactile anime HUD aesthetic. Never dilute into generic rounded SaaS patterns.
3. **Engineered Precision:** Strict TypeScript typing, static prerendering, and validated metadata on every route.
4. **Accessible Contrast:** High-chroma shout colors (`--acid-yellow`) are used strictly for diagnostics; all reading prose meets WCAG AAA standards.
