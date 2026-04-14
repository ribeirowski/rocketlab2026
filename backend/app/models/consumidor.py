from sqlalchemy import String
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.enums import BrazilState

class Consumer(Base):
    __tablename__ = "consumidores"

    consumer_id: Mapped[str] = mapped_column("id_consumidor", String(32), primary_key=True)
    zip_prefix: Mapped[str] = mapped_column("prefixo_cep", String(10))
    consumer_name: Mapped[str] = mapped_column("nome_consumidor", String(255))
    city: Mapped[str] = mapped_column("cidade", String(100))
    state: Mapped[BrazilState] = mapped_column(
        "estado",
        SAEnum(BrazilState, values_callable=lambda e: [m.value for m in e]),
    )

    orders: Mapped[list["Order"]] = relationship("Order", back_populates="consumer")
