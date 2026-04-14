from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

class Seller(Base):
    __tablename__ = "vendedores"

    seller_id: Mapped[str] = mapped_column("id_vendedor", String(32), primary_key=True)
    seller_name: Mapped[str] = mapped_column("nome_vendedor", String(255))
    zip_prefix: Mapped[str] = mapped_column("prefixo_cep", String(10))
    city: Mapped[str] = mapped_column("cidade", String(100))
    state: Mapped[str] = mapped_column("estado", String(2))
