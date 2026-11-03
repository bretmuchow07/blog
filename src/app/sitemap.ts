import { MetadataRoute } from 'next';
import { getAllPosts, getAllTags } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog.bretmuchoni.dev';
  const posts = await getAllPosts();
  const tags = await getAllTags();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const tagEntries: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${siteUrl}/tags/${encodeURIComponent(tag.toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...postEntries,
    ...tagEntries,
  ];
}
