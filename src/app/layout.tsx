import { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';
export const metadata = {
  title: 'DnD',
  description: 'Playable DnD',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <nav className="bg-gradient-to-r from-red-900 via-red-700 to-red-800 text-white py-4 shadow-lg border-b-4 border-white">
          <div className="container mx-auto flex justify-between items-center px-6">
            <Link href="/home">
              <a className="text-4xl font-serif font-bold text-white hover:text-yellow-400 transition duration-300">
                Dungeons & Degens
              </a>
            </Link>

            <div className="flex space-x-6">
              <Link href="/login">
                <a className="text-xl hover:text-yellow-400 transition duration-300">Home</a>
              </Link>
              <Link href="/about">
                <a className="text-xl hover:text-yellow-400 transition duration-300">About</a>
              </Link>

            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
