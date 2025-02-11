import { ReactNode } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server'
import { count } from 'console';
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'DnD',
  description: 'Playable DnD',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  /*
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }
  */
  return (
    <html lang="cs">
      <body className="bg-red-100 text-red-900">
        {children}
      </body>
    </html>
  );
}
