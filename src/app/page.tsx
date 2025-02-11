"use client";

import userLogged from "@/lib/check";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (userLogged()) {
      router.push("/home");
    }
  }, [router]);

  const handleAuth = async () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-900 w-full">
      <h1>Homepage</h1>
      <button onClick={handleAuth}>Go</button>
    </div>
  );
}
