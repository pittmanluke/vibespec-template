import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'VibeSpec - A template for spec-driven AI-assisted coding'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090B', // Matching dark theme background
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Top section with logo and title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          {/* V Logo */}
          <svg
            width="56"
            height="56"
            viewBox="0 0 180 180"
            fill="none"
            style={{
              marginBottom: 20,
            }}
          >
            <path
              d="M45 45L90 135L135 45"
              stroke="#FAFAFA"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          {/* Title - layered for faux-bold effect */}
          <div
            style={{
              position: 'relative',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Base layer */}
            <div
              style={{
                position: 'absolute',
                fontSize: 112,
                fontWeight: 800,
                color: '#FAFAFA',
                letterSpacing: '-0.05em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial Black, sans-serif',
                lineHeight: 1,
              }}
            >
              VibeSpec
            </div>
            {/* Second layer for extra boldness */}
            <div
              style={{
                position: 'absolute',
                fontSize: 112,
                fontWeight: 800,
                color: '#FAFAFA',
                letterSpacing: '-0.05em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial Black, sans-serif',
                lineHeight: 1,
                transform: 'translateX(0.5px)',
              }}
            >
              VibeSpec
            </div>
            {/* Third layer */}
            <div
              style={{
                fontSize: 112,
                fontWeight: 800,
                color: '#FAFAFA',
                letterSpacing: '-0.05em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial Black, sans-serif',
                lineHeight: 1,
              }}
            >
              VibeSpec
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 18,
              color: '#A1A1AA',
              marginBottom: 24,
              textAlign: 'center',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            A template for spec-driven AI-assisted coding
          </div>

          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#18181B',
              border: '1px solid #27272A',
              borderRadius: 24,
              padding: '10px 20px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: '#E4E4E7',
                fontWeight: 500,
              }}
            >
              Specifications first, code second
            </div>
          </div>
        </div>

        {/* Terminal Window */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 680,
            backgroundColor: '#18181B',
            border: '1px solid #27272A',
            borderRadius: 12,
            padding: 20,
            marginBottom: 40,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Terminal window controls */}
          <div
            style={{
              display: 'flex',
              gap: 6,
              marginBottom: 16,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#EF4444',
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#EAB308',
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#22C55E',
              }}
            />
            <div
              style={{
                marginLeft: 12,
                fontSize: 12,
                color: '#71717A',
                fontFamily: 'monospace',
              }}
            >
              claude
            </div>
          </div>
          
          {/* Terminal content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'monospace',
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <div style={{ display: 'flex', marginBottom: 4 }}>
              <span style={{ color: '#34D399', marginRight: 8 }}>$</span>
              <span style={{ color: '#E4E4E7' }}>/session:start dashboard-implementation</span>
            </div>
            <div style={{ color: '#71717A', fontSize: 12, marginBottom: 4, display: 'flex' }}>
              # Track progress with sessions
            </div>
          </div>
        </div>

        {/* Tech Stack - refined presentation */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: 600,
          }}
        >
          {['Next.js 15', 'Claude Code', 'TypeScript', 'Tailwind CSS'].map((tech, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#18181B',
                border: '1px solid #27272A',
                borderRadius: 16,
                padding: '6px 14px',
                fontSize: 12,
                color: '#A1A1AA',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}