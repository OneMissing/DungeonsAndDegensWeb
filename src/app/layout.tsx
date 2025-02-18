import { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
export const metadata = {
  title: "DnD",
  description: "Playable DnD",
};

export default async function RootLayout({ children,}: { children: ReactNode; }) {
  return (
    <html lang="cs">
      <body className="h-screen overflow-hidden">
        <AppRouterCacheProvider>
          <Navbar />
          <main className="h-[calc(100vh-3.5rem)] mt-14 overflow-auto">
            {children}
          </main>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
