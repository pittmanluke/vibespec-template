import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { localeConfig } from "@/config/locale.config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(localeConfig.currency.locale, {
    style: 'currency',
    currency: localeConfig.currency.code,
    minimumFractionDigits: localeConfig.currency.minimumFractionDigits,
    maximumFractionDigits: localeConfig.currency.maximumFractionDigits,
  }).format(amount);
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string | number): string {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat(localeConfig.dateFormat.locale, localeConfig.dateFormat.short).format(dateObj);
}

/**
 * Format a date with time
 */
export function formatDateTime(date: Date | string | number): string {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat(localeConfig.dateFormat.locale, localeConfig.dateFormat.long).format(dateObj);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const dateObj = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(dateObj);
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
