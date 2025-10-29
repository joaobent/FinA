# FinA — Gestor de Despesas Pessoais com IA

> Objetivo: lançar um MVP web que classifica despesas automaticamente, gera insights de economia e envia alertas. Monetização via assinatura mensal e créditos.

---

## 1) Stack & Arquitetura

**Frontend**: Next.js (React), Tailwind, TanStack Query, Zustand (estado leve).

**Backend**: FastAPI (Python) + Uvicorn; tarefas assíncronas com Celery + Redis (para filas e jobs de IA).

**Banco**: PostgreSQL (Supabase/Railway). Armazenar faturas/relatórios em S3 compatível (Supabase Storage / Cloudflare R2).

**Autenticação**: Firebase Auth ou Auth0 (OAuth Google + e-mail/senha).

**IA**: OpenAI (GPT-4o-mini/GPT-4.1 para texto; Whisper para transcrição opcional). Opção de fallback local: spaCy + regras.

**Pagamentos**: Stripe ou Mercado Pago Subscriptions.

**Observabilidade**: Sentry (frontend/backend), Logfire/ELK, Prometheus + Grafana (opcional).

**Arquitetura (alto nível)**:

```
Web (Next.js) ──> API Gateway (FastAPI)
                      │
                      ├── PostgreSQL (dados)
                      ├── Redis (filas)
                      ├── Storage (arquivos CSV/PDF)
                      └── Workers (Celery) ──> OpenAI APIs
```

---

⚙️ FUNCIONALIDADES PRINCIPAIS
🧾 1. Cadastro e controle de despesas

Adicionar manualmente ou via upload de extrato bancário (CSV, PDF).

A IA classifica automaticamente os gastos em categorias (alimentação, transporte, lazer, etc.).

Exibe gráficos mensais (gastos x renda, categorias mais caras, etc.).

🧠 2. Inteligência financeira (IA)

Modelo de IA analisa o histórico e gera insights personalizados:

“Você poderia economizar R$150/mês cortando assinaturas não usadas.”

“Se investir R$300/mês, em 12 meses terá R$3.600.”

Sugestões automáticas de orçamento baseado no comportamento.

📊 3. Relatórios e previsões

Gera resumos semanais/mensais automáticos.

Mostra previsão de gastos futuros com base em padrões (machine learning leve).

🔔 4. Alertas inteligentes

Notifica quando o usuário passa do orçamento definido.

Sugere ajustes (“Se continuar assim, ficará negativo em 5 dias”).

🔐 5. Privacidade e segurança

Dados criptografados e processados localmente ou anonimizados.

Login via Google ou e-mail/senha.

🧩 ARQUITETURA TÉCNICA (stack recomendada)
Componente	Tecnologia sugerida
Frontend	React / Next.js + Tailwind
Backend API	FastAPI (Python)
Banco de dados	PostgreSQL ou Firebase Firestore
IA / Classificação	OpenAI GPT-4-mini ou modelo local via spaCy + embeddings
Autenticação	Firebase Auth / Auth0
Pagamentos	Stripe / Mercado Pago
Deploy	Vercel (frontend) + Railway / Render (backend)
🧠 COMO A IA ENTRA NO PROCESSO

Classificação automática de gastos

Usuário envia descrição do gasto:
“R$35, Uber — 27/10”

GPT responde: “Categoria: Transporte”.

Banco grava o gasto já classificado.

Análise e recomendações

IA lê os gastos semanais/mensais.

Gera texto tipo:

“Você gastou 18% a mais em restaurantes. Isso representa 12% da sua renda total.”

Sugestões personalizadas

GPT sugere metas:

“Defina meta de R$200/mês em delivery.”
“Cancelar uma assinatura Netflix duplicada economizaria R$55/mês.”

💰 MONETIZAÇÃO
1. Plano gratuito

Até 50 registros/mês.

1 relatório mensal gerado pela IA.

2. Plano premium (R$19,90/mês)

Análises ilimitadas.

Alertas automáticos no WhatsApp.

Exportação de relatórios PDF.

Recomendação personalizada de economia.

3. Afiliados e parcerias

Indicar contas digitais, investimentos, seguros etc.

Ganhar comissão por cada indicação.

📈 ESTRATÉGIA DE LANÇAMENTO
Etapa 1 – MVP (1 a 2 meses)

Cadastro + login.

Adicionar despesas manualmente.

Classificação automática via GPT.

Dashboard simples com gráficos.

Etapa 2 – Beta (3º mês)

Upload de extratos (CSV).

Relatórios de IA semanais.

Plano pago liberado.

Etapa 3 – Crescimento (4–6 meses)

App mobile (React Native).

Notificações push e alertas.

Parcerias com fintechs.

🎨 DESIGN / UX SUGERIDO

Interface minimalista tipo Nubank ou Mobills:

Tela inicial: “Resumo mensal”

Gráfico de pizza com categorias.

Texto da IA: “Você gastou 30% em transporte”.

Tela “Adicionar gasto”:

Input rápido (“Uber 35”)

Botão “+” → IA classifica.

Tela “Insights”:

Cartões com sugestões tipo “Economize aqui”.

🧪 DIFERENCIAIS DE MERCADO
Seu app	Concorrentes tradicionais
Usa IA para insights reais	Apenas registro de despesas
Interface simples e natural	Complexa e cheia de telas
Foco em economia real	Foco em controle manual
Suporte em português	Muitos apps importados
