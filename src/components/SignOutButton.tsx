import supabase from '@/lib/supabase';
export default function App(){ return(
<button onClick={() => supabase.auth.signOut()}>Sign Out</button>
)}