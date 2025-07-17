/**
 * User profile information stored in Firestore
 */
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  phoneNumber?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  preferences?: UserPreferences;
}

/**
 * User preferences
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: NotificationPreferences;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  marketing: boolean;
}

/**
 * User activity log
 */
export interface UserActivity {
  userId: string;
  action: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * User session information
 */
export interface UserSession {
  userId: string;
  sessionId: string;
  deviceInfo?: {
    userAgent: string;
    platform: string;
    browser: string;
  };
  ipAddress?: string;
  createdAt: Date;
  expiresAt: Date;
}