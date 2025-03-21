import { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import ThemeProvider from "@/components/providers/theme";
import Image from "next/image";
import { Providers } from "@/components/providers/heroUI";

export const metadata = {
	title: "DnD",
	description: "Playable DnD",
	icons: {
		icon: "/dnd_icon.png", 
		shortcut: "/dnd_icon.png", 
		apple: "/dnd_icon.png",
	  },
		
	
};


export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="cs" suppressHydrationWarning>
			<body className="h-screen overflow-hidden">
				<ThemeProvider>
					<Providers>
						<Navbar />
						<main className="absolute h-main top-[calc(4.5rem)] overflow-auto w-svw bg-3-light dark:bg-3-dark select-none">{children}</main>
					</Providers>
				</ThemeProvider>
			</body>
		</html>
	);
}
