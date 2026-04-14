from typing import Optional

from sqlalchemy import Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

class Product(Base):
    __tablename__ = "produtos"

    product_id: Mapped[str] = mapped_column("id_produto", String(32), primary_key=True)
    product_name: Mapped[str] = mapped_column("nome_produto", String(255))
    product_category: Mapped[Optional[str]] = mapped_column("categoria_produto", String, nullable=True)
    product_weight_grams: Mapped[Optional[float]] = mapped_column("peso_produto_gramas", Float, nullable=True)
    length_cm: Mapped[Optional[float]] = mapped_column("comprimento_centimetros", Float, nullable=True)
    height_cm: Mapped[Optional[float]] = mapped_column("altura_centimetros", Float, nullable=True)
    width_cm: Mapped[Optional[float]] = mapped_column("largura_centimetros", Float, nullable=True)
