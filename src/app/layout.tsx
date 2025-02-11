import { ReactNode } from 'react';
import Link from 'next/link';
import useAuth from '@/lib/useAuth';
export const metadata = {
  title: 'DnD',
  description: 'Playable DnD',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs">
      <body className="bg-gray-100 text-gray-900">
        <useAuth>
          <nav className="p-4 bg-white shadow-md flex space-x-4">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/autorization" className="hover:underline">Autorization</Link>
          </nav>
          <main className="p-6">{children}</main>
        </useAuth>
      </body>
    </html>
  );
}
