"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignupFormFieldsProps {
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function SignupFormFields({
  onSubmit,
  loading: isLoading
}: SignupFormFieldsProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-3">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            disabled={isLoading}
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            disabled={isLoading}
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            type="text"
            disabled={isLoading}
            required
          />
        </div>
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
          <Label htmlFor="password">Password</Label>
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
          Create Account
        </Button>
      </div>
    </form>
  );
} 