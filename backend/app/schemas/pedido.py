from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.enums import OnTimeDelivery, OrderStatus

class OrderBase(BaseModel):
    consumer_id: str = Field(..., max_length=32, min_length=32)
    status: OrderStatus = Field(..., description="Order status")
    order_purchase_timestamp: datetime | None = None
    order_delivered_timestamp: datetime | None = None
    estimated_delivery_date: datetime | None = None
    delivery_time_days: float | None = None
    estimated_delivery_time_days: float | None = None
    delivery_diff_days: float | None = None
    on_time_delivery: OnTimeDelivery | None = None

class OrderCreate(OrderBase):
    order_id: str = Field(..., max_length=32, min_length=32)

class OrderUpdate(BaseModel):
    status: OrderStatus | None = Field(None, description="Order status")
    order_purchase_timestamp: datetime | None = None
    order_delivered_timestamp: datetime | None = None
    estimated_delivery_date: datetime | None = None
    delivery_time_days: float | None = None
    estimated_delivery_time_days: float | None = None
    delivery_diff_days: float | None = None
    on_time_delivery: OnTimeDelivery | None = None

class OrderResponse(OrderCreate):
    model_config = ConfigDict(from_attributes=True)
