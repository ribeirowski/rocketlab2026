from pydantic import BaseModel, ConfigDict, Field

class ProductBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    product_name: str = Field(..., max_length=255)
    product_category: str | None = Field(
        None,
        description="Nullable in DB after migration; omit or null if unknown",
    )
    product_weight_grams: float | None = Field(None, ge=0)
    length_cm: float | None = Field(None, ge=0)
    height_cm: float | None = Field(None, ge=0)
    width_cm: float | None = Field(None, ge=0)

class ProductCreate(ProductBase):
    product_id: str = Field(..., max_length=32, min_length=32)

class ProductResponse(ProductCreate):
    average_rating: float | None = Field(None, ge=0, le=5)
    total_sales: int | None = Field(None, ge=0)
    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)
