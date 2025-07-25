import { Metadata } from 'next';

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    images?: string[];
  };
  twitter?: {
    title?: string;
    description?: string;
    images?: string[];
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
  alternates?: {
    canonical?: string;
  };
}

export function generateMetadata({
  title = 'VibeSpec',
  description = 'Transform ideas into specifications, specifications into shipped products',
  keywords = ['nextjs', 'claude code', 'ai development', 'specifications', 'mvp', 'typescript', 'react'],
  openGraph,
  twitter,
  robots = { index: true, follow: true },
  alternates,
}: GenerateMetadataProps = {}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibespec.com';
  
  return {
    title: {
      default: title,
      template: `%s | VibeSpec`,
    },
    description,
    keywords,
    authors: [{ name: 'VibeSpec Team' }],
    creator: 'VibeSpec',
    metadataBase: new URL(siteUrl),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: 'VibeSpec',
      title: openGraph?.title || title,
      description: openGraph?.description || description,
      images: openGraph?.images || [`${siteUrl}/opengraph-image.png`],
    },
    twitter: {
      card: 'summary_large_image',
      title: twitter?.title || title,
      description: twitter?.description || description,
      images: twitter?.images || [`${siteUrl}/twitter-image.png`],
      creator: '@vibespec',
    },
    robots,
    alternates: {
      canonical: alternates?.canonical || siteUrl,
    },
  };
}

// Helper to generate page-specific metadata
export function generatePageMetadata(
  pageName: string,
  customProps?: GenerateMetadataProps
): Metadata {
  const pageDefaults: Record<string, GenerateMetadataProps> = {
    docs: {
      title: 'Documentation',
      description: 'Learn how to use VibeSpec for spec-driven development with AI coding assistants',
      keywords: ['documentation', 'guide', 'tutorial', 'vibespec', 'claude code', 'ai development'],
    },
    examples: {
      title: 'Examples',
      description: 'Explore example projects and templates built with VibeSpec',
      keywords: ['examples', 'templates', 'showcase', 'vibespec', 'nextjs', 'react'],
    },
    roadmap: {
      title: 'Roadmap',
      description: 'See what\'s planned for the future of VibeSpec',
      keywords: ['roadmap', 'features', 'updates', 'vibespec', 'development'],
    },
    login: {
      title: 'Login',
      description: 'Sign in to your VibeSpec account',
      robots: { index: false, follow: false },
    },
    signup: {
      title: 'Sign Up',
      description: 'Create your VibeSpec account and start building',
      robots: { index: false, follow: false },
    },
    dashboard: {
      title: 'Dashboard',
      description: 'Manage your VibeSpec projects and specifications',
      robots: { index: false, follow: false },
    },
  };

  const defaults = pageDefaults[pageName] || {};
  
  return generateMetadata({
    ...defaults,
    ...customProps,
  });
}