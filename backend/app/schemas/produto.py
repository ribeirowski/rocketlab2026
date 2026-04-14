from pydantic import BaseModel, ConfigDict, Field

class ProductBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    product_name: str = Field(..., max_length=255)
    product_category: str | None = Field(
        None,
        description="Product category slug (e.g. 'brinquedos'). Null if unknown.",
    )
    product_weight_grams: float | None = Field(None, ge=0)
    length_cm: float | None = Field(None, ge=0)
    height_cm: float | None = Field(None, ge=0)
    width_cm: float | None = Field(None, ge=0)

class ProductCreate(ProductBase):
    product_id: str = Field(..., max_length=32, min_length=32)

class ProductUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    product_name: str | None = Field(None, max_length=255)
    product_category: str | None = Field(None, description="Product category slug/ID")
    product_weight_grams: float | None = Field(None, ge=0)
    length_cm: float | None = Field(None, ge=0)
    height_cm: float | None = Field(None, ge=0)
    width_cm: float | None = Field(None, ge=0)

class ProductResponse(ProductCreate):
    average_rating: float | None = Field(None, ge=0, le=5)
    total_sales: int | None = Field(None, ge=0)
    category_image_url: str | None = Field(None, description="Image URL for the product category")
    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)
