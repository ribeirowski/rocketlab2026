import pandas as pd
from pathlib import Path
from sqlalchemy import text

from app.database import engine

DATA_DIR = Path(__file__).parent.parent / "data"

def populate_table(
    csv_filename: str,
    table_name: str,
    parse_dates: list[str] | None = None,
    dedup_column: str | None = None,
):
    print(f"Populating table '{table_name}'...")
    df = pd.read_csv(
        DATA_DIR / csv_filename,
        parse_dates=parse_dates,
        na_values=["", " ", "None", "NULL", "NaN", "nan"],
        keep_default_na=True,
        encoding="utf-8",
    )

    print(f"   -> {df.shape[0]:,} rows | columns: {df.columns.tolist()}")

    if dedup_column:
        before = len(df)
        df = df.drop_duplicates(subset=[dedup_column], keep="first")
        print(
            f"   -> {before - len(df)} duplicates removed in '{dedup_column}' "
            f"({len(df):,} unique)"
        )

    df.to_sql(
        table_name,
        engine,
        if_exists="append",
        index=False,
        method="multi",
        chunksize=100,
    )
    print(f"   -> {len(df):,} rows inserted into '{table_name}'\n")

def verify_population() -> None:
    tables = [
        "consumidores",
        "vendedores",
        "produtos",
        "pedidos",
        "itens_pedidos",
        "avaliacoes_pedidos",
    ]

    print("Checking row counts...")
    with engine.connect() as conn:
        for table in tables:
            count = conn.execute(text(f"SELECT COUNT(*) FROM {table}")).scalar()
            print(f"   - {table}: {count:,} rows")

if __name__ == "__main__":
    populate_table("dim_consumidores.csv", "consumidores")
    populate_table("dim_vendedores.csv", "vendedores")
    populate_table("dim_produtos.csv", "produtos")
    populate_table(
        "fat_pedidos.csv",
        "pedidos",
        parse_dates=[
            "pedido_compra_timestamp",
            "pedido_entregue_timestamp",
            "data_estimada_entrega",
        ],
    )
    populate_table("fat_itens_pedidos.csv", "itens_pedidos")
    populate_table(
        "fat_avaliacoes_pedidos.csv",
        "avaliacoes_pedidos",
        parse_dates=["data_comentario", "data_resposta"],
        dedup_column="id_avaliacao",
    )

    verify_population()
    print("\n✅ Database populated successfully!")