"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailSubscribeProps {
  onSubscribe?: (email: string) => Promise<void>;
}

export function EmailSubscribe({ onSubscribe }: EmailSubscribeProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      if (onSubscribe) {
        await onSubscribe(email);
      } else {
        // Fallback: Open mailto link
        window.location.href = `mailto:updates@vibespec.com?subject=Subscribe to VibeSpec Updates&body=Please add ${email} to the VibeSpec updates list.`;
      }
      
      setSubscribed(true);
      toast({
        title: "Success!",
        description: "You'll receive updates when new features ship",
      });
      
      // Reset after 5 seconds
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 5000);
    } catch {
      toast({
        title: "Subscription failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent border-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      {/* Decorative background element */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
      
      <CardContent className="relative p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <div className="p-3 rounded-full bg-primary/10 transition-all duration-300 group-hover:bg-primary/20">
              <Mail className="w-6 h-6 text-primary transition-transform group-hover:scale-110" />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">Stay Updated</h3>
            <p className="text-muted-foreground">Get notified when new features ship</p>
          </div>
          
          {subscribed ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 animate-fade-in">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Subscribed successfully!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="flex-1 focus-ring transition-all"
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="group focus-ring transition-all hover:shadow-md"
              >
                {loading ? (
                  <span className="inline-block animate-pulse">...</span>
                ) : (
                  <>
                    Subscribe
                    <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">→</span>
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
}