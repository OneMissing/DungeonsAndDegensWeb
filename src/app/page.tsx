"use client";
import userLogged from '@/lib/check';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  if(userLogged())
    router.push("/home");
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-900 w-full">
        <h1>Homepage</h1>
    </div>
  );
}
