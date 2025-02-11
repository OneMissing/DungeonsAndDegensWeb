"use client";
import userLogged from '@/lib/check';
import { useRouter } from "next/navigation";
const router = useRouter();

const handleAuth = async () => {
  router.push('/');
};

export default function Home() {
  if(userLogged())
    router.push("/home");
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-900 w-full">
        <h1>Homepage</h1>
        <button onClick={handleAuth}></button>
    </div>
  );
}
