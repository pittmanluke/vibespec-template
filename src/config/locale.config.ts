/**
 * Locale Configuration
 * 
 * This file contains all locale-specific settings such as currency,
 * date formats, and language preferences.
 */

export const localeConfig = {
  // Default locale
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en-US',
  
  // Currency settings
  currency: {
    code: process.env.NEXT_PUBLIC_CURRENCY_CODE || 'USD',
    locale: process.env.NEXT_PUBLIC_CURRENCY_LOCALE || 'en-US',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
  
  // Date format settings
  dateFormat: {
    locale: process.env.NEXT_PUBLIC_DATE_LOCALE || 'en-US',
    timezone: process.env.NEXT_PUBLIC_TIMEZONE || 'America/New_York',
    
    // Date format options
    short: {
      month: 'short' as const,
      day: 'numeric' as const,
      year: 'numeric' as const,
    },
    
    // DateTime format options
    long: {
      month: 'short' as const,
      day: 'numeric' as const,
      year: 'numeric' as const,
      hour: 'numeric' as const,
      minute: '2-digit' as const,
      hour12: true,
    },
  },
  
  // Supported locales (for future i18n support)
  supportedLocales: ['en-US', 'en-GB', 'es', 'fr', 'de', 'ja', 'zh'],
} as const;

export type LocaleConfig = typeof localeConfig;