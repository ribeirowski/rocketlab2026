from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

class Consumer(Base):
    __tablename__ = "consumidores"

    consumer_id: Mapped[str] = mapped_column("id_consumidor", String(32), primary_key=True)
    zip_prefix: Mapped[str] = mapped_column("prefixo_cep", String(10))
    consumer_name: Mapped[str] = mapped_column("nome_consumidor", String(255))
    city: Mapped[str] = mapped_column("cidade", String(100))
    state: Mapped[str] = mapped_column("estado", String(2))
