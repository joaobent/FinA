"use client";
import React from "react";
import CardFinancas from "@/components/CardFinancas";
import styles from './home.module.css'
export default function Home() {
  return (
    <div className={styles.a}>
      <h1>Tela homea</h1>
      <CardFinancas
        tipo="renda"
        valor="R$ 8.250,00"
        percentual={+6.3}
        observacao="Comparado ao mês passado"
      />
      <CardFinancas
        tipo="despesa"
        valor="R$ 5.120,00"
        percentual={-2.1}
        observacao="Queda em assinaturas"
      />
      <CardFinancas tipo="saldo" valor="R$ 3.130,00" />
      <CardFinancas tipo="meta" valor="70% concluída" percentual={0} />
    </div>
  );
}
