from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Float, ForeignKey, String
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.enums import OnTimeDelivery, OrderStatus


class Order(Base):
    __tablename__ = "pedidos"

    order_id: Mapped[str] = mapped_column("id_pedido", String(32), primary_key=True)
    consumer_id: Mapped[str] = mapped_column(
        "id_consumidor", String(32), ForeignKey("consumidores.id_consumidor"), nullable=False
    )
    status: Mapped[OrderStatus] = mapped_column(
        SAEnum(OrderStatus, values_callable=lambda e: [m.value for m in e])
    )
    order_purchase_timestamp: Mapped[Optional[datetime]] = mapped_column(
        "pedido_compra_timestamp", DateTime, nullable=True
    )
    order_delivered_timestamp: Mapped[Optional[datetime]] = mapped_column(
        "pedido_entregue_timestamp", DateTime, nullable=True
    )
    estimated_delivery_date: Mapped[Optional[datetime]] = mapped_column(
        "data_estimada_entrega", DateTime, nullable=True
    )
    delivery_time_days: Mapped[Optional[float]] = mapped_column("tempo_entrega_dias", Float, nullable=True)
    estimated_delivery_time_days: Mapped[Optional[float]] = mapped_column(
        "tempo_entrega_estimado_dias", Float, nullable=True
    )
    delivery_diff_days: Mapped[Optional[float]] = mapped_column("diferenca_entrega_dias", Float, nullable=True)
    on_time_delivery: Mapped[Optional[OnTimeDelivery]] = mapped_column(
        "entrega_no_prazo",
        SAEnum(OnTimeDelivery, values_callable=lambda e: [m.value for m in e]),
        nullable=True,
    )

    consumer: Mapped["Consumer"] = relationship("Consumer", back_populates="orders")
    items: Mapped[list["OrderItem"]] = relationship("OrderItem", back_populates="order")
    reviews: Mapped[list["OrderReview"]] = relationship("OrderReview", back_populates="order")
