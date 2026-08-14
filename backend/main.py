import io
import pandas as pd
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import TrainResponse, ModelMetrics, PredictRequest, PredictResponse
from model import train_all_models, predict_rent, models_are_trained
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
async def train(file: UploadFile = File(...)):
    """
    Accept a CSV dataset, train all three models, evaluate them,
    save the artifacts, and return performance metrics.
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

    # Normalize & map column aliases automatically (e.g., price->rent, beds->room_count, baths->balcony_count)
    df = normalize_and_map_columns(df)

    # Train models (validation + training + evaluation + saving happens inside)
    try:
        result = train_all_models(df)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to train the models. Error: {str(e)}"
        )

    return TrainResponse(
        status="success",
        best_model=result["best_model_display"],
        locations=result["locations"],
        models={
            key: ModelMetrics(**metrics)
            for key, metrics in result["metrics"].items()
        },
    )


@app.post("/predict", response_model=PredictResponse)
async def predict(data: PredictRequest):
    """
    Accept property features, load the best trained model,
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
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Please provide valid property information."
        )

    return PredictResponse(
        predicted_rent=result["predicted_rent"],
        model=result["model"],
    )
