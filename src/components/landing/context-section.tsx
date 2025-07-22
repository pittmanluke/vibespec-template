'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, FolderTree } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

// Tech stack configuration with logo paths and theme handling
const techStack = [
  {
    name: 'nextjs',
    displayName: 'Next.js 15',
    logo: '/logos/nextdotjs.svg',
    alt: 'Next.js logo',
    darkModeClass: 'dark:brightness-0 dark:invert'
  },
  {
    name: 'react',
    displayName: 'React',
    logo: '/logos/react.svg',
    alt: 'React logo',
    darkModeClass: 'dark:brightness-0 dark:invert'
  },
  {
    name: 'typescript',
    displayName: 'TypeScript',
    logo: '/logos/typescript.svg',
    alt: 'TypeScript logo',
    darkModeClass: 'dark:brightness-0 dark:invert'
  },
  {
    name: 'tailwind',
    displayName: 'Tailwind CSS',
    logo: '/logos/tailwindcss.svg',
    alt: 'Tailwind CSS logo',
    darkModeClass: 'dark:brightness-0 dark:invert'
  },
  {
    name: 'shadcn',
    displayName: 'shadcn/ui',
    logo: '/logos/shadcnui.svg',
    alt: 'shadcn/ui logo',
    darkModeClass: 'dark:brightness-0 dark:invert'
  },
  {
    name: 'claude',
    displayName: 'Claude Code',
    logo: '/logos/claude.svg',
    alt: 'Claude Code logo',
    darkModeClass: 'dark:brightness-0 dark:invert'
  }
];

export function ContextSection() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <section className="container mx-auto px-4 section-padding">
      <div className="text-center mb-12 space-y-4">
        <Badge variant="outline">
          <Key className="w-3 h-3 mr-2" />
          Context is Key
        </Badge>
        <h2 className="heading-2">
          A Well-Defined Foundation
        </h2>
        <p className="mx-auto max-w-2xl body-lg text-muted-foreground">
          Clear structure and proven tech stack provide the context AI needs 
          to build accurately and efficiently.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Tech Stack */}
        <Card className="h-full">
          <CardContent className="p-6 md:p-8 h-full flex flex-col">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-sm">✦</span>
              </div>
              Modern Tech Stack
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
              {techStack.map((tech, index) => (
                <div 
                  key={tech.name} 
                  className={`group relative flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-background to-muted/20 hover:from-muted/20 hover:to-muted/40 transition-all duration-300 ease-out hover:shadow-lg cursor-pointer transform-gpu h-full`}
                  style={{ 
                    opacity: isVisible ? 1 : 0,
                    animation: isVisible ? `fadeIn 0.6s ease-out ${index * 100}ms forwards` : 'none',
                    backfaceVisibility: 'hidden',
                    contain: 'layout',
                    willChange: 'transform, opacity'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 mb-2 transition-transform duration-300 group-hover:-translate-y-1 transform-gpu" style={{ backfaceVisibility: 'hidden' }}>
                    <Image
                      src={tech.logo}
                      alt={tech.alt}
                      width={56}
                      height={56}
                      className={`w-full h-full object-contain ${tech.darkModeClass}`}
                      loading="eager"
                    />
                  </div>
                  <span className="relative text-xs sm:text-sm font-medium">
                    {tech.displayName}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Structure */}
        <Card className="h-full">
          <CardContent className="p-6 md:p-8 h-full flex flex-col">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-primary" />
              Organized Structure
            </h3>
            <div className="flex-1 font-mono text-sm bg-zinc-900 dark:bg-zinc-950 rounded-lg p-4 overflow-x-auto flex flex-col justify-center">
              <div className="space-y-2">
              <div className="text-zinc-400">
                <span className="text-zinc-500">vibespec/</span>
              </div>
              <div className="pl-4 space-y-1">
                <div className="text-green-400">
                  <span className="text-zinc-600">├──</span> .claude/
                  <span className="text-zinc-500 text-xs ml-2">→ AI commands & sessions</span>
                </div>
                <div className="text-blue-400">
                  <span className="text-zinc-600">├──</span> specs/
                  <span className="text-zinc-500 text-xs ml-2">→ Feature specifications</span>
                </div>
                <div className="text-yellow-400">
                  <span className="text-zinc-600">├──</span> plans/
                  <span className="text-zinc-500 text-xs ml-2">→ Implementation plans</span>
                </div>
                <div className="text-purple-400">
                  <span className="text-zinc-600">├──</span> docs/
                  <span className="text-zinc-500 text-xs ml-2">→ Documentation</span>
                </div>
                <div className="text-zinc-300">
                  <span className="text-zinc-600">├──</span> src/
                </div>
                <div className="pl-4 space-y-1">
                  <div className="text-cyan-400">
                    <span className="text-zinc-600">│   ├──</span> app/
                    <span className="text-zinc-500 text-xs ml-2">→ Pages & routes</span>
                  </div>
                  <div className="text-pink-400">
                    <span className="text-zinc-600">│   ├──</span> components/
                    <span className="text-zinc-500 text-xs ml-2">→ Reusable UI</span>
                  </div>
                  <div className="text-orange-400">
                    <span className="text-zinc-600">│   ├──</span> services/
                    <span className="text-zinc-500 text-xs ml-2">→ Business logic</span>
                  </div>
                  <div className="text-indigo-400">
                    <span className="text-zinc-600">│   ├──</span> providers/
                    <span className="text-zinc-500 text-xs ml-2">→ React contexts</span>
                  </div>
                  <div className="text-teal-400">
                    <span className="text-zinc-600">│   ├──</span> hooks/
                    <span className="text-zinc-500 text-xs ml-2">→ Custom hooks</span>
                  </div>
                  <div className="text-red-400">
                    <span className="text-zinc-600">│   ├──</span> lib/
                    <span className="text-zinc-500 text-xs ml-2">→ Utilities</span>
                  </div>
                  <div className="text-violet-400">
                    <span className="text-zinc-600">│   └──</span> types/
                    <span className="text-zinc-500 text-xs ml-2">→ TypeScript types</span>
                  </div>
                </div>
                <div className="text-zinc-400">
                  <span className="text-zinc-600">├──</span> public/
                  <span className="text-zinc-500 text-xs ml-2">→ Static assets</span>
                </div>
                <div className="text-amber-400">
                  <span className="text-zinc-600">├──</span> package.json
                </div>
                <div className="text-emerald-400">
                  <span className="text-zinc-600">└──</span> CLAUDE.md
                  <span className="text-zinc-500 text-xs ml-2">→ AI instructions</span>
                </div>
              </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Message */}
      <div className="text-center mt-12">
        <p className="text-lg font-medium">
          When AI understands your project structure, it builds with precision.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          No more files in random places. No more confusion about dependencies.
        </p>
      </div>
    </section>
  );
}