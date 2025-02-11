import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    "https://faxorexdovhbhbwgtgvx.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheG9yZXhkb3ZoYmhid2d0Z3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMjY0MjUsImV4cCI6MjA1NDgwMjQyNX0.JU-CjUxqYogOcuacBdzl5sTFolQRUT23fthPu33X5vg",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {

          }
        },
      },
    }
  )
}