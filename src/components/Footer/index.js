import styles from './footer.module.css';
import { FaTwitter, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.col}>
                    <h2 className={styles.logo}>FinA</h2>
                    <p>Controle suas finanças com inteligência artificial.</p>
                    <p>Economize mais, viva melhor.</p>

                    <div className={styles.social}>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaLinkedin /></a>
                        <a href="#"><FaEnvelope /></a>
                    </div>
                </div>

                <div className={styles.col}>
                    <h4>Produto</h4>
                    <ul>
                        <li><a href="#">Funcionalidades</a></li>
                        <li><a href="#">Preços</a></li>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Roadmap</a></li>
                    </ul>
                </div>

                <div className={styles.col}>
                    <h4>Empresa</h4>
                    <ul>
                        <li><a href="#">Sobre</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Carreiras</a></li>
                        <li><a href="#">Contato</a></li>
                    </ul>
                </div>
            </div>

            <div className={styles.bottom}>
                <p>© 2025 FinA. Todos os direitos reservados.</p>
                <div className={styles.links}>
                    <a href="#">Privacidade</a>
                    <a href="#">Termos</a>
                    <a href="#">Cookies</a>
                </div>
            </div>
        </footer>
    );
}
