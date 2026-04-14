from sqlalchemy import String
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.enums import BrazilState

class Seller(Base):
    __tablename__ = "vendedores"

    seller_id: Mapped[str] = mapped_column("id_vendedor", String(32), primary_key=True)
    seller_name: Mapped[str] = mapped_column("nome_vendedor", String(255))
    zip_prefix: Mapped[str] = mapped_column("prefixo_cep", String(10))
    city: Mapped[str] = mapped_column("cidade", String(100))
    state: Mapped[BrazilState] = mapped_column(
        "estado",
        SAEnum(BrazilState, values_callable=lambda e: [m.value for m in e]),
    )

    items: Mapped[list["OrderItem"]] = relationship("OrderItem", back_populates="seller")
