import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import NavbarHome from '@/components/ui/navbarhome';

export const metadata = {
  title: 'DnD',
  description: 'Playable DnD',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }

  return (
    <html lang="cs">
      <body className='mt-14'>
        <NavbarHome />
        <main className='h-[calc(100svh-3.5rem)]'>
        {children}
        </main>
      </body>
    </html>
  );
}
