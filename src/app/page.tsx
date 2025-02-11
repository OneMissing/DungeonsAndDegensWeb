"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const handleAuth = async () => {
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-900 w-full">
      <h1>Homepage</h1>
      <button onClick={handleAuth}>Get started</button>
    </div>
  );
}
