'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/auth";
import { firebaseFeatures } from "@/config/firebase.config";

export function HeaderAuth() {
  const { user, loading } = useAuth();

  // If authentication is disabled, don't show auth UI
  if (!firebaseFeatures.useAuthentication) {
    return null;
  }

  if (loading) {
    return null; // Don't render anything while loading
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {user.email}
        </span>
        <Button asChild variant="outline">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Button asChild variant="ghost" className="hidden sm:inline-flex">
        <Link href="/auth/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/signup">Get Started</Link>
      </Button>
    </div>
  );
}