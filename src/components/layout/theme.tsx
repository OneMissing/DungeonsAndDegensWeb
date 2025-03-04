"use client";

import { useTheme } from "@/components/providers/theme";
import { AnimatePresence, motion } from "framer-motion";
import { MoonStar, Sun } from "lucide-react";
import { useState } from "react";

interface ThemeToggleProps {
	className?: string | undefined;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
	const { theme, toggleTheme } = useTheme();

	return (
		<>
			<div className="relative flex h-8 w-16 items-center rounded-full border border-gray-500 bg-1-light p-1 dark:border-gray-600 dark:bg-gray-900">
				<motion.div
					className="absolute left-1 flex h-6 w-6 p-0.5 items-center justify-center rounded-full bg-3-light dark:bg-2-dark shadow-md"
					animate={{ x: theme === "dark" ? 32 : 0 }}
					transition={{ type: "spring", stiffness: 200, damping: 20 }}>
					{theme === "dark" ? <MoonStar /> : <Sun color="yellow" />}
				</motion.div>
				<button onClick={() => toggleTheme()} className="absolute inset-0 h-full w-full cursor-pointer" />
			</div>
		</>
	);
}