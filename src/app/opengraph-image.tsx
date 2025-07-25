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
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Glow effect */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Logo and Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
            zIndex: 10,
          }}
        >
          {/* Logo SVG */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            style={{ marginRight: 24 }}
          >
            <rect width="100" height="100" rx="24" fill="#6366f1" />
            <path
              d="M30 40 L50 25 L70 40 L70 60 L50 75 L30 60 Z"
              stroke="white"
              strokeWidth="4"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M50 25 L50 50 M30 40 L50 50 L70 40 M50 50 L50 75"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          
          <h1
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: 'white',
              margin: 0,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e0ff 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            VibeSpec
          </h1>
        </div>
        
        {/* Tagline */}
        <p
          style={{
            fontSize: 36,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            maxWidth: 900,
            margin: '0 40px 48px',
            lineHeight: 1.3,
            fontWeight: 300,
            zIndex: 10,
          }}
        >
          Transform ideas into specifications,
          <br />
          specifications into shipped products
        </p>
        
        {/* Feature badges */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            zIndex: 10,
          }}
        >
          {['AI-Powered', 'Spec-Driven', 'Production-Ready'].map((feature) => (
            <div
              key={feature}
              style={{
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                borderRadius: 100,
                padding: '12px 24px',
                fontSize: 18,
                color: '#e0e0ff',
                fontWeight: 500,
              }}
            >
              {feature}
            </div>
          ))}
        </div>
        
        {/* Bottom branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            fontSize: 18,
            color: 'rgba(255, 255, 255, 0.5)',
            zIndex: 10,
          }}
        >
          <span>Next.js 15</span>
          <span style={{ color: 'rgba(99, 102, 241, 0.6)' }}>•</span>
          <span>Claude Code</span>
          <span style={{ color: 'rgba(99, 102, 241, 0.6)' }}>•</span>
          <span>TypeScript</span>
          <span style={{ color: 'rgba(99, 102, 241, 0.6)' }}>•</span>
          <span>Tailwind CSS</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}