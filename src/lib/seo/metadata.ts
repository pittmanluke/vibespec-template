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

const appName = process.env.NEXT_PUBLIC_APP_NAME || 'My App';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function generateMetadata({
  title = appName,
  description = 'A modern web application built with Next.js',
  keywords = ['nextjs', 'typescript', 'react', 'web app'],
  openGraph,
  twitter,
  robots = { index: true, follow: true },
  alternates,
}: GenerateMetadataProps = {}): Metadata {
  
  return {
    title: {
      default: title,
      template: `%s | ${appName}`,
    },
    description,
    keywords,
    metadataBase: new URL(appUrl),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: appUrl,
      siteName: appName,
      title: openGraph?.title || title,
      description: openGraph?.description || description,
    },
    twitter: {
      card: 'summary_large_image',
      title: twitter?.title || title,
      description: twitter?.description || description,
    },
    robots,
    alternates: {
      canonical: alternates?.canonical || appUrl,
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
      description: 'Learn how to use our application',
      keywords: ['documentation', 'guide', 'tutorial'],
    },
    dashboard: {
      title: 'Dashboard',
      description: 'Manage your account and view analytics',
      keywords: ['dashboard', 'analytics', 'account'],
    },
    auth: {
      title: 'Authentication',
      description: 'Sign in or create an account',
      keywords: ['login', 'signup', 'authentication'],
    },
  };

  const defaults = pageDefaults[pageName] || {};
  
  return generateMetadata({
    ...defaults,
    ...customProps,
  });
}