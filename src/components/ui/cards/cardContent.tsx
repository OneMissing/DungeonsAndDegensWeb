"use client";
import { cn } from "@/lib/utils";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div className={cn(className)} {...props} />
  );
}