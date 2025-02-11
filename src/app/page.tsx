"use client";
import userLogged from '@/lib/check';

export default function Home() {
  return (
    <div>
        <h1>Homepage</h1>
        { userLogged() ?  
          '<nav className="p-4 bg-white shadow-md flex space-x-4">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/autorization" className="hover:underline">Autorization</Link>
          </nav>'
        :redirect(`/autorization`);}
    </div>
  );
}
