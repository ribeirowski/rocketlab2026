from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

class Category(Base):
    __tablename__ = "categorias"

    category_name: Mapped[str] = mapped_column("nome_categoria", String(100), primary_key=True)
    image_url: Mapped[str] = mapped_column("url_imagem", String(500))

    products: Mapped[list["Product"]] = relationship("Product", back_populates="category")