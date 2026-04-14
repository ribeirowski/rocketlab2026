from pydantic import BaseModel, ConfigDict, Field

class SellerBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    seller_name: str = Field(..., max_length=255)
    zip_prefix: str = Field(..., max_length=10)
    city: str = Field(..., max_length=100)
    state: str = Field(..., min_length=2, max_length=2, description="State code (e.g. SP)")

class SellerCreate(SellerBase):
    seller_id: str = Field(..., max_length=32, min_length=32)

class SellerResponse(SellerCreate):
    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)
