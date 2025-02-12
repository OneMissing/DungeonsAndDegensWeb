
import Link from "next/link";
export default async function PrivatePage() {
  return (
    <div className="app">
        <nav>
                <Link href="/home">Get started</Link>
        </nav>
    </div>
);
}