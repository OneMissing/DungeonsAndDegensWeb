
import Link from "next/link";
import styles from './styles.module.css';
export default async function PrivatePage() {
  return (
    <div className="app">
        <nav>
            <ul>
                <li><Link href="/home">Get started</Link></li>
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