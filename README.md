# Vitrine — Sistema de Gerenciamento de E-Commerce

Aplicação fullstack para gerenciamento de produtos, pedidos e avaliações de uma loja online. O gerente da loja pode visualizar o catálogo de produtos, acompanhar métricas de vendas e avaliações, além de criar, editar e remover produtos.

---

## Estrutura do repositório

```
rocketlab2026/
├── backend/    # API REST com FastAPI + SQLite
└── frontend/   # Interface web com React + Vite + TypeScript
```

---

## Stack

| Camada     | Tecnologia                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19, Vite, TypeScript, Tailwind CSS v4     |
| UI         | shadcn/ui, Radix UI, Recharts, Lucide React     |
| Estado     | Zustand, TanStack Query v5                      |
| Formulários | React Hook Form + Zod                          |
| Backend    | FastAPI, SQLAlchemy 2, Alembic, Pydantic v2     |
| Banco      | SQLite                                          |

---

## Requisitos globais

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+
- [Python](https://www.python.org/) 3.11+

---

## Como executar o projeto completo

### 1. Clone o repositório

```bash
git clone https://github.com/ribeirowski/rocketlab2026.git
cd rocketlab2026
```

### 2. Suba o backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python -m app.main
```

A API estará disponível em **http://localhost:8000**.  
Documentação interativa: **http://localhost:8000/docs**

### 3. Suba o frontend

Abra um novo terminal:

```bash
cd frontend
pnpm install
pnpm dev
```

A aplicação estará disponível em **http://localhost:5173**.

---

## Funcionalidades

- 📦 Catálogo de produtos com busca, filtros por categoria e ordenação
- 🔍 Página de detalhes com dimensões, histórico de vendas e avaliações
- ✏️ Criação, edição e remoção de produtos
- 📊 Dashboard com métricas de pedidos, gráficos mensais e ranking de produtos
- ⭐ Média de avaliações por produto
- 🌓 Suporte a tema claro e escuro

---

## Documentação específica

- [Backend →](./backend/README.md)
- [Frontend →](./frontend/README.md)
