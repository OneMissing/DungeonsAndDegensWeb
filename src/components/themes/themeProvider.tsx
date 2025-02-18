"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext<{ theme: "light" | "dark"; toggleTheme: () => void } | undefined>(undefined);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); 
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const appliedTheme = storedTheme ? (storedTheme as "light" | "dark") : prefersDark ? "dark" : "light";
    setTheme(appliedTheme);
    document.documentElement.classList.toggle("dark", appliedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {mounted ? children : <div className="opacity-0">{children}</div>}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
