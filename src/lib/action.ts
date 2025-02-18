'use server'

import { revalidatePath } from 'next/cache'
import { redirect, RedirectType } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { Replace } from 'lucide-react'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/home')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()


  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }
  
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout(){
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut({scope: 'local'});
  revalidatePath('/', 'layout')
  redirect('/', RedirectType.replace);

}