# API.md — Endpoints & Syndication Feeds

## 1. Overview

While `blog.bretmuchoni.dev` is primarily statically generated, it exposes standard machine-readable syndication and index endpoints via Next.js Route Handlers.

---

## 2. Endpoints

### 2.1 RSS 2.0 Feed
* **Route:** `GET /rss.xml`
* **Response Content-Type:** `application/xml`
* **Description:** Emits an automated, fully validated RSS 2.0 feed containing all published, non-draft articles with full description, publication dates, and canonical permalinks.
* **Example Output:**
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Bret Muchoni — Blog</title>
      <link>https://blog.bretmuchoni.dev</link>
      <description>Articles, notes, and essays by Bret Muchoni.</description>
      <language>en-us</language>
      <lastBuildDate>Sun, 01 Nov 2026 12:00:00 GMT</lastBuildDate>
      <item>
        <title>The Vibe Coder's Guide to Persistent Project Context</title>
        <link>https://blog.bretmuchoni.dev/posts/vibe-coding-markdown</link>
        <guid>https://blog.bretmuchoni.dev/posts/vibe-coding-markdown</guid>
        <pubDate>Sun, 01 Nov 2026 00:00:00 GMT</pubDate>
        <description>Why creating structured .md files transforms AI coding assistants...</description>
      </item>
    </channel>
  </rss>
  ```

---

### 2.2 XML Sitemap
* **Route:** `GET /sitemap.xml`
* **Handled by:** `src/app/sitemap.ts`
* **Response Content-Type:** `application/xml`
* **Description:** Lists homepage, tag taxonomy routes, and all published articles with `lastModified` and `priority`.

---

### 2.3 Dynamic OpenGraph Card
* **Route:** `GET /posts/[slug]/opengraph-image`
* **Handled by:** `src/app/posts/[slug]/opengraph-image.tsx`
* **Response Content-Type:** `image/png`
* **Description:** Uses `@vercel/og` to dynamically render a high-contrast tactical banner featuring the post title, Bret's brand mark, publication date, and the `--magenta`/`--cyan` accent frame.
