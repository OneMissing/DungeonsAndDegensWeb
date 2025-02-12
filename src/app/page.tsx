
import Link from "next/link";
export default async function PrivatePage() {
  return (
    <div className="app">
        <nav className="bg-red-500 fixed flex justify-center z-[1000] w-full">
                <Link href="/home" className="text-2xl text-white-900">Get started</Link>
        </nav>
    </div>
);
}