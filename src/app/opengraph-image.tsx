import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'VibeSpec - Spec-driven development for AI coding';
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
          background: 'linear-gradient(to bottom right, #6366f1, #8b5cf6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Logo Container */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          {/* Logo placeholder - we'll use a simple shape since we can't load external images easily */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'white',
              marginRight: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
              fontWeight: 'bold',
              color: '#6366f1',
            }}
          >
            V
          </div>
          <h1
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            VibeSpec
          </h1>
        </div>
        
        {/* Tagline */}
        <p
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            maxWidth: 800,
            margin: '0 40px',
            lineHeight: 1.4,
          }}
        >
          Transform ideas into specifications,
          specifications into shipped products
        </p>
        
        {/* Bottom decoration */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            fontSize: 20,
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          <span>Next.js 15</span>
          <span>•</span>
          <span>Claude Code</span>
          <span>•</span>
          <span>TypeScript</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}