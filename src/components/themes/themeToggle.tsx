"use client";

import { useTheme } from "@/components/themes/themeProvider";

interface ThemeToggleProps {
  className?: string | null;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-md bg-gray-200 dark:bg-gray-800 ${className}`}
    >
      {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
