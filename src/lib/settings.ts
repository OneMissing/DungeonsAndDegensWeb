'use server'

import { revalidatePath } from 'next/cache'
import { redirect, RedirectType } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function globalLogout(){
    const supabase = await createClient();
  
    const { error } = await supabase.auth.signOut({scope: 'global'});
    revalidatePath('/', 'layout')
    redirect('/', RedirectType.replace);
}


export async function changePassword() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('No user is logged in or there was an error retrieving the user.');
    return;
  }

  const email = user.email;

  if (!email) {
    console.error('User email is not available.');
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    console.error('Password reset email sending failed:', error.message);
    return;
  }

  console.log('Password reset email sent to:', email);
}

export async function changeEmail(newEmail: string) {
  const supabase = await createClient();

  const user = await supabase.auth.getUser();

  if (!user) {
    console.error('No user is logged in.');
    return;
  }

  const { error } = await supabase.auth.

  if (error) {
    console.error('Email update failed:', error.message);
    return;
  }

  console.log('Email updated successfully to:', newEmail);
}