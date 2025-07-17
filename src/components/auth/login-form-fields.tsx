"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface LoginFormFieldsProps {
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function LoginFormFields({
  onSubmit,
  loading: isLoading
}: LoginFormFieldsProps) {
  const { toast } = useToast();
  
  const handleResetPassword = async () => {
    toast({
      title: "Reset password",
      description: "Password reset functionality will be implemented with Firebase Auth",
    });
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              onClick={handleResetPassword}
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              disabled={isLoading}
            >
              Forgot your password?
            </button>
          </div>
          <Input 
            id="password" 
            name="password"
            type="password" 
            required 
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading}
          size="lg"
          className="w-full font-semibold shadow-md hover:shadow-lg transition-all bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80 dark:shadow-lg dark:shadow-primary/20 dark:border dark:border-primary/50"
        >
          Sign In
        </Button>
      </div>
    </form>
  );
} 