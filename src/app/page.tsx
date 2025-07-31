import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ModeToggle } from "@/components/theme/mode-toggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-2">
          <Logo size={48} />
          <h1 className="text-4xl font-bold">Welcome</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-md">
          Get started with your new app powered by the VibeSpec template.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-8">
          Learn more about VibeSpec at{" "}
          <Link href="https://vibespec.dev" className="underline hover:text-foreground transition">
            vibespec.dev
          </Link>
        </p>
      </div>
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
    </div>
  );
}