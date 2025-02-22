import type { Config } from "tailwindcss";
import {heroui} from "@heroui/react";

const nav = "4.5rem"
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      height: {
        "nav": nav,
        "main": `calc(100vh - ${nav})`,
      },
      colors: {
        background: {
          light: "#f8fafc",
          dark: "#0f172a",
        },
        foreground: {
          light: "#1e293b",
          dark: "#f1f5f9",
        },
        primary: {
          light: "#2563eb",
          dark: "#3b82f6",
        },
        secondary: {
          light: "#d97706",
          dark: "#f59e0b",
        },
        accent: {
          light: "#10b981",
          dark: "#34d399",
        },
        border: {
          light: "#e2e8f0",
          dark: "#334155",
        },
      },
    },
  },
  plugins: [heroui()]
};
export default config;