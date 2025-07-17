"use client";

import { Button } from "@/components/ui/button";

interface SocialAuthButtonsProps {
  onGoogleSignIn: () => Promise<void>;
  isLoading: boolean;
}

export function SocialAuthButtons({ onGoogleSignIn, isLoading }: SocialAuthButtonsProps) {
  return (
    <div className="w-full">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onGoogleSignIn} 
        disabled={isLoading}
        className="w-full"
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z" fill="#EA4335"/>
          <path d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0909 11.9998 19.0909C8.86633 19.0909 6.21896 17.0773 5.27682 14.2618L1.2373 17.3334C3.19263 21.2953 7.26484 24.0001 11.9998 24.0001C14.9327 24.0001 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z" fill="#34A853"/>
          <path d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z" fill="#4A90E2"/>
          <path d="M5.27698 14.2619C5.03833 13.5751 4.90909 12.8273 4.90909 12.0002C4.90909 11.1792 5.03444 10.4364 5.2662 9.76367L1.23999 6.64916C0.436587 8.25825 0 10.0753 0 12.0002C0 13.9195 0.444781 15.7301 1.23746 17.3334L5.27698 14.2619Z" fill="#FBBC05"/>
        </svg>
        Google
      </Button>
    </div>
  );
} 