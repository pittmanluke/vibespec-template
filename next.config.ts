import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['images.unsplash.com', 'placehold.co', 'firebasestorage.googleapis.com', 'localhost'],
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@tabler/icons-react'],
  },
  
  // Enable ESLint during builds
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Enable TypeScript checking during builds
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
