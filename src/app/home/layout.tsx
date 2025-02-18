import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

interface HomeLayoutProps { children: ReactNode; }

export default async function HomeLayout({ children }: HomeLayoutProps) {
  const supabase = await createClient();
  const {data: { session },} = await supabase.auth.getSession();
  if (!session) {redirect('/login');}
  return <>{children}</>;
}
