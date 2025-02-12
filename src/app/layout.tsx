import { ReactNode } from 'react';
import './globals.css';
import Navbar from '@/components/ui/navbar';
export const metadata = {
  title: 'DnD',
  description: 'Playable DnD',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
