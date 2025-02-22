'use server'

import { revalidatePath } from 'next/cache'
import { redirect, RedirectType } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function logoutGlobal() {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut({scope: 'global'});
  revalidatePath('/', 'layout')
  redirect('/', RedirectType.replace);
}

export async function changePassword(newPassword: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if(!user){
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      console.error("Error changing password:", error.message);
      throw new Error("Failed to change password");
    }
  }

  return { success: true };
}

export async function changeEmail(newEmail: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if(!user){
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      console.error("Error changing password:", error.message);
      throw new Error("Failed to change password");
    }
  }

  return { success: true };
}