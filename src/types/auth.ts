import { User as FirebaseUser } from 'firebase/auth';

/**
 * User roles in the application
 */
export type UserRole = 'user' | 'admin';

/**
 * Extended user type with application-specific fields
 */
export interface AppUser extends FirebaseUser {
  role?: UserRole;
  displayName: string | null;
  createdAt?: Date;
  lastLoginAt?: Date;
}

/**
 * Authentication state
 */
export interface AuthState {
  user: AppUser | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Signup credentials
 */
export interface SignupCredentials extends LoginCredentials {
  displayName: string;
  confirmPassword: string;
}

/**
 * Auth context type
 */
export interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}