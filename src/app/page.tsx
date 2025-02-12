
import Link from "next/link";
import "@public/styles/style.css";
export default async function PrivatePage() {
  return (
    <div className="app">
        <nav>
            <ul>
                <li><Link href="/home">Menu pro přihlášené</Link></li>
            </ul>
        </nav>
        <div className="menu-content">
            
                <section>
                    <h2>Přihlášené menu</h2>
                    <p>Vítejte zpět! Zde jsou vaše možnosti.</p>
                </section>
        </div>
    </div>
);
}