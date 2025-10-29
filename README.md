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

## 2) Estrutura de pastas (proposta)

**/apps/frontend** (Next.js)

* /app (rotas, server actions)
* /components
* /lib (api-client, auth)
* /hooks
* /styles
* /providers

**/apps/backend** (FastAPI)

* /fina

  * **init**.py
  * main.py (pontos de entrada)
  * config.py
  * db.py (session/engine)
  * models.py (SQLAlchemy)
  * schemas.py (pydantic)
  * routes/

    * auth.py
    * users.py
    * expenses.py
    * budgets.py
    * reports.py
    * files.py (upload CSV)
  * services/

    * classifier.py (IA)
    * insights.py (IA)
    * importer.py (CSV)
    * notifier.py (e-mail/WhatsApp)
  * workers/

    * celery_app.py
    * tasks.py (classificação em lote, relatórios)
* tests/

**/infra**

* docker-compose.yml (db, redis, api, worker)
* k8s/ (manifests opcionais)
* terraform/ (se usar cloud)

---

## 3) Modelo de Dados (PostgreSQL)

### Entidades

* **users**: perfil do usuário
* **accounts**: carteiras/contas (ex: “Cartão Nubank”)
* **expenses**: lançamentos
* **categories**: hierarquia de categorias (ex: Alimentação > Delivery)
* **budgets**: metas de gasto por categoria/mês
* **insights**: mensagens de IA geradas
* **subscriptions**: status do plano/assinatura

### DDL (SQL)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_provider TEXT NOT NULL,
  auth_sub TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  name TEXT,
  currency TEXT DEFAULT 'BRL',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('cash','checking','credit','investment')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES categories(id),
  UNIQUE(user_id, name)
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  occurred_at DATE NOT NULL,
  description TEXT,
  amount_cents BIGINT NOT NULL CHECK (amount_cents >= 0),
  currency TEXT DEFAULT 'BRL',
  category_id UUID REFERENCES categories(id),
  raw_payload JSONB, -- linha bruta do CSV/extrato
  ai_confidence NUMERIC, -- 0..1
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  month DATE NOT NULL, -- use YYYY-MM-01
  amount_cents BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, category_id, month)
);

CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  type TEXT CHECK (type IN ('overspend','trend','opportunity','warning')),
  message TEXT NOT NULL,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- stripe/mercadopago
  plan TEXT NOT NULL, -- free/premium
  status TEXT NOT NULL, -- active/canceled/past_due
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_expenses_user_date ON expenses(user_id, occurred_at);
CREATE INDEX idx_expenses_user_category ON expenses(user_id, category_id);
CREATE INDEX idx_insights_user_period ON insights(user_id, period_start, period_end);
```

### Categorias iniciais (seed)

* Alimentação (Mercado, Delivery, Restaurante)
* Moradia (Aluguel, Conta de Luz, Água, Internet)
* Transporte (Combustível, Uber/99, Ônibus)
* Lazer (Streaming, Cinema)
* Saúde (Farmácia, Plano)
* Educação
* Impostos/Taxas
* Outros

---

## 4) Fluxos principais

### 4.1 Cadastro de Despesa

1. Usuário envia texto curto “Uber 35 ontem”.
2. API normaliza (valor, data, descrição).
3. Worker chama **classifier** → categoria + confiança.
4. Salva em `expenses` e retorna ao frontend.

### 4.2 Upload CSV (extrato)

1. Usuário envia CSV (Nubank/Inter etc.).
2. `importer.py` detecta layout, cria jobs por linha.
3. Cada job → classificador IA.
4. Mostra prévia para correção em massa.

### 4.3 Geração de Insights

1. Cron job semanal/mensal agrega gastos por categoria.
2. `insights.py` gera mensagens (GPT) com sugestões concretas.
3. Salva em `insights` e notifica push/e-mail.

### 4.4 Orçamentos e Alertas

1. Usuário define orçamento por categoria/mês.
2. API calcula % consumido.
3. Ao passar 80% → insight `warning` + notificação.

---

## 5) IA — Prompts & Heurísticas

### 5.1 Classificação de Despesa (síncrono, barato)

**Sistema**:
"""
Você classifica transações financeiras pessoais em UMA categoria predefinida em pt-BR. Retorne JSON válido.
Categorias e aliases:

* Alimentação (mercado, supermercado, padaria, restaurante, lanchonete, delivery, iFood, Rappi)
* Moradia (aluguel, condomínio, luz, água, internet)
* Transporte (combustível, gasolina, etanol, uber, 99, metrô, ônibus, estacionamento)
* Lazer (cinema, streaming, netflix, spotify, games)
* Saúde (farmácia, consulta, exames, plano)
* Educação (curso, faculdade, livro)
* Impostos/Taxas (IOF, tarifa, anuidade)
* Outros
  Se houver dúvida, escolha "Outros".
  """
  **Usuário** (exemplo):
  """
  Descrição: Uber do aeroporto
  Valor: 35.00
  Data: 2025-10-26
  """
  **Resposta esperada**:

```json
{"category":"Transporte","confidence":0.92}
```

**Notas**: use regex para extrair números/data se vierem misturados; aplique heurística local (ex: se descrição contém "uber|99|cabify" → Transporte).

### 5.2 Insights de Economia (assíncrono)

**Sistema**:
"""
Você é um consultor financeiro pessoal. Com base no resumo abaixo, gere entre 3 e 6 insights concretos, cada um com:

* título curto
* mensagem (1–2 frases) com números (BRL) e percentuais
* ação recomendada específica
* potencial de economia mensal estimado (R$)
  Responda em JSON (lista de objetos).
  """
  **Usuário (resumo)**:

```json
{
  "period":"2025-10",
  "income": 5000,
  "by_category": {
    "Alimentação": 1200,
    "Transporte": 650,
    "Lazer": 280,
    "Moradia": 1500,
    "Saúde": 150,
    "Educação": 0,
    "Impostos/Taxas": 90,
    "Outros": 210
  },
  "subscriptions": [
    {"name":"Netflix","amount":55},
    {"name":"Spotify","amount":21}
  ],
  "budgets": [{"category":"Delivery","limit":200, "spent":320}]
}
```

**Saída (exemplo)**:

```json
[
  {
    "title":"Corte no delivery",
    "message":"Gasto de R$320 em delivery excedeu a meta de R$200 em 60%. Reduza pedidos para 1x/semana.",
    "action":"Definir limite semanal de R$50 e cozinhar 2x/semana",
    "saving_estimate":120
  },
  {
    "title":"Transporte mais barato",
    "message":"Uber/99 somaram R$420. Considere bilhete mensal de ônibus e carona 2x/semana.",
    "action":"Alternar 8 corridas por transporte público",
    "saving_estimate":160
  }
]
```

---

## 6) API (contratos)

Base URL: `/api/v1`

### Auth

* `POST /auth/exchange` → troca token do Firebase/Auth0 por JWT interno.
*

### Usuário & Contas

* `GET /me` → perfil, planos.
* `POST /accounts` {name, type}
* `GET /accounts`

### Categorias

* `GET /categories`
* `POST /categories` {name, parent_id?}

### Despesas

* `POST /expenses` {occurred_at, description, amount, currency?, account_id?} → classifica e retorna `{... , category, ai_confidence}`
* `GET /expenses?from=2025-10-01&to=2025-10-31&category=Alimentação`
* `PATCH /expenses/:id` {category_id?, description?, amount?}
* `POST /expenses/import` (upload CSV) → job_id
* `GET /imports/:job_id` → progresso

### Orçamentos

* `POST /budgets` {category_id, month, amount}
* `GET /budgets?month=2025-10`

### Relatórios & Insights

* `GET /reports/summary?month=2025-10` → totais por categoria, renda opcional
* `POST /insights/generate?period=2025-10` → dispara worker (assíncrono)
* `GET /insights?period_start=&period_end=`

### Webhooks (pagamentos)

* `POST /webhooks/stripe` ou `/webhooks/mercadopago`

**Resposta padrão de erro**:

```json
{ "error": { "code": "BAD_REQUEST", "message": "..." }}
```

---

## 7) Exemplos de Código (trechos)

### 7.1 FastAPI — criação e classificação

```python
# apps/backend/fina/routes/expenses.py
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from ..db import session
from ..services.classifier import classify

router = APIRouter()

class ExpenseIn(BaseModel):
    occurred_at: str
    description: str
    amount: float
    currency: str | None = "BRL"
    account_id: str | None = None

