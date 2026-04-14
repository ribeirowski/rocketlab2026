# Frontend — Vitrine

Interface web do sistema Vitrine, construída com **React 19 + Vite + TypeScript**. Permite ao gerente da loja visualizar e gerenciar produtos, acompanhar métricas de vendas e avaliações, e navegar por um dashboard com gráficos interativos.

---

## Requisitos

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+
- Backend rodando em `http://localhost:8000` (ver [backend/README.md](../backend/README.md))

---

## Instalação e execução

```bash
# 1. Entre na pasta do frontend
cd frontend

# 2. Instale as dependências
pnpm install

# 3. Inicie o servidor de desenvolvimento
pnpm dev
```

A aplicação abre em **http://localhost:5173** e faz proxy das requisições `/api/*` para o backend automaticamente.

---

## Scripts disponíveis

| Script           | Descrição                                   |
|------------------|----------------------------------------------|
| `pnpm dev`       | Inicia o servidor de desenvolvimento         |
| `pnpm build`     | Gera o bundle de produção em `dist/`         |
| `pnpm preview`   | Serve o build de produção localmente         |
| `pnpm lint`      | Executa o ESLint                             |
| `pnpm typecheck` | Verifica os tipos sem compilar               |
| `pnpm format`    | Formata o código com Prettier               |

---

## Stack e principais dependências

| Categoria        | Biblioteca                         | Uso                                  |
|------------------|------------------------------------|--------------------------------------|
| Framework        | React 19 + Vite 7                  | Base da aplicação                    |
| Linguagem        | TypeScript 5.9                     | Tipagem estática                     |
| Estilo           | Tailwind CSS v4                    | Utilitários CSS                      |
| Componentes      | shadcn/ui + Radix UI               | Componentes acessíveis               |
| Ícones           | Lucide React                       | Iconografia                          |
| Roteamento       | React Router v7                    | Navegação entre páginas             |
| Data fetching    | TanStack Query v5                  | Cache, sincronização e revalidação  |
| Estado de UI     | Zustand v5                         | Modais, sidebar, filtros             |
| Formulários      | React Hook Form v7 + Zod v4        | Validação e submissão               |
| HTTP             | Axios v1                           | Chamadas à API                       |
| Gráficos         | Recharts v3                        | Charts do dashboard                  |
| Notificações    | Sonner v2                          | Toasts de feedback                   |
| Tema             | next-themes                        | Alternador claro/escuro              |

---

## Estrutura de pastas

```
frontend/src/
├── api/              # Funções de chamada HTTP (Axios)
├── components/
│   ├── ui/           # Componentes shadcn/ui gerados
│   ├── layout/       # AppShell, Sidebar, Header
│   └── molecules/    # MetricCard, ProductCard, ReviewsList...
├── hooks/            # Hooks TanStack Query (useProducts, useOrders...)
├── pages/            # DashboardPage, ProductsPage, ProductDetailPage
├── schemas/          # Schemas de validação Zod
├── store/            # Stores Zustand (ui.store.ts)
├── types/            # Interfaces TypeScript
├── lib/              # utils.ts, queryClient.ts
└── main.tsx          # Ponto de entrada
```

---

## Fluxo de dados

```
Página
  └→ Hook (TanStack Query)
       └→ api/ (Axios + proxy Vite)
            └→ FastAPI backend

Formulário
  └→ React Hook Form + Zod (validação)
       └→ useMutation (TanStack Query)
            └→ api/ (POST/PUT/DELETE)
                 └→ invalidateQueries (revalida cache)
```

---

## Configuração do proxy (Vite)

O `vite.config.ts` redireciona `/api/*` para `http://localhost:8000`, eliminando problemas de CORS em desenvolvimento:

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
},
```

---

## Páginas da aplicação

| Rota               | Página              | Descrição                                           |
|--------------------|---------------------|------------------------------------------------------|
| `/dashboard`       | Dashboard           | KPIs, gráficos de pedidos, ranking de produtos       |
| `/products`        | Catálogo            | Grid de produtos com busca, filtros e ordenação      |
| `/products/:id`    | Detalhe do produto  | Informações, dimensões, vendas e avaliações         |
