import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export function Button({ variant = "default", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-colors",
        variant === "default"
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "border border-transparent text-[#B99726] font-bold hover:underline",
        className
      )}
      {...props}
    />
  );
}
