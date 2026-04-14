# Backend — Vitrine

API REST do sistema Vitrine, construída com **FastAPI** e banco de dados **SQLite**. Utiliza SQLAlchemy 2 como ORM e Alembic para gestão de migrations.

---

## Requisitos

- [Python](https://www.python.org/) 3.11+

---

## Instalação e execução

**1. Entre na pasta do backend**

```bash
cd backend
```

**2. Crie e ative o ambiente virtual**

```bash
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

**3. Instale as dependências**

```bash
pip install -r requirements.txt
```

**4. Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

**5. Execute as migrations**

```bash
alembic upgrade head
```

**6. Inicie a API**

```bash
python -m app.main
```

A API estará disponível em **http://localhost:8000**  
Documentação interativa (Swagger): **http://localhost:8000/docs**  
Documentação alternativa (ReDoc): **http://localhost:8000/redoc**

---

## Dependências principais

| Biblioteca           | Versão  | Uso                              |
|----------------------|---------|----------------------------------|
| fastapi              | 0.115.6 | Framework web                    |
| uvicorn              | 0.32.1  | Servidor ASGI                    |
| sqlalchemy           | 2.0.36  | ORM                              |
| alembic              | 1.14.0  | Migrations de banco de dados     |
| pydantic             | 2.10.3  | Validação de dados e schemas     |
| pydantic-settings    | 2.7.0   | Variáveis de ambiente tipadas    |
| python-dotenv        | 1.0.1   | Leitura do arquivo `.env`        |
| pytest               | 8.3.4   | Testes automatizados             |
| httpx                | 0.28.1  | Cliente HTTP para testes         |

---

## Estrutura do projeto

```
backend/
├── app/
│   ├── main.py                  # Ponto de entrada, instância do FastAPI
│   ├── database.py              # Engine e sessão do SQLAlchemy
│   ├── config.py                # Variáveis de ambiente (Pydantic Settings)
│   ├── models/                  # Models SQLAlchemy (tabelas)
│   │   ├── consumidor.py
│   │   ├── produto.py
│   │   ├── vendedor.py
│   │   ├── pedido.py
│   │   ├── item_pedido.py
│   │   └── avaliacao_pedido.py
│   ├── schemas/                 # Schemas Pydantic (request/response)
│   │   ├── consumidor.py
│   │   ├── produto.py
│   │   ├── vendedor.py
│   │   ├── pedido.py
│   │   ├── item_pedido.py
│   │   └── avaliacao_pedido.py
│   └── routers/                 # Endpoints da API
│       ├── consumidores.py
│       ├── produtos.py
│       ├── vendedores.py
│       ├── pedidos.py
│       ├── itens_pedidos.py
│       └── avaliacoes_pedidos.py
├── alembic/
│   ├── env.py                   # Configuração do Alembic
│   └── versions/                # Arquivos de migration gerados
├── alembic.ini                  # Configuração principal do Alembic
├── requirements.txt
└── .env.example
```

---

## Banco de dados com Alembic

| Comando                                         | Ação                                         |
|-------------------------------------------------|----------------------------------------------|
| `alembic upgrade head`                          | Aplica todas as migrations pendentes         |
| `alembic current`                               | Exibe a migration atual                      |
| `alembic history`                               | Lista o histórico de migrations              |
| `alembic downgrade -1`                          | Desfaz a última migration                   |
| `alembic revision -m "descricao"`               | Cria um novo arquivo de migration            |
| `alembic revision --autogenerate -m "descricao"`| Gera migration com base nos models           |

> Após criar uma nova migration com `--autogenerate`, revise o arquivo gerado em `alembic/versions/` antes de aplicar.

---

## Principais endpoints

| Método | Rota                          | Descrição                          |
|--------|-------------------------------|--------------------------------------|
| GET    | `/products/`                  | Lista produtos (com filtros)         |
| GET    | `/products/{id}`              | Detalhe de um produto                |
| POST   | `/products/`                  | Cria um novo produto                 |
| PUT    | `/products/{id}`              | Atualiza um produto                  |
| DELETE | `/products/{id}`              | Remove um produto                    |
| GET    | `/products/{id}/reviews`      | Avaliações de um produto            |
| GET    | `/products/{id}/sales`        | Histórico de vendas de um produto   |
| GET    | `/orders/`                    | Lista pedidos (com filtros)          |
| GET    | `/orders/{id}`                | Detalhe de um pedido                 |

A documentação completa e interativa está disponível em `/docs` após iniciar a API.

---

## Testes

```bash
pytest
```

Os testes utilizam **httpx** com o cliente de testes do FastAPI (`TestClient`). Nenhuma dependência externa é necessária — o banco de dados de teste é criado em memória.

---

## Variáveis de ambiente (`.env`)

| Variável         | Padrão                  | Descrição                    |
|------------------|-------------------------|--------------------------------|
| `DATABASE_URL`   | `sqlite:///./vitrine.db` | URL de conexão com o banco    |
| `DEBUG`          | `true`                  | Modo debug do FastAPI          |
