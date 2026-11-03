# PRD.md — Product Requirements Document

## 1. Product Summary & Mission

* **Product Name:** `blog.bretmuchoni.dev` (Bret Muchoni's Blog)
* **Target Audience:** Curious readers, peers, developers, designers, and collaborators looking for authentic writing, essays, and notes across any topic of interest—not limited to engineering.
* **Core Philosophy:** High-signal writing on tech, culture, design, personal reflections, and ideas delivered with zero bloat and zero intrusive trackers, wrapped in a distinctive 90s tactical anime HUD & Pop Art aesthetic.

---

## 2. Target Persona & User Stories

### Persona: General Reader & Technical Peer
* As a visitor, I want to explore Bret's writing across diverse topics without being limited to code—filtering by topic tags (e.g. Technology, Essays, Design, Culture, Life, Philosophy).
* As a reader, I want an uncluttered reading experience with sharp typography, rich markdown formatting, and an estimated reading time.
* As an RSS reader subscriber, I want an RSS 2.0 feed (`/rss.xml`) so I can subscribe without creating an account.
* As a portfolio visitor from `bretmuchoni.dev`, I want seamless visual cohesion and a 1-click return to the root portfolio.

---

## 3. Core Feature Requirements (MVP Scope)

### 3.1 Homepage / Articles Index (`/`)
* **HUD Header:** Shows operating system telemetry (`SYS.CORE // BLOG.BRETMUCHONI.DEV [ONLINE]`), status indicator, dark/light theme switch, and return link to `bretmuchoni.dev`.
* **Industrial Marquee Ticker:** Caution-striped marquee displaying active topics, build status, and latest post alert.
* **Category Tag Cloud / Filter:** Quick-filter by tags (`#TypeScript`, `#NextJs`, `#SystemsEng`, `#DotNet`, `#Flutter`).
* **Post Grid:** Chamfered cards featuring publication date, title, description, reading time, and tag stickers with comic drop shadows.

### 3.2 Post Reader (`/posts/[slug]`)
* **Article Header:** Prominent Bungee/Space Grotesk headline, reading telemetry tag, publication date, and tag badges.
* **Reading Progress Bar:** Thin acid-yellow accent line anchored to top of viewport tracking scroll depth.
* **Markdown/MDX Rendering:** Support for rich markdown formatting, GFM tables, blockquotes, and callouts.
* **Terminal Code Blocks:** 3-dot window frame chrome, language pill, and 1-click clipboard copy button.
* **Author Biographic Stamp:** End-of-article tactical stamp with link to Bret's portfolio and social handles.

### 3.3 Syndication & SEO
* **RSS 2.0 Feed:** Automated generation at `/rss.xml`.
* **Dynamic Sitemap:** Dynamic XML sitemap at `/sitemap.xml`.
* **Dynamic Social Cards:** Dynamic OpenGraph preview images via Next.js `@vercel/og` (`/posts/[slug]/opengraph-image.png`).

---

## 4. Non-Goals (Out of Scope for MVP)
* No complex user registration, paywalls, or third-party ads.
* No heavyweight CMS dependency (content is Git-managed Markdown/MDX).
* No client-side analytics trackers or cookies.
