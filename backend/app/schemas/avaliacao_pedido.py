from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class OrderReviewBase(BaseModel):
    order_id: str = Field(..., max_length=32, min_length=32)
    rating: int = Field(..., ge=1, le=5, description="Score from 1 to 5")
    comment_title: str | None = Field(None, max_length=255)
    comment_text: str | None = Field(None, max_length=1000)
    comment_at: datetime | None = None
    reply_at: datetime | None = None


class OrderReviewCreate(OrderReviewBase):
    review_id: str = Field(..., max_length=32, min_length=32)


class OrderReviewResponse(OrderReviewCreate):
    model_config = ConfigDict(from_attributes=True)
