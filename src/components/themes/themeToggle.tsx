"use client";

import { useTheme } from "@/components/themes/themeProvider";

interface ThemeToggleProps {
  className?: string | undefined;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={className}
    >
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  );
}
