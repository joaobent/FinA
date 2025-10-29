"use client";
import { useState } from "react";
import styles from "./header.module.css";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <h1 className={styles.logo}>FinA</h1>

                <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
                    <ul>
                        <li><a href="#">Recursos</a></li>
                        <li><a href="#">Dashboard</a></li>
                        <li><a href="#">Preços</a></li>
                        <li><a href="#">Contato</a></li>
                    </ul>
                </nav>

                <button
                    className={styles.menuButton}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Abrir menu"
                >
                    ☰
                </button>
            </div>
            <div className={styles.right}>
                <button className={styles.toEnter}>Entrar</button>
                <button className={styles.getStarted}>Começar Grátis</button>
            </div>
        </header>
    );
}