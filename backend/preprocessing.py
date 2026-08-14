import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder

REQUIRED_COLUMNS = ["location", "room_count", "balcony_count", "road_facility", "rent"]
CATEGORICAL_FEATURES = ["location", "road_facility"]
NUMERICAL_FEATURES = ["room_count", "balcony_count"]
TARGET = "rent"


def validate_dataframe(df: pd.DataFrame) -> None:
    """Validate that the DataFrame has required columns and sensible values."""
    missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing:
        raise ValueError(f"The uploaded dataset does not contain the required columns.")

    for col in NUMERICAL_FEATURES + [TARGET]:
        if not pd.api.types.is_numeric_dtype(df[col]):
            try:
                df[col] = pd.to_numeric(df[col])
            except Exception:
                raise ValueError(f"Column '{col}' must contain numeric values.")

    if (df[TARGET] <= 0).any():
        raise ValueError("Rent values must be greater than 0.")

    if (df["room_count"] <= 0).any():
        raise ValueError("room_count values must be greater than 0.")

    if (df["balcony_count"] < 0).any():
        raise ValueError("balcony_count values cannot be negative.")


def build_preprocessor() -> ColumnTransformer:
    """Build a ColumnTransformer pipeline: OneHotEncoder for categoricals, passthrough for numericals."""
    return ColumnTransformer(
        transformers=[
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore", sparse_output=False),
                CATEGORICAL_FEATURES,
            ),
            (
                "num",
                "passthrough",
                NUMERICAL_FEATURES,
            ),
        ]
    )


def get_features_and_target(df: pd.DataFrame):
    """Split DataFrame into feature matrix X and target array y."""
    X = df[CATEGORICAL_FEATURES + NUMERICAL_FEATURES].copy()
    y = df[TARGET].values
    return X, y


def get_unique_locations(df: pd.DataFrame) -> list[str]:
    """Return sorted unique location values from the dataset."""
    return sorted(df["location"].dropna().unique().tolist())
