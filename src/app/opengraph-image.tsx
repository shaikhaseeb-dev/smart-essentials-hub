import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'SmartEssentials Hub — Best Products India 2026';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'center',
          background: '#ffffff', fontFamily: 'Georgia, serif',
          padding: '80px', position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Dot grid bg */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px', opacity: 0.6,
        }} />

        {/* Accent blob */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-80px',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(217,70,239,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        {/* Logo bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px', position: 'relative' }}>
          <div style={{
            width: '52px', height: '52px', background: '#0f0f0f',
            borderRadius: '14px', display: 'flex', alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '20px' }}>SE</span>
          </div>
          <span style={{ fontSize: '28px', fontWeight: 800, color: '#0f0f0f', letterSpacing: '-1px' }}>
            Smart<span style={{ color: '#d946ef' }}>Essentials</span>
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: '64px', fontWeight: 900, color: '#0f0f0f',
          lineHeight: 1.05, letterSpacing: '-2px', margin: '0 0 24px',
          position: 'relative', maxWidth: '820px',
        }}>
          🔥 Best Trending<br />
          <span style={{ color: '#d946ef' }}>Products India 2026</span>
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: '24px', color: '#6b7280', margin: '0 0 48px', maxWidth: '700px', lineHeight: 1.4, position: 'relative' }}>
          Handpicked essentials for students & professionals — updated every week with honest deals.
        </p>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
          {['🔥 Trending', '🎓 Student', '💸 Under ₹999', '🤖 AI Tools'].map(label => (
            <div key={label} style={{
              background: '#f9fafb', border: '1px solid #e5e7eb',
              borderRadius: '100px', padding: '10px 20px',
              fontSize: '16px', fontWeight: 600, color: '#374151',
            }}>
              {label}
            </div>
          ))}
        </div>

        {/* Bottom tag */}
        <div style={{
          position: 'absolute', bottom: '40px', right: '80px',
          fontSize: '14px', color: '#9ca3af',
        }}>
          smartessentials.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
