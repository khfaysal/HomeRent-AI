import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder

REQUIRED_COLUMNS = ["location", "room_count", "balcony_count", "road_facility", "rent"]
CATEGORICAL_FEATURES = ["location", "road_facility"]
NUMERICAL_FEATURES = ["room_count", "balcony_count"]
TARGET = "rent"

COLUMN_ALIASES = {
    "location": ["location", "area", "city", "address", "loc", "neighborhood", "zone", "place"],
    "room_count": ["room_count", "room", "rooms", "bed", "beds", "bedroom", "bedrooms", "no_of_rooms", "room_qty", "total_rooms"],
    "balcony_count": ["balcony_count", "balcony", "balconies", "bath", "baths", "bathroom", "bathrooms", "no_of_balconies", "balcony_qty"],
    "road_facility": ["road_facility", "road", "road_side", "roadside", "facility", "attached_road", "road_access"],
    "rent": [
        "rent", "price", "monthly_rent", "house_rent", "amount", "cost",
        "price_in_taka", "price_taka", "taka", "rent_in_taka", "rent_taka",
        "price_in_bdt", "price_bdt", "rent_bdt", "rent_price", "total_price"
    ]
}


def normalize_and_map_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize column names and map common aliases to required standard column names."""
    normalized_cols = {col: col.strip().lower().replace(" ", "_") for col in df.columns}
    df = df.rename(columns=normalized_cols)

    rename_dict = {}
    current_cols = list(df.columns)

    for req_col, aliases in COLUMN_ALIASES.items():
        if req_col not in current_cols:
            matched = False
            for alias in aliases:
                if alias in current_cols:
                    rename_dict[alias] = req_col
                    matched = True
                    break
            # Fallback substring check for rent/price/taka
            if not matched and req_col == "rent":
                for col in current_cols:
                    if "price" in col or "rent" in col or "taka" in col:
                        rename_dict[col] = req_col
                        break

    if rename_dict:
        df = df.rename(columns=rename_dict)

    # Auto-default missing road_facility to 'Yes' so datasets without road info train seamlessly
    if "road_facility" not in df.columns:
        df["road_facility"] = "Yes"

    return df


def validate_dataframe(df: pd.DataFrame) -> None:
    """Validate that the DataFrame has required columns and sensible values."""
    missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing:
        found_cols = list(df.columns)
        raise ValueError(
            f"Missing required column(s): {missing}. "
            f"Found columns in your CSV: {found_cols}. "
            f"Expected columns: {REQUIRED_COLUMNS}."
        )

    # Clean numerical features and target
    for col in NUMERICAL_FEATURES + [TARGET]:
        df[col] = pd.to_numeric(df[col], errors="coerce")
        if df[col].isnull().any():
            raise ValueError(f"Column '{col}' contains invalid non-numeric or missing values.")

    if (df[TARGET] <= 0).any():
        raise ValueError("Rent/Price values must be greater than 0.")

    if (df["room_count"] <= 0).any():
        raise ValueError("Room count values must be greater than 0.")

    if (df["balcony_count"] < 0).any():
        raise ValueError("Balcony count values cannot be negative.")

    # Clean road_facility
    df["road_facility"] = df["road_facility"].astype(str).str.strip().str.capitalize()
    df["road_facility"] = df["road_facility"].map(
        lambda v: "Yes" if v in ["Yes", "Y", "1", "True", "1.0"] else ("No" if v in ["No", "N", "0", "False", "0.0"] else "Yes")
    )


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

