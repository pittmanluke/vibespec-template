/**
 * Application Configuration
 * 
 * This file contains all the configurable settings for the application.
 * Update these values to customize the template for your specific needs.
 */

export const appConfig = {
  // Application metadata
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Next.js Firebase Template',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'A production-ready template for building web applications',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Company/Organization details
  company: {
    name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Your Company',
    website: process.env.NEXT_PUBLIC_COMPANY_WEBSITE || 'https://example.com',
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@example.com',
  },
  
  // Social links
  social: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com',
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || '',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
  },
  
  // Feature flags are managed in /src/lib/feature-flags.ts
  
  // API endpoints (if using external APIs)
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  },
} as const;

export type AppConfig = typeof appConfig;