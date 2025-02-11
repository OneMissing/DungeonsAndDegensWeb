import './globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'DnD',
  description: 'Playable DnD',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs">
      <body className="bg-gray-100 text-gray-900">
        <nav className="p-4 bg-white shadow-md flex space-x-4">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/dashboard" className="hover:underline">Autorization</Link>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
