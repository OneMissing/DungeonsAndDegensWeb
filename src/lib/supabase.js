import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://vfqpwvxmkvctxndfzoyr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcXB3dnhta3ZjdHhuZGZ6b3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NDc2NTUsImV4cCI6MjA1NDUyMzY1NX0.Ckz5iO9dPRzxqzkOCgMj9QKprA8VtNquLd3qV_Fu4UQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
