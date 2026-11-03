import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Bret Muchoni — Writing';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
          <div
            style={{
              color: '#00e5ff',
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '1px',
            }}
          >
            ARTICLES &amp; NOTES
          </div>
          <div
            style={{
              color: '#f4f2e8',
              fontSize: '64px',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-1px',
            }}
          >
            Writing
          </div>
          <div
            style={{
              color: '#9a9aa8',
              fontSize: '24px',
              lineHeight: 1.5,
              maxWidth: '850px',
            }}
          >
            Articles, notes, and essays on software, design, and whatever else is on my mind.
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
            bretmuchoni.dev
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
