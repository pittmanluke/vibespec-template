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
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          {/* Logo */}
          <svg
            width="48"
            height="48"
            viewBox="0 0 100 100"
            style={{ marginRight: 16 }}
          >
            <rect width="100" height="100" rx="20" fill="#8B5CF6" />
            <path
              d="M30 40 L50 25 L70 40 L70 60 L50 75 L30 60 Z"
              stroke="white"
              strokeWidth="3"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M50 25 L50 50 M30 40 L50 50 L70 40 M50 50 L50 75"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Multiple layers for faux-bold effect */}
          <div style={{ position: 'relative', display: 'block' }}>
            <h1
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: 'white',
                margin: 0,
                letterSpacing: '-0.02em',
                position: 'absolute',
                left: 0,
                top: 0,
              }}
            >
              VibeSpec
            </h1>
            <h1
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: 'white',
                margin: 0,
                letterSpacing: '-0.02em',
                position: 'absolute',
                left: 0.5,
                top: 0,
              }}
            >
              VibeSpec
            </h1>
            <h1
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: 'white',
                margin: 0,
                letterSpacing: '-0.02em',
                position: 'relative',
              }}
            >
              VibeSpec
            </h1>
          </div>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 24,
            color: '#A1A1AA',
            textAlign: 'center',
            margin: '0 0 48px 0',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          A template for spec-driven AI-assisted coding
        </p>

        {/* Terminal-like element */}
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
          }}
        >
          {/* Terminal header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 16,
              paddingBottom: 16,
              borderBottom: '1px solid #27272A',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  display: 'block',
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#F59E0B',
                  display: 'block',
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  display: 'block',
                }}
              />
            </div>
          </div>
          
          {/* Terminal content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              fontFamily: 'monospace',
              fontSize: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#10B981', marginRight: 8 }}>$</span>
              <span style={{ color: '#E5E5E5' }}>npx claude-code new</span>
            </div>
            <div style={{ color: '#A1A1AA', marginLeft: 16, display: 'block' }}>
              Creating your spec-driven project...
            </div>
            <div style={{ color: '#A1A1AA', marginLeft: 16, display: 'block' }}>
              Setting up AI context files...
            </div>
            <div style={{ color: '#A1A1AA', marginLeft: 16, display: 'block' }}>
              Configuring Claude commands...
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
              <span style={{ color: '#10B981', marginRight: 8 }}>$</span>
              <span style={{ color: '#E5E5E5' }}>npm run dev</span>
              <span
                style={{
                  marginLeft: 12,
                  padding: '2px 8px',
                  backgroundColor: '#8B5CF6',
                  color: 'white',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Ready!
              </span>
            </div>
          </div>
        </div>

        {/* Tech stack badges */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 8,
          }}
        >
          {['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Claude Code'].map((tech) => (
            <div
              key={tech}
              style={{
                padding: '8px 16px',
                backgroundColor: '#18181B',
                border: '1px solid #27272A',
                borderRadius: 6,
                fontSize: 14,
                color: '#A1A1AA',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                display: 'block',
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