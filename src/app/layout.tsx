import { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import ThemeProvider from "@/components/themes/themeProvider";
import { Providers } from "./provider";

export const metadata = {
    title: "DnD",
    description: "Playable DnD",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang='cs' suppressHydrationWarning>
            <body className='h-screen overflow-hidden'>
                <Providers>
                    <ThemeProvider>
                        <Navbar />
                        <main className='absolute h-main top-[calc(4.5rem)] overflow-auto w-svw bg-background-light dark:bg-background-dark'>
                            {children}
                        </main>
                    </ThemeProvider>
                </Providers>
            </body>
        </html>
    );
}
