from pydantic import BaseModel, Field
from typing import Dict, Optional


class ModelMetrics(BaseModel):
    mae: float
    rmse: float
    r2: float


class TrainResponse(BaseModel):
    status: str
    dataset_id: str
    best_model: str
    locations: list[str]
    models: Dict[str, ModelMetrics]


class PredictRequest(BaseModel):
    location: str
    room_count: int = Field(..., gt=0, description="Number of rooms (must be > 0)")
    balcony_count: int = Field(..., ge=0, description="Number of balconies (must be >= 0)")
    road_facility: str = Field(..., pattern="^(Yes|No)$", description="Yes or No")
    selected_model: Optional[str] = Field("best", description="Model choice: best, random_forest, gradient_boosting, linear_regression")


class PredictResponse(BaseModel):
    predicted_rent: float
    model: str


class DatasetHistoryItem(BaseModel):
    id: str
    filename: str
    timestamp: str
    best_model: str
    r2_score: float
    metrics: Dict[str, ModelMetrics]
    locations: list[str]
    is_active: bool


class HistoryResponse(BaseModel):
    status: str
    history: list[DatasetHistoryItem]
    active_dataset_id: Optional[str] = None

