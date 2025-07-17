import { cn } from "@/lib/utils";

interface FormErrorProps {
  error: string;
  className?: string;
}

export function FormError({ error, className }: FormErrorProps) {
  if (!error) return null;
  
  return (
    <div className={cn(
      "mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive",
      className
    )}>
      {error}
    </div>
  );
} 