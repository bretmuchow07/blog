import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/posts';

export const runtime = 'nodejs';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface PostOGProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: PostOGProps) {
  const { slug } = await params;
  // Strictly fetch non-draft posts to prevent leaking unpublished titles/metadata
  const post = await getPostBySlug(slug, false);

  if (!post) {
    return new Response('Not Found', { status: 404 });
  }

  const title = post.title || 'Article';
  const tags = post.tags || [];

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0d0d12',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#1a1a22',
              color: '#00e5ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '22px',
              border: '1px solid #333340',
              borderRadius: '6px',
            }}
          >
            B
          </div>
          <span style={{ color: '#f4f2e8', fontSize: '22px', fontWeight: 600 }}>
            Bret Muchoni
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: '10px' }}>
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  style={{
                    color: '#00e5ff',
                    fontSize: '16px',
                    fontWeight: 600,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div
            style={{
              color: '#f4f2e8',
              fontSize: title.length > 55 ? '44px' : '52px',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
              maxWidth: '1000px',
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #22222c',
            paddingTop: '24px',
          }}
        >
          <div style={{ color: '#00e5ff', fontSize: '18px', fontWeight: 500 }}>
            blog.bretmuchoni.dev
          </div>
          <div style={{ color: '#666675', fontSize: '16px' }}>
            By Bret Muchoni
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
