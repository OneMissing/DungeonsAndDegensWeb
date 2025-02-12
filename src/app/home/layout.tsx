import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LogoutPage from '@/components/ui/logout';
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
      <body>
        <LogoutPage />
        {children}
      </body>
    </html>
  );
}
