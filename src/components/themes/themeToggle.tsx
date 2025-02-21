"use client";

import { useTheme } from "@/components/themes/themeProvider";

export default function ThemeToggle( className? : string | null) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`${className} bg-gray-200 dark:bg-gray-800`}
    >
      {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
