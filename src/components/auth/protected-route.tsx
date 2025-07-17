'use client';

import { useAuth } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { firebaseFeatures } from '@/config/firebase.config';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('user' | 'dealer' | 'admin' | 'inspector')[];
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = ['user', 'dealer', 'admin', 'inspector'] 
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, userData, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!firebaseFeatures.useAuthentication) {
      return;
    }
    
    if (!loading && !isAuthenticated) {
      router.push('/');
    } else if (!loading && isAuthenticated && userData && allowedRoles.length > 0) {
      // Check if user has allowed role
      if (!allowedRoles.includes(userData.role)) {
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, loading, router, userData, allowedRoles]);

  useEffect(() => {
    // Show error toast if there's an authentication error
    if (error) {
      toast.error(`Authentication error: ${error.message || 'Failed to load profile data'}`);
    }
  }, [error]);

  // If authentication is disabled, always render children
  if (!firebaseFeatures.useAuthentication) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we load your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Authentication Error</h2>
          <p className="text-muted-foreground">{error.message || 'Failed to load profile data'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Only render children if authenticated and has right role
  if (!isAuthenticated) {
    return null;
  }

  if (userData && allowedRoles.length > 0 && !allowedRoles.includes(userData.role)) {
    return null;
  }

  return <>{children}</>;
} 