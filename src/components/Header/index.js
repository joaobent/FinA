import styles from "./header.module.css"

export default function Header() {
    return (
        <header className={styles.header}>
            <h1>FinA</h1>
            <nav>
                <ul>
                    <li><a href='#'>Recursos</a></li>
                    <li><a href='#'>DashBoard</a></li>
                    <li><a href='#'>Preços</a></li>
                    <li><a href='#'>Contato</a></li>
                </ul>
            </nav>
            <div className={styles.buttons}>
                <button className={styles.toEnter}>Entrar</button>
                <button className={styles.getStarted}>Começar Grátis</button>
            </div>
        </header>
    )
}