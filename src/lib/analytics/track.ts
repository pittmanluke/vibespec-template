'use client';

import { track } from '@vercel/analytics';
import { 
  ANALYTICS_EVENTS, 
  AnalyticsEvent,
  CTAClickProperties,
  FormSubmitProperties,
  NavigationClickProperties
} from './events';

interface TrackEventProps {
  event: AnalyticsEvent;
  properties?: Record<string, unknown>;
}

/**
 * Core tracking function that sends events to Vercel Analytics
 */
export function trackEvent({ event, properties = {} }: TrackEventProps) {
  // Add common properties
  const enrichedProperties = {
    ...properties,
    timestamp: new Date().toISOString(),
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    page_title: typeof document !== 'undefined' ? document.title : undefined,
  };
  
  // Send to Vercel Analytics
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  track(event, enrichedProperties as any);
  
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event, enrichedProperties);
  }
}

/**
 * Track CTA button clicks
 */
export function trackClick(
  label: string, 
  properties?: Omit<CTAClickProperties, 'label'>
) {
  trackEvent({
    event: ANALYTICS_EVENTS.CTA_CLICK,
    properties: { label, ...properties },
  });
}

/**
 * Track form submissions
 */
export function trackFormSubmit(
  formName: string,
  success: boolean,
  properties?: Omit<FormSubmitProperties, 'form_name' | 'success'>
) {
  trackEvent({
    event: ANALYTICS_EVENTS.FORM_SUBMIT,
    properties: { form_name: formName, success, ...properties },
  });
}

/**
 * Track navigation events
 */
export function trackNavigation(
  from: string,
  to: string,
  method: NavigationClickProperties['method'] = 'link'
) {
  trackEvent({
    event: ANALYTICS_EVENTS.NAVIGATION_CLICK,
    properties: { from, to, method },
  });
}

/**
 * Track theme changes
 */
export function trackThemeChange(fromTheme: string, toTheme: string) {
  trackEvent({
    event: ANALYTICS_EVENTS.THEME_CHANGE,
    properties: { from_theme: fromTheme, to_theme: toTheme },
  });
}

/**
 * Track page views (useful for client-side navigation)
 */
export function trackPageView(pagePath?: string) {
  trackEvent({
    event: ANALYTICS_EVENTS.PAGE_VIEW,
    properties: { 
      page_path: pagePath || window.location.pathname,
    },
  });
}

/**
 * Track documentation interactions
 */
export function trackDocsEvent(
  action: 'view' | 'search' | 'copy',
  properties?: Record<string, unknown>
) {
  const eventMap = {
    view: ANALYTICS_EVENTS.DOCS_VIEW,
    search: ANALYTICS_EVENTS.DOCS_SEARCH,
    copy: ANALYTICS_EVENTS.CODE_COPY,
  };
  
  trackEvent({
    event: eventMap[action],
    properties,
  });
}

/**
 * Track errors
 */
export function trackError(
  type: 'boundary' | 'form' | 'api',
  errorMessage: string,
  properties?: Record<string, unknown>
) {
  const eventMap = {
    boundary: ANALYTICS_EVENTS.ERROR_BOUNDARY,
    form: ANALYTICS_EVENTS.FORM_ERROR,
    api: ANALYTICS_EVENTS.API_ERROR,
  };
  
  trackEvent({
    event: eventMap[type],
    properties: {
      error_message: errorMessage,
      ...properties,
    },
  });
}