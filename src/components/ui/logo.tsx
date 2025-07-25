"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: number
}

export function Logo({ className, size = 32 }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className={cn("inline-block", className)} style={{ width: size, height: size }} />
  }

  const isDark = resolvedTheme === "dark"
  const logoPath = isDark 
    ? "/favicon_io_white/apple-touch-icon.png" 
    : "/favicon_io/apple-touch-icon.png"

  return (
    <Image
      src={logoPath}
      alt="VibeSpec Logo"
      width={size}
      height={size}
      className={cn("inline-block", className)}
      priority
    />
  )
}