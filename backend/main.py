import io
import pandas as pd
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import TrainResponse, ModelMetrics, PredictRequest, PredictResponse
from model import train_all_models, predict_rent, models_are_trained

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

    # Read file contents
    contents = await file.read()
    try:
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid CSV file."
        )

    # Normalize column names
    df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]

    # Train models (validation + training + evaluation + saving happens inside)
    try:
        result = train_all_models(df)
    except ValueError as e:
        error_msg = str(e)
        if "required columns" in error_msg.lower():
            raise HTTPException(status_code=400, detail=error_msg)
        raise HTTPException(
            status_code=400,
            detail="Unable to train the models. Please check your dataset."
        )
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to train the models. Please check your dataset."
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
