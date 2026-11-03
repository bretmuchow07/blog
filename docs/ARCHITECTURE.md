# ARCHITECTURE.md — System Architecture & Implementation

## 1. Technical Architecture Overview

`blog.bretmuchoni.dev` is a Next.js (App Router) web application built for maximum speed, SEO indexing, and type safety, leveraging Static Site Generation (SSG) with zero runtime database dependency for content delivery.

```mermaid
flowchart TD
    Content[content/posts/*.mdx\nMarkdown + YAML Frontmatter] --> Loader[lib/posts.ts\ngray-matter + Zod]
    Loader --> DynamicPage[app/posts/[slug]/page.tsx\ngenerateStaticParams]
    Loader --> IndexPage[app/page.tsx\nArticles Grid]
    Loader --> RSS[app/rss.xml/route.ts\nRSS 2.0 Feed]
    Loader --> Sitemap[app/sitemap.ts\nXML Sitemap]
    
    DynamicPage --> OGImage[app/posts/[slug]/opengraph-image.tsx\nDynamic OG Card]
```

---

## 2. Rendering Strategy

* **Static Site Generation (SSG):** All posts are parsed at build time via `generateStaticParams()` in `src/app/posts/[slug]/page.tsx`.
* **Zero Client JS for Content:** Article prose renders as pure static HTML on the server.
* **Islands of Interactivity:** Client components (`'use client'`) are reserved strictly for:
  * `ThemeToggle.tsx` (Dark/light mode state in `localStorage`)
  * `CodeCopyButton.tsx` (Copy snippet to clipboard)
  * `ReadingProgress.tsx` (Scroll position tracking bar)
  * `TagFilter.tsx` (Client-side fast search/filter)

---

## 3. Directory Layout
```text
blog/
├── content/
│   └── posts/               # MDX content files with frontmatter
├── docs/                    # Vibe-coder context documentation suite
├── public/
│   ├── assets/              # Static media, icons, retro Win95 cursors
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout, theme injection, HUD navigation
│   │   ├── page.tsx         # Articles index
│   │   ├── globals.css      # Design tokens and base tactical styles
│   │   ├── sitemap.ts       # Automated sitemap generator
│   │   ├── rss.xml/route.ts # Automated RSS 2.0 generator
│   │   └── posts/[slug]/
│   │       ├── page.tsx     # Post article reader
│   │       └── opengraph-image.tsx # Dynamic social preview card
│   ├── components/          # Reusable tactical UI components
│   └── lib/                 # Post loaders, MDX compiler, utilities
```

---

## 4. Subdomain Deployment Strategy

* **Deployment Host:** Vercel (or Cloudflare Pages).
* **Domain Binding:** `blog.bretmuchoni.dev`.
* **Cross-Site Linking:**
  * Portfolio -> Blog: `https://blog.bretmuchoni.dev`
  * Blog -> Portfolio: `https://bretmuchoni.dev`
* **Static Caching:** Standard Vercel edge caching for ultra-low latency worldwide delivery.
