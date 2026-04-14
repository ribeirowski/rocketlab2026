from datetime import date, datetime
from typing import Optional

from sqlalchemy import Date, DateTime, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

class Order(Base):
    __tablename__ = "pedidos"

    order_id: Mapped[str] = mapped_column("id_pedido", String(32), primary_key=True)
    consumer_id: Mapped[str] = mapped_column(
        "id_consumidor", String(32), ForeignKey("consumidores.id_consumidor"), nullable=False
    )
    status: Mapped[str] = mapped_column(String(50))
    order_purchase_timestamp: Mapped[Optional[datetime]] = mapped_column(
        "pedido_compra_timestamp", DateTime, nullable=True
    )
    order_delivered_timestamp: Mapped[Optional[datetime]] = mapped_column(
        "pedido_entregue_timestamp", DateTime, nullable=True
    )
    estimated_delivery_date: Mapped[Optional[date]] = mapped_column("data_estimada_entrega", Date, nullable=True)
    delivery_time_days: Mapped[Optional[float]] = mapped_column("tempo_entrega_dias", Float, nullable=True)
    estimated_delivery_time_days: Mapped[Optional[float]] = mapped_column(
        "tempo_entrega_estimado_dias", Float, nullable=True
    )
    delivery_diff_days: Mapped[Optional[float]] = mapped_column("diferenca_entrega_dias", Float, nullable=True)
    on_time_delivery: Mapped[Optional[str]] = mapped_column("entrega_no_prazo", String(10), nullable=True)
