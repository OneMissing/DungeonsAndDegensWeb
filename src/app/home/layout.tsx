import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/signOut';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'DnD',
  description: 'Playable DnD',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/');
  }

  return (
    <html lang="cs">
      <body className="bg-red-100 text-red-900">
        {children}
      </body>
    </html>
  );
}
