import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const nav = "4.5rem";

const config: Config = {
	darkMode: "class",
	content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			keyframes: {
				fadeInOut: {
					"0%, 100%": { opacity: "0" },
					"50%": { opacity: "1" },
				},
			},
			animation: {
				"fade-in-out": "fadeInOut 2s infinite",
			},
			height: {
				nav: nav,
				main: `calc(100vh - ${nav})`,
			},
			colors: {
				1: {
					light: "#ffffff",
					dark: "#0f172a",
				},
				2: {
					light: "#e2e8f0",
					dark: "#1e293b",
				},
				3: {
					light: "#d1d5db",
					dark: "#334155",
				},
				text1: {
					light: "#111827",
					dark: "#f8fafc",
				},
				text2: {
					light: "#1f2937",
					dark: "#e2e8f0",
				},
				text3: {
					light: "#374151",
					dark: "#cbd5e1",
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
					light: "#d1d5db",
					dark: "#334155",
				},
			},
		},
	},
	plugins: [heroui()],
};

export default config;
