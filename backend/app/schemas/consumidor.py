from pydantic import BaseModel, ConfigDict, Field

from app.enums import BrazilState

class ConsumerBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    consumer_name: str = Field(..., max_length=255, description="Full name")
    zip_prefix: str = Field(..., max_length=10, description="ZIP/CEP prefix")
    city: str = Field(..., max_length=100)
    state: BrazilState = Field(..., description="Brazilian state code (e.g. SP)")

class ConsumerCreate(ConsumerBase):
    consumer_id: str = Field(..., max_length=32, min_length=32, description="32-char identifier")

class ConsumerUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    consumer_name: str | None = Field(None, max_length=255, description="Full name")
    zip_prefix: str | None = Field(None, max_length=10, description="ZIP/CEP prefix")
    city: str | None = Field(None, max_length=100)
    state: BrazilState | None = Field(None, description="Brazilian state code")

class ConsumerResponse(ConsumerCreate):
    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)
