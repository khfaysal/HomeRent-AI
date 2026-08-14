import io
import pandas as pd
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import (
    TrainResponse,
    ModelMetrics,
    PredictRequest,
    PredictResponse,
    HistoryResponse,
    DatasetHistoryItem,
)
from model import (
    train_all_models,
    predict_rent,
    models_are_trained,
    record_training_history,
    load_dataset_history,
    delete_dataset_record,
)
from preprocessing import normalize_and_map_columns

app = FastAPI(title="HomeRent AI API", version="1.0.0")

# Allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/train", response_model=TrainResponse)
async def train(
    file: UploadFile = File(...),
    target_model: str = Form("all"),
):
    """
    Accept a CSV dataset, train models, evaluate them,
    save artifacts, record history, and return performance metrics.
    """
    # Validate file extension
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid CSV file."
        )

    # Read file contents with BOM & encoding fallback support
    contents = await file.read()
    try:
        try:
            text = contents.decode("utf-8-sig")
        except UnicodeDecodeError:
            text = contents.decode("latin-1")
        df = pd.read_csv(io.StringIO(text))
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Unable to parse CSV file: {str(e)}"
        )

    # Normalize & map column aliases automatically
    df = normalize_and_map_columns(df)

    # Train models
    try:
        result = train_all_models(df, target_model=target_model)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to train the models. Error: {str(e)}"
        )

    # Record in history tracking registry
    dataset_id = record_training_history(file.filename, result)

    return TrainResponse(
        status="success",
        dataset_id=dataset_id,
        best_model=result["best_model_display"],
        locations=result["locations"],
        models={
            key: ModelMetrics(**metrics)
            for key, metrics in result["metrics"].items()
        },
    )


@app.get("/history", response_model=HistoryResponse)
async def get_history():
    """Return all tracked trained datasets and the active dataset ID."""
    history = load_dataset_history()
    active_item = next((item for item in history if item.get("is_active")), None)
    active_id = active_item["id"] if active_item else None

    return HistoryResponse(
        status="success",
        history=[DatasetHistoryItem(**item) for item in history],
        active_dataset_id=active_id,
    )


@app.delete("/history/{dataset_id}", response_model=HistoryResponse)
async def delete_history_item(dataset_id: str):
    """
    Delete a dataset record along with its trained model artifacts if active.
    """
    updated_history = delete_dataset_record(dataset_id)
    active_item = next((item for item in updated_history if item.get("is_active")), None)
    active_id = active_item["id"] if active_item else None

    return HistoryResponse(
        status="success",
        history=[DatasetHistoryItem(**item) for item in updated_history],
        active_dataset_id=active_id,
    )


@app.post("/predict", response_model=PredictResponse)
async def predict(data: PredictRequest):
    """
    Accept property features, load the specified (or best) trained model,
    and return the predicted monthly rent.
    """
    if not models_are_trained():
        raise HTTPException(
            status_code=400,
            detail="Please train the models before making a prediction."
        )

    try:
        result = predict_rent(
            location=data.location,
            room_count=data.room_count,
            balcony_count=data.balcony_count,
            road_facility=data.road_facility,
            selected_model=data.selected_model or "best",
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

    return PredictResponse(
        predicted_rent=result["predicted_rent"],
        model=result["model"],
    )

