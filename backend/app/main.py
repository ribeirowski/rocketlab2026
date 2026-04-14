from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import avaliacoes, consumidores, pedidos, produtos, vendedores

app = FastAPI(
    title="Online Shopping API",
    description="REST API for orders, products, consumers, and sellers.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(produtos.router)
app.include_router(consumidores.router)
app.include_router(vendedores.router)
app.include_router(pedidos.router)
app.include_router(avaliacoes.router)

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "API is running."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)