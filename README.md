# blog.bretmuchoni.dev // Writing

The personal blog and publication companion to **[bretmuchoni.dev](https://bretmuchoni.dev)**. A home for anything Bret Muchoni wants to publish—not limited to engineering notes, spanning technology, architecture, essays, design, culture, and personal reflections. Built with Next.js (App Router), TypeScript, and the **Tactical Design System v2.2** (*Pop Art meets 90s Tactical Anime HUD*).

---

## 1. Quick Start

```bash
# Install dependencies
npm install

# Start local development server (http://localhost:3000)
npm run dev

# Create optimized production build
npm run build

# Preview production build locally
npm start
```

---

## 2. Project Architecture & Vibe Coder Documentation

Following *The Vibe Coder's `.md` File Starter Guide*, this repository maintains persistent context in the `docs/` suite:

* [docs/AGENTS.md](docs/AGENTS.md) — Directives and guardrails for AI coding agents.
* [docs/PRD.md](docs/PRD.md) — Product requirements, personas, and feature scope.
* [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) — Tactical tokens, palettes, typography, and motion rules.
* [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Next.js App Router, SSG, and content pipeline.
* [docs/SECURITY.md](docs/SECURITY.md) — CSP headers, XSS prevention, and secret management.
* [docs/CODE_STYLE.md](docs/CODE_STYLE.md) — Coding conventions and token reuse rules.
* [docs/DATABASE.md](docs/DATABASE.md) — Markdown/MDX frontmatter schemas and validation.
* [docs/API.md](docs/API.md) — RSS 2.0 (`/rss.xml`) and sitemap (`/sitemap.xml`) specifications.

---

## 3. Writing & Publishing Articles

To add a new article:
1. Create a `.md` or `.mdx` file in `content/posts/` (e.g. `content/posts/my-new-post.mdx`).
2. Add frontmatter matching the schema defined in [docs/DATABASE.md](docs/DATABASE.md):
   ```yaml
   ---
   title: "Your Post Title"
   description: "A punchy summary of the post."
   pubDate: "2026-11-01"
   author: "Bret Muchoni"
   tags: ["Architecture", "TypeScript"]
   series: "Tactical Workflows"
   featured: false
   draft: false
   ---
   ```
3. Run `npm run build` to verify type safety and static generation.

---

## 4. Subdomain Deployment

This application is deployed at **`blog.bretmuchoni.dev`**:
* **DNS Configuration:** `CNAME` record pointing host `blog` to `cname.vercel-dns.com` (or your deployment provider).
* **Cross-Site Linking:** The HUD navbar and footer provide direct cross-domain routing back to `https://bretmuchoni.dev`.
