import { ReactNode } from 'react';
import './globals.css';
export const metadata = {
  title: 'DnD',
  description: 'Playable DnD',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs">
      <body>
        {children}
      </body>
    </html>
  );
}
