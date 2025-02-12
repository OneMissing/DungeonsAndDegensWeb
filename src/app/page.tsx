import Link from "next/link";
export default async function PrivatePage() {
  return(
    <div className="min-h-screen w-full">
      <h1>Landing page</h1>
      <div className="bg-blue-900 text-white p-4">Testing Blue Background</div>

      <Link href="/home">Get started</Link>
    </div>
  );
}