'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import AuthService, { UserRole, AuthState } from '@/services/auth/auth-service';
import { firebaseFeatures } from '@/config/firebase.config';
import { mockAuthService } from '@/services/auth/mock/mock-auth-service';

// Action interfaces
export interface AuthActions {
  signIn: (email: string, password: string) => Promise<FirebaseUser>;
  signUp: (data: { email: string; password: string; firstName: string; lastName: string; [key: string]: unknown }) => Promise<FirebaseUser>;
  signInWithGoogle: () => Promise<FirebaseUser>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Combined context type
export interface AuthContextValue extends AuthState, AuthActions {}

// Create the context with default values
const AuthContext = createContext<AuthContextValue>({
  // State defaults
  user: null,
  userData: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  userRole: null,
  isAdmin: false,
  isRegularUser: false,
  isDevelopment: false,
  isRoleOverridden: false,
  originalRole: null,
  
  // Action defaults (will be overridden)
  signIn: async () => { throw new Error('Not implemented'); },
  signUp: async () => { throw new Error('Not implemented'); },
  signInWithGoogle: async () => { throw new Error('Not implemented'); },
  signOut: async () => { throw new Error('Not implemented'); },
  resetPassword: async () => { throw new Error('Not implemented'); },
});

// Create the Auth Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  // State Management
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  
  // Environment check
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Listen for auth state changes
  useEffect(() => {
    let unsubscribe: () => void;
    
    if (!firebaseFeatures.useAuthentication) {
      // Use mock auth service
      unsubscribe = mockAuthService.onAuthStateChanged(async (currentUser) => {
        setUser(currentUser);
        
        if (currentUser) {
          try {
            const data = await mockAuthService.getUserData(currentUser.uid);
            setUserData(data);
            const role = data.role as UserRole || 'user';
            setUserRole(role);
          } catch (error: unknown) {
            console.error('Error fetching mock user data:', error);
            setError(error instanceof Error ? error : new Error('Unknown error'));
          }
        } else {
          setUserRole(null);
          setUserData(null);
          setError(null);
        }
        
        setLoading(false);
      });
    } else if (auth) {
      // Use Firebase auth
      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        
        // Get user role from Firestore if user is authenticated
        if (currentUser && db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setUserData(data);
              const role = data.role as UserRole || 'user';
              setUserRole(role);
            } else {
              // Document might still be creating, retry once
              setTimeout(async () => {
                try {
                  if (db) {
                    const retryDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    if (retryDoc.exists()) {
                      const data = retryDoc.data();
                      setUserData(data);
                      const role = data.role as UserRole || 'user';
                      setUserRole(role);
                    } else {
                      // Default to 'user' if still no document
                      setUserRole('user');
                      setUserData(null);
                    }
                  } else {
                    // Default to 'user' if no database
                    setUserRole('user');
                    setUserData(null);
                  }
                } catch (retryError: unknown) {
                  console.error('Error on retry fetching user role:', retryError);
                  setUserRole('user');
                  setUserData(null);
                }
              }, 1000);
          }
        } catch (error: unknown) {
          console.error('Error fetching user role:', error);
          setError(error instanceof Error ? error : new Error('Unknown error'));
          setUserRole(null);
          setUserData(null);
        }
      } else {
        // Reset state on logout/no user
        setUserRole(null);
        setUserData(null);
        setError(null);
      }
      
      setLoading(false);
    });
    } else {
      // No auth configured
      setLoading(false);
      unsubscribe = () => {};
    }

    return () => unsubscribe();
  }, []);

  // Computed properties
  const isAuthenticated = !!user && !!userData;
  const isAdmin = userRole === 'admin';
  const isRegularUser = userRole === 'user';

  // Authentication action methods
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      if (!firebaseFeatures.useAuthentication) {
        const result = await mockAuthService.signIn(email, password);
        return result.user;
      }
      return await AuthService.signIn(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  };

  const signUp = async (data: { email: string; password: string; firstName: string; lastName: string; [key: string]: unknown }) => {
    try {
      setError(null);
      if (!firebaseFeatures.useAuthentication) {
        const result = await mockAuthService.signUp(data);
        return result.user;
      }
      return await AuthService.signUp(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      if (!firebaseFeatures.useAuthentication) {
        const result = await mockAuthService.signInWithGoogle();
        return result.user;
      }
      return await AuthService.signInWithGoogle();
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      if (!firebaseFeatures.useAuthentication) {
        await mockAuthService.signOut();
      } else {
        await AuthService.signOut();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      if (!firebaseFeatures.useAuthentication) {
        await mockAuthService.resetPassword(email);
      } else {
        await AuthService.resetPassword(email);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  };

  // Combine state and actions for context value
  const contextValue: AuthContextValue = useMemo(() => ({
    user,
    userData,
    loading,
    error,
    isAuthenticated,
    userRole,
    isAdmin,
    isRegularUser,
    isDevelopment,
    isRoleOverridden: false,
    originalRole: null,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
  }), [
    user, userData, loading, error, isAuthenticated, 
    userRole, isAdmin, isRegularUser, isDevelopment
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Export the hook for consuming the context
export const useAuth = () => useContext(AuthContext);

// For backward compatibility
export const useAuthContext = useAuth;