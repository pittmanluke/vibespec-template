'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { isUserOnboardingEnabled } from '@/lib/feature-flags';

interface FormState {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  zipCode: string;
  isLoading: boolean;
  error: string;
}

interface FormActions {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setZipCode: (zipCode: string) => void;
  clearError: () => void;
  clearFields: () => void;
  handleEmailSignIn: () => Promise<void>;
  handleSignUp: () => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
  handleResetPassword: () => Promise<void>;
}

/**
 * Hook for managing authentication form state and actions
 */
export function useAuthForm(): [FormState, FormActions] {
  const router = useRouter();
  const auth = useAuth();
  const { signIn, signUp, signInWithGoogle, resetPassword, user, loading, userRole } = auth;
  
  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  // Redirect logic based on user role
  useEffect(() => {
    if (!loading && user && userRole) {
      console.log('[useAuthForm] Redirecting user based on role:', userRole);
      
      // Check if this is a new user (for onboarding)
      const isNewUser = sessionStorage.getItem('isNewUser') === 'true';
      
      // Determine where to redirect based on role
      if (userRole === 'user') {
        console.log('[useAuthForm] Redirecting to user dashboard');
        router.push('/dashboard');
      } else if (userRole === 'admin') {
        console.log('[useAuthForm] Redirecting to admin dashboard');
        router.push('/admin/dashboard');
      }
      
      // Mark that we should check for onboarding on the dashboard
      // Only set checkOnboarding if the appropriate feature flag is enabled
      if (isNewUser) {
        const shouldCheckOnboarding = 
          (userRole === 'user' && isUserOnboardingEnabled());
        
        if (shouldCheckOnboarding) {
          sessionStorage.setItem('checkOnboarding', 'true');
        }
        sessionStorage.removeItem('isNewUser');
      }
    }
  }, [loading, user, userRole, router]);
  
  // Action handlers
  const clearError = () => setError('');
  
  const clearFields = () => {
    setPassword('');
    setFirstName('');
    setLastName('');
    setZipCode('');
    setError('');
  };
  
  const handleEmailSignIn = async () => {
    clearError();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // Redirect handled in the useEffect
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async () => {
    clearError();
    setIsLoading(true);
    
    try {
      if (!firstName || !lastName || !zipCode) {
        throw new Error('All fields are required');
      }
      
      await signUp({
        email,
        password,
        firstName,
        lastName,
        zipCode
      });
      
      // Mark as new user for onboarding
      sessionStorage.setItem('isNewUser', 'true');
      
      // Redirect handled in the useEffect
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    clearError();
    setIsLoading(true);
    
    try {
      await signInWithGoogle();
      // Redirect handled in the useEffect
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during Google sign in');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    clearError();
    setIsLoading(true);
    
    try {
      await resetPassword(email);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during password reset');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Assemble state and actions
  const state: FormState = {
    isLoading,
    error,
    email,
    password,
    firstName,
    lastName,
    zipCode
  };
  
  const actions: FormActions = {
    setEmail,
    setPassword,
    setFirstName,
    setLastName,
    setZipCode,
    clearError,
    clearFields,
    handleEmailSignIn,
    handleSignUp,
    handleGoogleSignIn,
    handleResetPassword
  };
  
  return [state, actions];
} 