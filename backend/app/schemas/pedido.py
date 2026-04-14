from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class OrderBase(BaseModel):
    consumer_id: str = Field(..., max_length=32, min_length=32)
    status: str = Field(..., max_length=50, description="Order status (required in DB)")
    order_purchase_timestamp: datetime | None = None
    order_delivered_timestamp: datetime | None = None
    estimated_delivery_date: date | None = None
    delivery_time_days: float | None = None
    estimated_delivery_time_days: float | None = None
    delivery_diff_days: float | None = None
    on_time_delivery: str | None = Field(None, max_length=10)


class OrderCreate(OrderBase):
    order_id: str = Field(..., max_length=32, min_length=32)


class OrderResponse(OrderCreate):
    model_config = ConfigDict(from_attributes=True)
