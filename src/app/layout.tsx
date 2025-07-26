import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/services/auth";
import { OnlineStatusProvider } from "@/providers/online-status-provider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeFavicon } from "@/components/theme/theme-favicon";
import { AnalyticsProvider } from "@/providers/analytics-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/seo/structured-data";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vibespec.dev'),
  title: "VibeSpec - Spec-driven development for AI coding",
  description: "Transform ideas into specifications, specifications into shipped products. Build MVPs faster with Claude Code integration and structured workflows.",
  keywords: ["nextjs", "claude code", "ai development", "specifications", "mvp", "typescript", "react"],
  authors: [{ name: "VibeSpec Team" }],
  creator: "VibeSpec",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vibespec.dev",
    title: "VibeSpec - Spec-driven development for AI coding",
    description: "Transform ideas into specifications, specifications into shipped products. Build MVPs faster with Claude Code integration.",
    siteName: "VibeSpec",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeSpec - Spec-driven development for AI coding",
    description: "Transform ideas into specifications, specifications into shipped products.",
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
        <JsonLd data={[organizationSchema, websiteSchema]} />
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
              <AnalyticsProvider>
                {children}
                <Toaster />
              </AnalyticsProvider>
            </OnlineStatusProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}