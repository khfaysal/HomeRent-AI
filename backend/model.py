import os
import math
import joblib
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.pipeline import Pipeline

from preprocessing import (
    build_preprocessor,
    get_features_and_target,
    get_unique_locations,
    validate_dataframe,
)

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

MODEL_DEFINITIONS = {
    "linear_regression": LinearRegression(),
    "random_forest": RandomForestRegressor(n_estimators=100, random_state=42),
    "gradient_boosting": GradientBoostingRegressor(n_estimators=100, random_state=42),
}

MODEL_DISPLAY_NAMES = {
    "linear_regression": "Linear Regression",
    "random_forest": "Random Forest",
    "gradient_boosting": "Gradient Boosting",
}


def _compute_metrics(y_true, y_pred) -> dict:
    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(math.sqrt(mean_squared_error(y_true, y_pred)))
    r2 = float(r2_score(y_true, y_pred))
    return {"mae": round(mae, 2), "rmse": round(rmse, 2), "r2": round(r2, 4)}


def train_all_models(df: pd.DataFrame) -> dict:
    """
    Validate, preprocess, train all three models, evaluate on test set,
    save all artifacts to disk, and return results.
    """
    os.makedirs(MODELS_DIR, exist_ok=True)

    # Validate dataset
    validate_dataframe(df)

    # Extract features and target
    X, y = get_features_and_target(df)
    locations = get_unique_locations(df)

    # 80/20 split — models evaluated on test set only (Rule 5)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Fit and save the preprocessor once (Rule 4: reused at predict time)
    preprocessor = build_preprocessor()
    preprocessor.fit(X_train)
    joblib.dump(preprocessor, os.path.join(MODELS_DIR, "preprocessing.pkl"))

    metrics = {}

    for key, estimator in MODEL_DEFINITIONS.items():
        # Build pipeline: preprocessor (already fitted) + fresh estimator
        pipeline = Pipeline(steps=[
            ("preprocessor", build_preprocessor()),
            ("model", estimator),
        ])
        pipeline.fit(X_train, y_train)

        # Evaluate on the held-out test set
        y_pred = pipeline.predict(X_test)
        metrics[key] = _compute_metrics(y_test, y_pred)

        # Save the full pipeline
        joblib.dump(pipeline, os.path.join(MODELS_DIR, f"{key}.pkl"))

    # Determine best model by highest R²
    best_key = max(metrics, key=lambda k: metrics[k]["r2"])

    # Save best model key for prediction
    joblib.dump(best_key, os.path.join(MODELS_DIR, "best_model_key.pkl"))
    joblib.dump(locations, os.path.join(MODELS_DIR, "locations.pkl"))

    return {
        "metrics": metrics,
        "best_model_key": best_key,
        "best_model_display": MODEL_DISPLAY_NAMES[best_key],
        "locations": locations,
    }


def predict_rent(location: str, room_count: int, balcony_count: int, road_facility: str) -> dict:
    """
    Load the saved best-performing pipeline and generate a rent prediction.
    The same preprocessing pipeline fitted during training is embedded in
    the saved Pipeline object, ensuring Rule 4 compliance.
    """
    best_key_path = os.path.join(MODELS_DIR, "best_model_key.pkl")

    if not os.path.exists(best_key_path):
        raise FileNotFoundError("Please train the models before making a prediction.")

    best_key = joblib.load(best_key_path)
    pipeline_path = os.path.join(MODELS_DIR, f"{best_key}.pkl")

    if not os.path.exists(pipeline_path):
        raise FileNotFoundError("Trained model file not found. Please retrain.")

    pipeline = joblib.load(pipeline_path)

    input_df = pd.DataFrame([{
        "location": location,
        "road_facility": road_facility,
        "room_count": room_count,
        "balcony_count": balcony_count,
    }])

    predicted = pipeline.predict(input_df)[0]

    return {
        "predicted_rent": round(float(predicted), 2),
        "model": MODEL_DISPLAY_NAMES[best_key],
    }


def models_are_trained() -> bool:
    """Return True if the best model key artifact exists on disk."""
    return os.path.exists(os.path.join(MODELS_DIR, "best_model_key.pkl"))
