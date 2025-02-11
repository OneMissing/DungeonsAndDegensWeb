import { ReactNode } from 'react';

export const metadata = {
  title: 'DnD',
  description: 'Playable DnD',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs">
      <body className="bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}