@router.post("/expenses")
def create_expense(payload: ExpenseIn, user=Depends(auth_dep)):
    cat, conf = classify(payload.description)
    exp = Expense(...)
    session.add(exp); session.commit()
    return {"id": str(exp.id), "category": cat, "ai_confidence": conf}
```

### 7.2 Classificador (híbrido regras + IA)

```python
# apps/backend/fina/services/classifier.py
import re
ALIASES = {
  "Transporte": [r"uber", r"99", r"cabify", r"estacion"],
  "Alimentação": [r"ifood", r"rappi", r"mercado", r"rest(a|au)r"],
}

def by_rules(text: str):
    t = text.lower()
    for cat, pats in ALIASES.items():
        if any(re.search(p, t) for p in pats):
            return cat, 0.85
    return None, 0.0

def classify(text: str):
    cat, conf = by_rules(text)
    if cat: return cat, conf
    # fallback LLM (pseudo)
    # cat, conf = call_openai_system_prompt(...)
    return "Outros", 0.5
```

### 7.3 Next.js — Form de despesa rápida

```tsx
// apps/frontend/app/(app)/quick-add.tsx
"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export default function QuickAdd() {
  const [text, setText] = useState("");
  const mutation = useMutation(async () => {
    const payload = parseText(text); // "Uber 35 ontem" -> {description, amount, occurred_at}
    const res = await fetch("/api/expenses", { method: "POST", body: JSON.stringify(payload)});
    return res.json();
  });
  return (
    <div className="p-4 rounded-2xl shadow">
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Ex: Uber 35 ontem" className="w-full p-3"/>
      <button onClick={()=>mutation.mutate()} className="mt-2 px-4 py-2 rounded-xl">Adicionar</button>
    </div>
  );
}
```

---

## 8) Custos estimados (MVP mensal)

* Infra: $15–30 (Railway/Render + DB pequeno)
* OpenAI: $10–40 (depende de volume)
* Autenticação: $0–$23 (Auth0 hobby) / Firebase $0
* Armazenamento: $0–$5

---

## 9) Plano de Lançamento (MVP → 4 semanas)

**Semana 1**

* Autenticação + layout base
* CRUD de despesas (manual)
* Classificador regras + LLM simples

**Semana 2**

* Dashboard (cards + pizza por categoria)
* Orçamentos + % consumido

**Semana 3**

* Importação CSV (Nubank/Inter)
* Insights mensais (job assíncrono)

**Semana 4**

* Pagamentos (premium) + limites gratuitos
* E-mails/Push + termos/privacidade

**Meta**: 20 usuários beta, 5 assinantes (R$19,90) até o fim do mês 2.

---

## 10) Métricas de sucesso

* Ativação (D1): % que adiciona ≥5 despesas
* Retenção (W4): % que volta 1x/semana
* Conversão para premium: ≥8%
* Custo por insight (R$/usuário): ≤ R$1,00/mês

---

## 11) Segurança & LGPD

* Minimizar dados pessoais, pseudonimização
* Criptografia at-rest (PG) e in-transit (TLS)
* Consentimento para processamento por IA
* Botão "Excluir minha conta e dados"
* Logs sem PII

---

## 12) Roadmap pós-MVP

* App mobile (React Native)
* Conexão automática a bancos (Open Finance/BrasilID quando viável)
* Reconciliação de assinaturas
* Previsão de caixa (ARIMA leve + LLM explicativo)
* WhatsApp bot para lançamento via chat

---

## 13) Tarefas de engenharia (checklist)

* [ ] Setup monorepo (pnpm/turborepo)
* [ ] Docker local: db, redis, api, worker
* [ ] Schemas SQLAlchemy + migrações Alembic
* [ ] Middlewares (auth JWT, rate limit)
* [ ] Upload CSV + mapeamento de colunas por banco
* [ ] Classificador (regras → LLM)
* [ ] Jobs Celery (insights/relatórios)
* [ ] Pagamentos + webhooks
* [ ] UI dashboards + orçamentos
* [ ] Testes (Pytest, Playwright)

---

### Observação

Os trechos de código são exemplos de referência. Ajuste nomes, validações e tratamento de erros conforme necessário. Integrações com provedores (OpenAI, Stripe, Auth) devem usar variáveis de ambiente e armazenar secrets com segurança.
