"use client";

import { useTheme } from "@/components/themes/themeProvider";

export default function ThemeToggle(className: string | null) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className=`p-2 rounded-md bg-gray-200 dark:bg-gray-800 ${className}`>
      {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
