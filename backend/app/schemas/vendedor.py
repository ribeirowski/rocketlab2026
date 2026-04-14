from pydantic import BaseModel, ConfigDict, Field

from app.enums import BrazilState

class SellerBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    seller_name: str = Field(..., max_length=255)
    zip_prefix: str = Field(..., max_length=10)
    city: str = Field(..., max_length=100)
    state: BrazilState = Field(..., description="Brazilian state code (e.g. SP)")

class SellerCreate(SellerBase):
    seller_id: str = Field(..., max_length=32, min_length=32)

class SellerUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    seller_name: str | None = Field(None, max_length=255)
    zip_prefix: str | None = Field(None, max_length=10)
    city: str | None = Field(None, max_length=100)
    state: BrazilState | None = Field(None, description="Brazilian state code")

class SellerResponse(SellerCreate):
    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)
