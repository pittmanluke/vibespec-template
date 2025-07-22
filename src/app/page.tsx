'use client';

import dynamic from "next/dynamic";

// Dynamic import with loading state
const HomeContent = dynamic(
  () => import("@/components/landing/home-content").then(mod => ({ default: mod.HomeContent })),
  { 
    loading: () => (
      <div className="min-h-screen bg-background animate-fade-in">
        {/* Header Skeleton */}
        <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
          <div className="container mx-auto px-4 flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 bg-primary/20 rounded animate-pulse" />
              <div className="w-24 h-6 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
              <div className="w-32 h-10 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </header>
        
        {/* Hero Section Skeleton */}
        <section className="container mx-auto px-4 section-padding-lg">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-lg animate-pulse" />
            </div>
            <div className="h-16 bg-muted rounded-lg max-w-md mx-auto animate-pulse" />
            <div className="h-6 bg-muted/70 rounded-lg max-w-2xl mx-auto animate-pulse" />
            <div className="h-10 w-64 bg-muted/50 rounded-full mx-auto animate-pulse mt-6" />
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <div className="h-12 w-44 bg-primary/20 rounded-lg animate-pulse" />
              <div className="h-12 w-44 bg-muted rounded-lg animate-pulse" />
            </div>
            <div className="mt-12 md:mt-16 max-w-3xl mx-auto">
              <div className="h-64 bg-zinc-900/20 rounded-xl animate-pulse border border-zinc-800/50" />
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