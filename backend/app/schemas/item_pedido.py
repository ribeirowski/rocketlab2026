from pydantic import BaseModel, ConfigDict, Field


class OrderItemBase(BaseModel):
    order_id: str = Field(..., max_length=32, min_length=32)
    product_id: str = Field(..., max_length=32, min_length=32)
    seller_id: str = Field(..., max_length=32, min_length=32)
    price_brl: float = Field(..., ge=0, description="Line price in BRL")
    shipping_price: float = Field(..., ge=0, description="Shipping share in BRL")


class OrderItemCreate(OrderItemBase):
    item_id: int = Field(..., ge=1, description="Line number within the order")


class OrderItemResponse(OrderItemCreate):
    model_config = ConfigDict(from_attributes=True)
