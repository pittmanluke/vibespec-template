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
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12 space-y-4">
        <Badge variant="outline">
          <Key className="w-3 h-3 mr-2" />
          Context is Key
        </Badge>
        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
          A Well-Defined Foundation
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Clear structure and proven tech stack provide the context AI needs 
          to build accurately and efficiently.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Tech Stack */}
        <Card>
          <CardContent className="p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6">Modern Tech Stack</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {techStack.map((tech, index) => (
                <div 
                  key={tech.name} 
                  className={`group relative flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-background to-muted/20 hover:from-muted/20 hover:to-muted/40 transition-all duration-300 ease-out hover:scale-105 hover:shadow-md cursor-pointer ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 mb-3 transition-transform group-hover:scale-110">
                    <Image
                      src={tech.logo}
                      alt={tech.alt}
                      width={56}
                      height={56}
                      className={`w-full h-full object-contain ${tech.darkModeClass}`}
                    />
                  </div>
                  <span className="relative text-xs sm:text-sm font-medium">
                    {tech.displayName}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Every technology chosen for AI compatibility and developer experience.
            </p>
          </CardContent>
        </Card>

        {/* Project Structure */}
        <Card>
          <CardContent className="p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FolderTree className="w-5 h-5" />
              Organized Structure
            </h3>
            <div className="space-y-2 font-mono text-sm bg-zinc-900 dark:bg-zinc-950 rounded-lg p-4 overflow-x-auto">
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
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <p className="text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                AI navigates this structure with perfect understanding
              </p>
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