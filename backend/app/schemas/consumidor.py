from pydantic import BaseModel, ConfigDict, Field


class ConsumerBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    consumer_name: str = Field(..., max_length=255, description="Full name")
    zip_prefix: str = Field(..., max_length=10, description="ZIP/CEP prefix")
    city: str = Field(..., max_length=100)
    state: str = Field(..., min_length=2, max_length=2, description="State code (e.g. SP)")


class ConsumerCreate(ConsumerBase):
    consumer_id: str = Field(..., max_length=32, min_length=32, description="32-char identifier")


class ConsumerResponse(ConsumerCreate):
    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)
