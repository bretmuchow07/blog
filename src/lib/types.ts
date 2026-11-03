import { z } from 'zod';

export const PostMetadataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  pubDate: z.string(),
  updatedDate: z.string().optional(),
  author: z.string().default('Bret Muchoni'),
  tags: z.array(z.string()).default([]),
  series: z.string().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  heroImage: z.string().optional(),
});

export type PostMetadata = z.infer<typeof PostMetadataSchema>;

export interface Post extends PostMetadata {
  slug: string;
  readingTime: string;
  content: string;
}

export interface PostWithTags {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  series?: string | null;
  featured: boolean;
  draft: boolean;
  pub_date: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
  readingTime: string;
}
