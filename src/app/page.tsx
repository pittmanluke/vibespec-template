'use client';

import dynamic from "next/dynamic";

// Dynamic import with loading state
const HomeContent = dynamic(
  () => import("@/components/landing/home-content").then(mod => ({ default: mod.HomeContent })),
  { 
    loading: () => (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        {/* Header Skeleton */}
        <header className="border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 h-16" />
        </header>
        
        {/* Hero Section Skeleton */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-muted rounded-lg animate-pulse" />
            </div>
            <div className="h-12 bg-muted rounded-lg max-w-sm mx-auto animate-pulse" />
            <div className="h-6 bg-muted rounded-lg max-w-2xl mx-auto animate-pulse" />
            <div className="h-8 w-48 bg-muted rounded-lg mx-auto animate-pulse" />
            <div className="flex justify-center gap-4 pt-6">
              <div className="h-11 w-40 bg-muted rounded-lg animate-pulse" />
              <div className="h-11 w-40 bg-muted rounded-lg animate-pulse" />
            </div>
            <div className="mt-12 md:mt-16 max-w-3xl mx-auto">
              <div className="h-48 bg-muted rounded-xl animate-pulse" />
            </div>
          </div>
        </section>
      </div>
    ),
    ssr: false 
  }
);

export default function Home() {
  return <HomeContent />;
}