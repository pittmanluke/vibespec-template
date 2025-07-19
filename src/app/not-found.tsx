import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, FileCode2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <FileCode2 className="h-24 w-24 text-muted-foreground/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-primary">404</span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Page Not Found</h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Looks like this specification got lost. The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="group">
            <Link href="/">
              <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="group">
            <Link href="/docs">
              <Search className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Browse Docs
            </Link>
          </Button>
        </div>

        {/* Additional Help */}
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">
            Need help? Try these resources:
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link 
              href="/docs/getting-started" 
              className="text-muted-foreground hover:text-foreground transition-colors hover:underline"
            >
              Getting Started
            </Link>
            <Link 
              href="https://github.com/pittmanluke/vibespec/issues" 
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors hover:underline"
            >
              Report an Issue
            </Link>
            <Link 
              href="/" 
              className="text-muted-foreground hover:text-foreground transition-colors hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Go Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}