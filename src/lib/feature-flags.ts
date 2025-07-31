/**
 * Feature flags for the application
 * Used to enable/disable features for different deployment environments
 * 
 * This is separate from Firebase feature flags (which control mock vs real services).
 * These flags control application-level features.
 */

export interface FeatureFlags {
  // User features
  enableUserOnboarding: boolean;  // Redirect new users to onboarding flow
  
  // Example flags - uncomment and implement as needed:
  // enableEmailSubscription: boolean;  // Email newsletter signup
  // enableAdminFeatures: boolean;      // Admin dashboard features
  // enableDebugMode: boolean;          // Debug UI elements
  // enableBetaFeatures: boolean;       // Beta/experimental features
  // enableMaintenanceMode: boolean;    // Maintenance mode banner
}

/**
 * Get feature flags based on environment
 */
function getFeatureFlags(): FeatureFlags {
  // Check for explicit environment variable overrides
  const userOnboardingEnabled = process.env.NEXT_PUBLIC_ENABLE_USER_ONBOARDING;
  
  // Default configuration
  const defaultFlags: FeatureFlags = {
    enableUserOnboarding: true,
  };

  // Environment-specific overrides
  if (process.env.NODE_ENV === 'development') {
    return {
      ...defaultFlags,
      enableUserOnboarding: userOnboardingEnabled === 'false' ? false : true,
    };
  }

  // Production configuration
  return {
    ...defaultFlags,
    enableUserOnboarding: userOnboardingEnabled === 'false' ? false : true,
  };
}

// Export singleton instance
export const featureFlags = getFeatureFlags();

/**
 * Helper functions for common feature checks
 */
export const isUserOnboardingEnabled = () => featureFlags.enableUserOnboarding;

// Example helper functions - uncomment as you implement features:
// export const isEmailSubscriptionEnabled = () => featureFlags.enableEmailSubscription;
// export const isAdminFeaturesEnabled = () => featureFlags.enableAdminFeatures;
// export const isDebugModeEnabled = () => featureFlags.enableDebugMode;

/**
 * Log feature flag status for debugging
 */
export const logFeatureFlags = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🚩 Application Feature Flags:', featureFlags);
  }
};

/**
 * Example usage:
 * 
 * import { isUserOnboardingEnabled } from '@/lib/feature-flags';
 * 
 * if (isUserOnboardingEnabled()) {
 *   router.push('/onboarding');
 * }
 */