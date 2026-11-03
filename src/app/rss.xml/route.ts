import { getAllPosts } from '@/lib/posts';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function escapeCdata(text: string): string {
  return text.replace(/]]>/g, ']]]]><![CDATA[>');
}

export async function GET() {
  const posts = await getAllPosts();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog.bretmuchoni.dev';

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bret Muchoni — Blog</title>
    <link>${siteUrl}</link>
    <description>Articles, notes, and essays by Bret Muchoni.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${escapeCdata(post.title)}]]></title>
      <link>${siteUrl}/posts/${encodeURIComponent(post.slug)}</link>
      <guid isPermaLink="true">${siteUrl}/posts/${encodeURIComponent(post.slug)}</guid>
      <pubDate>${post.pub_date ? new Date(post.pub_date).toUTCString() : new Date().toUTCString()}</pubDate>
      <description><![CDATA[${escapeCdata(post.description)}]]></description>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
