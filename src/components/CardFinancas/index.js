"use client";
import React from "react";
import styles from "./card.module.css";
import { Wallet, TrendingDown, TrendingUp, Target, ArrowUpRight, ArrowDownRight, Minus, } from "lucide-react";

export default function CardFinancas({ tipo, valor, observacao = "", percentual }) {
  // Deriva título, classe e ícone principal a partir do tipo
  let titulo = "Informação Financeira";
  let tipoClass = "";
  let icon = null;

  switch (tipo) {
    case "renda":
      titulo = "Renda Mensal";
      icon = <Wallet size={24} />;
      tipoClass = styles.rendaMensal;
      break;
    case "despesa":
      titulo = "Total de Despesas";
      icon = <TrendingDown size={24} />;
      tipoClass = styles.despesaTotal;
      break;
    case "saldo":
      titulo = "Saldo disponível";
      icon = <TrendingUp size={24} />;
      tipoClass = styles.saldoDisponivel;
      break;
    case "meta":
      titulo = "Metas de Economia";
      icon = <Target size={24} />;
      tipoClass = styles.metasEconomia;
      break;
  }

  // Lógica do badge de percentual
  const pct =
    percentual === undefined || percentual === null
      ? null
      : typeof percentual === "string"
        ? Number(percentual)
        : percentual;

  let badge = null;
  if (pct !== null && !Number.isNaN(pct)) {
    const isUp = pct > 0;
    const isDown = pct < 0;
    const sign = isUp ? "+" : isDown ? "" : "";
    const text = `${sign}${pct.toFixed(1)}%`;

    const variantClass = isUp
      ? styles.percentualUp
      : isDown
        ? styles.percentualDown
        : styles.percentualNeutral;

    const Icon = isUp ? ArrowUpRight : isDown ? ArrowDownRight : Minus;

    badge = (
      <span className={`${styles.percentual} ${variantClass}`} aria-label={`Variação ${text}`}>
        <Icon size={16} />
        <span>{text}</span>
      </span>
    );
  }

  return (
    <div className={`${tipoClass} ${styles.cardBase}`}>
      <div className={styles.icone}>{icon}</div>

      {/* Cabeçalho com título e badge alinhados */}
      <div className={styles.header}>
        <h3 className={styles.titulo}>{titulo}</h3>
        {badge}
      </div>

      <p className={styles.valor}>{valor}</p>
      <p className={styles.observacao}>{observacao ? observacao : ""}</p>
    </div>
  );
}
