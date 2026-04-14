from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

class OrderReview(Base):
    __tablename__ = "avaliacoes_pedidos"

    review_id: Mapped[str] = mapped_column("id_avaliacao", String(32), primary_key=True)
    order_id: Mapped[str] = mapped_column(
        "id_pedido", String(32), ForeignKey("pedidos.id_pedido"), nullable=False
    )
    rating: Mapped[int] = mapped_column("avaliacao", Integer)
    comment_title: Mapped[Optional[str]] = mapped_column("titulo_comentario", String(255), nullable=True)
    comment_text: Mapped[Optional[str]] = mapped_column("comentario", String(1000), nullable=True)
    comment_at: Mapped[Optional[datetime]] = mapped_column("data_comentario", DateTime, nullable=True)
    reply_at: Mapped[Optional[datetime]] = mapped_column("data_resposta", DateTime, nullable=True)