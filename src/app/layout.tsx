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
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
