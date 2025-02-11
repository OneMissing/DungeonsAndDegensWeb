import Link from "next/link";
export default async function PrivatePage() {
  return(
    <div className="flex items-center justify-center min-h-screen bg-red-900 w-full">
      <h1>Landing page</h1>
      <Link href="/home">Dashboard</Link>
    </div>
  );
}