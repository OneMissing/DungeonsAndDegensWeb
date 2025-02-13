import { ReactNode } from 'react';
import NavbarHome from '@/components/ui/navbarhome';

export const metadata = {
  title: 'DnD',
  description: 'Playable DnD',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs">
      <body className="h-screen overflow-hidden">
        <NavbarHome />
        <main className="h-[calc(100vh-3.5rem)] mt-14 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
