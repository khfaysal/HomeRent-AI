import os
import math
import json
import time
import tempfile
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


def get_models_dir() -> str:
    """
    Return a writable directory path for saving trained models and history JSON.
    First tries local 'backend/models/' directory.
    If read-only (e.g. Vercel Serverless / AWS Lambda /var/task), falls back to /tmp/homerent_models.
    """
    local_dir = os.path.join(os.path.dirname(__file__), "models")
    try:
        os.makedirs(local_dir, exist_ok=True)
        test_file = os.path.join(local_dir, ".write_test")
        with open(test_file, "w") as f:
            f.write("test")
        os.remove(test_file)
        return local_dir
    except (PermissionError, OSError):
        tmp_dir = os.path.join(tempfile.gettempdir(), "homerent_models")
        os.makedirs(tmp_dir, exist_ok=True)
        return tmp_dir


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
    models_dir = get_models_dir()
    os.makedirs(models_dir, exist_ok=True)

    # Validate dataset
    validate_dataframe(df)

    # Extract features and target
    X, y = get_features_and_target(df)
    locations = get_unique_locations(df)

    # 80/20 split — models evaluated on test set only
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Fit and save the preprocessor once
    preprocessor = build_preprocessor()
    preprocessor.fit(X_train)
    joblib.dump(preprocessor, os.path.join(models_dir, "preprocessing.pkl"))

    metrics = {}

    for key, estimator in MODEL_DEFINITIONS.items():
        # Build pipeline: preprocessor + estimator
        pipeline = Pipeline(steps=[
            ("preprocessor", build_preprocessor()),
            ("model", estimator),
        ])
        pipeline.fit(X_train, y_train)

        # Evaluate on test set
        y_pred = pipeline.predict(X_test)
        metrics[key] = _compute_metrics(y_test, y_pred)

        # Save full pipeline
        joblib.dump(pipeline, os.path.join(models_dir, f"{key}.pkl"))

    # Determine best model by highest R²
    best_key = max(metrics, key=lambda k: metrics[k]["r2"])

    # Save best model key and locations for prediction
    joblib.dump(best_key, os.path.join(models_dir, "best_model_key.pkl"))
    joblib.dump(locations, os.path.join(models_dir, "locations.pkl"))

    return {
        "metrics": metrics,
        "best_model_key": best_key,
        "best_model_display": MODEL_DISPLAY_NAMES[best_key],
        "locations": locations,
    }


def predict_rent(location: str, room_count: int, balcony_count: int, road_facility: str) -> dict:
    """
    Load the saved best-performing pipeline and generate a rent prediction.
    """
    models_dir = get_models_dir()
    best_key_path = os.path.join(models_dir, "best_model_key.pkl")

    if not os.path.exists(best_key_path):
        raise FileNotFoundError("Please train the models before making a prediction.")

    best_key = joblib.load(best_key_path)
    pipeline_path = os.path.join(models_dir, f"{best_key}.pkl")

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
    return os.path.exists(os.path.join(get_models_dir(), "best_model_key.pkl"))


def load_dataset_history() -> list[dict]:
    """Load tracked dataset history from JSON file."""
    history_file = os.path.join(get_models_dir(), "dataset_history.json")
    if not os.path.exists(history_file):
        return []
    try:
        with open(history_file, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def save_dataset_history(history: list[dict]) -> None:
    """Save dataset history list to JSON file."""
    models_dir = get_models_dir()
    history_file = os.path.join(models_dir, "dataset_history.json")
    try:
        with open(history_file, "w", encoding="utf-8") as f:
            json.dump(history, f, indent=2)
    except Exception:
        pass


def record_training_history(filename: str, train_result: dict) -> str:
    """Record a dataset training session in history and set it active."""
    history = load_dataset_history()
    dataset_id = f"ds_{int(time.time())}"
    timestamp_str = pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")

    for item in history:
        item["is_active"] = False

    best_key = train_result["best_model_key"]
    best_metrics = train_result["metrics"][best_key]

    new_item = {
        "id": dataset_id,
        "filename": filename,
        "timestamp": timestamp_str,
        "best_model": train_result["best_model_display"],
        "r2_score": best_metrics["r2"],
        "metrics": train_result["metrics"],
        "locations": train_result["locations"],
        "is_active": True,
    }

    history.insert(0, new_item)
    save_dataset_history(history)
    return dataset_id


def purge_model_files():
    """Delete trained .pkl model files from disk."""
    models_dir = get_models_dir()
    if not os.path.exists(models_dir):
        return
    for filename in os.listdir(models_dir):
        if filename.endswith(".pkl"):
            try:
                os.remove(os.path.join(models_dir, filename))
            except Exception:
                pass


def delete_dataset_record(dataset_id: str) -> list[dict]:
    """
    Delete a dataset record. If it was active and history becomes empty,
    purge saved model artifacts from disk.
    """
    history = load_dataset_history()
    deleted_was_active = False

    for item in history:
        if item["id"] == dataset_id and item.get("is_active"):
            deleted_was_active = True
            break

    updated_history = [item for item in history if item["id"] != dataset_id]

    if deleted_was_active:
        if updated_history:
            updated_history[0]["is_active"] = True
        else:
            purge_model_files()

    save_dataset_history(updated_history)
    return updated_history
