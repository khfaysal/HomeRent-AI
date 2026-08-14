from pydantic import BaseModel, Field
from typing import Dict


class ModelMetrics(BaseModel):
    mae: float
    rmse: float
    r2: float


class TrainResponse(BaseModel):
    status: str
    best_model: str
    locations: list[str]
    models: Dict[str, ModelMetrics]


class PredictRequest(BaseModel):
    location: str
    room_count: int = Field(..., gt=0, description="Number of rooms (must be > 0)")
    balcony_count: int = Field(..., ge=0, description="Number of balconies (must be >= 0)")
    road_facility: str = Field(..., pattern="^(Yes|No)$", description="Yes or No")


class PredictResponse(BaseModel):
    predicted_rent: float
    model: str
