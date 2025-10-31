'use client';
import Image from 'next/image';
import styles from './page.module.css';
import {
  Sparkles, MoveRight, Brain, TrendingUp, Bell,
  ChartColumn, Shield, Zap, CheckCircle
} from 'lucide-react';
import Reveal from './reveal.js'; // componente de reveal em JS

export default function Home() {
  return (
    <main className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.info}>
          <Reveal delay={0.00}>
            <div className={styles.ia}>
              <Sparkles />
              <p>Finanças Inteligentes com IA</p>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className={styles.titulo}>
              <h1>Controle suas finanças com inteligência artificial</h1>
            </div>
          </Reveal>

          <Reveal delay={0.10}>
            <div className={styles.text}>
              <h3>
                Registre suas despesas, receba insights personalizados e economize dinheiro de forma inteligente.
                A IA analisa seus gastos e sugere as melhores estratégias financeiras.
              </h3>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className={styles.botoes}>
              <button>
                <span>Começar Gratuitamente</span>
                <MoveRight />
              </button>
              <button>Ver Demonstração</button>
            </div>
          </Reveal>

          <Reveal delay={0.20}>
            <div className={styles.stats}>
              <div>
                <p>100%</p>
                <p>Automático</p>
              </div>
              <div>
                <p>24/7</p>
                <p>Análise IA</p>
              </div>
              <div>
                <p>+30%</p>
                <p>Economia</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25} className={styles.divImage}>
          <img src="/images/financia.png" alt="" className={styles.imageFloat} />
        </Reveal>
      </div>

      {/* Seção de Recursos */}
      <Reveal delay={0.10}>
        <div className={styles.container2}>
          <Reveal delay={0.15}>
            <div className={styles.tituloRecursos}>
              <h2>Recursos que transformam sua vida financeira</h2>
              <p>Tecnologia de ponta para tornar o controle financeiro simples e eficiente</p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className={styles.gridRecursos}>
              <Reveal delay={0.23}>
                <div className={styles.card}>
                  <div className={styles.icon}><Brain /></div>
                  <h3>IA Inteligente</h3>
                  <p>Análise avançada dos seus gastos com recomendações personalizadas para economizar.</p>
                </div>
              </Reveal>
              <Reveal delay={0.23}>
                <div className={styles.card}>
                  <div className={styles.icon}><TrendingUp /></div>
                  <h3>Previsões Precisas</h3>
                  <p>Machine learning prevê seus gastos futuros baseado no seu comportamento financeiro.</p>
                </div>
              </Reveal>
              <Reveal delay={0.23}>
                <div className={styles.card}>
                  <div className={styles.icon}><Bell /></div>
                  <h3>Alertas Automáticos</h3>
                  <p>Notificações inteligentes quando você ultrapassar limites ou tiver oportunidades de economia.</p>
                </div>
              </Reveal>
              <Reveal delay={0.23}>
                <div className={styles.card}>
                  <div className={styles.icon}><ChartColumn /></div>
                  <h3>Relatórios Detalhados</h3>
                  <p>Visualize seus gastos em gráficos interativos e relatórios mensais completos.</p>
                </div>
              </Reveal>
              <Reveal delay={0.23}>
                <div className={styles.card}>
                  <div className={styles.icon}><Shield /></div>
                  <h3>100% Seguro</h3>
                  <p>Seus dados são criptografados e protegidos com os mais altos padrões de segurança.</p>
                </div>
              </Reveal>
              <Reveal delay={0.23}>
                <div className={styles.card}>
                  <div className={styles.icon}><Zap /></div>
                  <h3>Classificação Automática</h3>
                  <p>A IA classifica automaticamente suas despesas em categorias inteligentes.</p>
                </div>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </Reveal>

      {/* 🧩 Nova seção de Insights */}
      <section className={styles.insights}>
        <div className={styles.insightsContainer}>
          <Reveal delay={0.1}>
            <div className={styles.insightsImage}>
                <img src="/images/dashboard-preview.jpg"/>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className={styles.insightsInfo}>
              <div className={styles.tag}>
                <p>Dashboard Inteligente</p>
              </div>

              <h2>Insights que fazem a diferença</h2>
              <p className={styles.desc}>
                Nossa IA analisa seus padrões de gastos e gera recomendações personalizadas
                para você economizar mais e alcançar seus objetivos financeiros.
              </p>

              <div className={styles.cards}>
                <div className={styles.card}>
                  <CheckCircle />
                  <span>Você gastou 20% a mais em delivery este mês</span>
                </div>
                <div className={styles.card}>
                  <CheckCircle />
                  <span>Economize R$150/mês cancelando assinaturas não usadas</span>
                </div>
                <div className={styles.card}>
                  <CheckCircle />
                  <span>Se investir R$300/mês, em 12 meses terá R$3.600</span>
                </div>
                <div className={styles.card}>
                  <CheckCircle />
                  <span>Defina um limite de R$200 para delivery em novembro</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section>
        <Reveal delay={0.15}>
          <div className={styles.tituloPlano}>
            <h2 className={styles.parPlano}>Escolha o plano ideal para você</h2>
            <p>Comece gratuitamente e faça upgrade quando precisar de mais recursos</p>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
