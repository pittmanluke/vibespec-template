"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

export function ThemeFavicon() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!resolvedTheme) return

    const isDark = resolvedTheme === "dark"
    const faviconPath = isDark ? "/favicon_io_white" : "/favicon_io"
    
    // Update favicon
    const favicon = document.querySelector("link[rel='icon'][sizes='any']") as HTMLLinkElement
    if (favicon) {
      favicon.href = isDark ? "/favicon_io_white/favicon.ico" : "/favicon.ico"
    }

    // Update 32x32 icon
    const icon32 = document.querySelector("link[rel='icon'][sizes='32x32']") as HTMLLinkElement
    if (icon32) {
      icon32.href = `${faviconPath}/favicon-32x32.png`
    }

    // Update 16x16 icon
    const icon16 = document.querySelector("link[rel='icon'][sizes='16x16']") as HTMLLinkElement
    if (icon16) {
      icon16.href = `${faviconPath}/favicon-16x16.png`
    }

    // Update apple touch icon
    const appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement
    if (appleTouchIcon) {
      appleTouchIcon.href = `${faviconPath}/apple-touch-icon.png`
    }

    // Update theme color
    const themeColor = document.querySelector("meta[name='theme-color']") as HTMLMetaElement
    if (themeColor) {
      themeColor.content = isDark ? "#1e1e2e" : "#6366F1"
    }
  }, [resolvedTheme])

  return null
}