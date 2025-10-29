import Image from "next/image";
import styles from "./page.module.css";
import Card from "@/components/CardFinancas";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Pagina inicial</h1>
        <Card/>
      </main>
    </div>
  );
}
