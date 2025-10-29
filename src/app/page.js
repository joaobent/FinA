'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.info}>
          <div className={styles.ia}>
            <Sparkles />
            <p>Finanças Inteligentes com IA</p>
          </div>
          <div className={styles.titulo}>
            <h1>Controle suas finanças com inteligência artificial</h1>
          </div>
          <div className={styles.text}>
            <h3>Registre suas despesas, receba insights personalizados e economize dinheiro de forma inteligente.
              A IA analisa seus gastos e sugere as melhores estratégias financeiras.</h3>
          </div>
          <div className={styles.botoes}>
            <button>Começar Gratuitamente</button>
            <button>Ver Demonstração</button>
          </div>
        </div>

        <div className={styles.divImage}>
          <img src="/images/financia.png" alt="" />
        </div>
      </div>
    </main>
  );
}
