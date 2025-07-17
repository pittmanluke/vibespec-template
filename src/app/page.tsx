'use client';

import dynamic from "next/dynamic";

// Dynamic import with loading state
const HomeContent = dynamic(
  () => import("@/components/landing/home-content").then(mod => ({ default: mod.HomeContent })),
  { 
    loading: () => <div className="min-h-screen" />,
    ssr: false 
  }
);

export default function Home() {
  return <HomeContent />;
}