from sqlalchemy import Float, ForeignKey, Integer, PrimaryKeyConstraint, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

class OrderItem(Base):
    __tablename__ = "itens_pedidos"

    order_id: Mapped[str] = mapped_column(
        "id_pedido", String(32), ForeignKey("pedidos.id_pedido"), nullable=False
    )
    item_id: Mapped[int] = mapped_column("id_item", Integer, nullable=False)
    product_id: Mapped[str] = mapped_column(
        "id_produto", String(32), ForeignKey("produtos.id_produto"), nullable=False
    )
    seller_id: Mapped[str] = mapped_column(
        "id_vendedor", String(32), ForeignKey("vendedores.id_vendedor"), nullable=False
    )
    price_brl: Mapped[float] = mapped_column("preco_BRL", Float)
    shipping_price: Mapped[float] = mapped_column("preco_frete", Float)

    __table_args__ = (PrimaryKeyConstraint("id_pedido", "id_item"),)

    order: Mapped["Order"] = relationship("Order", back_populates="items")
    product: Mapped["Product"] = relationship("Product", back_populates="items")
    seller: Mapped["Seller"] = relationship("Seller", back_populates="items")
