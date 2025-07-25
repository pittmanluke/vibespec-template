import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/services/auth";
import { OnlineStatusProvider } from "@/providers/online-status-provider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeFavicon } from "@/components/theme/theme-favicon";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VibeSpec - Spec-driven development for AI coding",
  description: "Transform ideas into specifications, specifications into shipped products. Build MVPs faster with Claude Code integration and structured workflows.",
  keywords: ["nextjs", "claude code", "ai development", "specifications", "mvp", "typescript", "react"],
  authors: [{ name: "VibeSpec Team" }],
  creator: "VibeSpec",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vibespec.com",
    title: "VibeSpec - Spec-driven development for AI coding",
    description: "Transform ideas into specifications, specifications into shipped products. Build MVPs faster with Claude Code integration.",
    siteName: "VibeSpec",
    images: [
      {
        url: "https://vibespec.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "VibeSpec - Spec-driven development for AI coding",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeSpec - Spec-driven development for AI coding",
    description: "Transform ideas into specifications, specifications into shipped products.",
    images: ["https://vibespec.com/og-image.png"],
    creator: "@vibespec",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon_io/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon_io/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/favicon_io/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#6366F1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeFavicon />
          <AuthProvider>
            <OnlineStatusProvider>
              {children}
              <Toaster />
            </OnlineStatusProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}