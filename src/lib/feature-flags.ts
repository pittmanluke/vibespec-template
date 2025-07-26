/**
 * Feature flags for the application
 * Used to enable/disable features for different deployment environments
 */

export interface FeatureFlags {
  // User features
  enableUserOnboarding: boolean;
  enableEmailSubscription: boolean;
  
  // Admin features
  enableAdminFeatures: boolean;
  
  // Development features
  enableDebugMode: boolean;
  
  // Future feature flags can be added here
  // enableNewFeature: boolean;
}

/**
 * Get feature flags based on environment
 */
function getFeatureFlags(): FeatureFlags {
  // Check for explicit environment variable overrides
  const userOnboardingEnabled = process.env.NEXT_PUBLIC_ENABLE_USER_ONBOARDING;
  const emailSubscriptionEnabled = process.env.NEXT_PUBLIC_ENABLE_EMAIL_SUBSCRIPTION;
  const adminFeaturesEnabled = process.env.NEXT_PUBLIC_ENABLE_ADMIN_FEATURES;
  const debugModeEnabled = process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE;
  
  // Default configuration
  const defaultFlags: FeatureFlags = {
    enableUserOnboarding: true,
    enableEmailSubscription: false,
    enableAdminFeatures: false,
    enableDebugMode: false,
  };

  // Environment-specific overrides
  if (process.env.NODE_ENV === 'development') {
    return {
      ...defaultFlags,
      enableUserOnboarding: userOnboardingEnabled === 'false' ? false : true,
      enableEmailSubscription: emailSubscriptionEnabled === 'true' ? true : false,
      enableAdminFeatures: adminFeaturesEnabled === 'true' ? true : false,
      enableDebugMode: debugModeEnabled === 'false' ? false : true,
    };
  }

  // Production configuration
  return {
    ...defaultFlags,
    enableUserOnboarding: userOnboardingEnabled === 'false' ? false : true,
    enableEmailSubscription: emailSubscriptionEnabled === 'true' ? true : false,
    enableAdminFeatures: adminFeaturesEnabled === 'true' ? true : false,
    enableDebugMode: false, // Always false in production
  };
}

// Export singleton instance
export const featureFlags = getFeatureFlags();

/**
 * Helper functions for common feature checks
 */
export const isUserOnboardingEnabled = () => featureFlags.enableUserOnboarding;
export const isEmailSubscriptionEnabled = () => featureFlags.enableEmailSubscription;
export const isAdminFeaturesEnabled = () => featureFlags.enableAdminFeatures;
export const isDebugModeEnabled = () => featureFlags.enableDebugMode;

/**
 * Log feature flag status for debugging
 */
export const logFeatureFlags = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🚩 Feature Flags:', featureFlags);
  }
};