# Home Rent Prediction System

## React + Python Machine Learning Documentation

### 1. Project Overview

The **Home Rent Prediction System** is a web-based machine learning application designed to predict the expected monthly rent of a house based on specific property features and location.

The system provides an interactive React interface where a user can:

* Upload a cleaned training CSV dataset.
* Train multiple machine learning models.
* Compare model performance.
* Select or use the best-performing model for prediction.
* Enter property information such as location, room count, balcony count, and road facility.
* Receive an estimated house rent.

The machine learning operations will be completely handled by **Python**, while **React** will be responsible for the user interface.

---

# 2. Main Technologies

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript
* Axios
* Recharts or Chart.js

### Backend

* Python
* FastAPI
* Uvicorn
* Pandas
* NumPy
* Scikit-learn
* Joblib

### Machine Learning Models

Three models will be used:

1. **Linear Regression** — Baseline model
2. **Random Forest Regressor** — Main prediction model
3. **Gradient Boosting Regressor** — Comparison model

---

# 3. System Architecture

The overall system will work like this:

```text
                    ┌──────────────────────┐
                    │      React UI        │
                    │                      │
                    │ CSV Upload           │
                    │ Property Input        │
                    │ Model Performance     │
                    │ Prediction Result     │
                    └──────────┬───────────┘
                               │
                               │ HTTP / REST API
                               ▼
                    ┌──────────────────────┐
                    │   Python FastAPI     │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
          Linear Regression  Random Forest  Gradient Boosting
                 │             │             │
                 └─────────────┼─────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Prediction Engine    │
                    │                      │
                    │ Location             │
                    │ Room Count           │
                    │ Balcony Count        │
                    │ Road Facility        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Predicted House Rent │
                    └──────────────────────┘
```

---

# 4. Dataset Requirement

The uploaded CSV file should contain the **training dataset only**.

The dataset must already be:

* Cleaned
* Missing values handled
* Duplicate values handled where necessary
* Correctly formatted
* Ready for machine learning

For example:

```text
location,room_count,balcony_count,road_facility,rent
Mirpur,3,2,Yes,30000
Uttara,3,2,Yes,45000
Dhanmondi,2,1,Yes,35000
Mohammadpur,3,1,No,25000
```

The exact column names can be adjusted according to the actual dataset.

### Input Features

The system will use:

| Feature       | Description                                     |
| ------------- | ----------------------------------------------- |
| Location      | Geographic/location information of the property |
| Room Count    | Number of rooms                                 |
| Balcony Count | Number of balconies                             |
| Road Facility | Whether the property has road access/facility   |

### Target

```text
Rent
```

The model learns the relationship between these features and the rent value.

---

# 5. Important Data Processing

Although the CSV is already cleaned, the Python backend should still perform the necessary ML preprocessing.

### Numerical Features

Examples:

```text
room_count
balcony_count
```

These can be used directly by the models.

### Categorical Features

Examples:

```text
location
road_facility
```

These cannot be directly given to most scikit-learn models as raw text.

Therefore, categorical encoding should be performed.

A recommended approach is:

```text
OneHotEncoder
```

For example:

```text
Location

Mirpur
Uttara
Dhanmondi
Mohammadpur
```

can be transformed into machine-readable columns.

---

# 6. Machine Learning Workflow

The Python backend will follow this workflow:

```text
Upload CSV
     ↓
Read Dataset
     ↓
Separate Features and Target
     ↓
Preprocess Data
     ↓
Encode Categorical Features
     ↓
Train Models
     ↓
Evaluate Models
     ↓
Compare Performance
     ↓
Select Best Model
     ↓
Save Trained Model
     ↓
Accept User Input
     ↓
Predict Rent
     ↓
Return Prediction to React
```

---

# 7. Model 1 — Linear Regression

Linear Regression will be used as the **baseline model**.

Its purpose is not necessarily to produce the best prediction.

Instead, it gives us a simple reference point.

For example:

```text
Linear Regression
R² Score = 0.72
MAE = 5,800
RMSE = 8,200
```

This result can then be compared with the other models.

### Why use it?

Linear Regression is:

* Simple
* Fast
* Easy to interpret
* Useful as a baseline

---

# 8. Model 2 — Random Forest

Random Forest Regressor will be the primary prediction model.

It combines multiple decision trees and can capture nonlinear relationships between property characteristics and rent.

For example:

```text
Location + Rooms + Balcony + Road Facility
                    ↓
              Random Forest
                    ↓
              Predicted Rent
```

Random Forest is particularly useful because house rent usually does not increase in a perfectly linear manner.

For example:

```text
2 rooms → ৳20,000
3 rooms → ৳30,000
4 rooms → ৳42,000
```

The relationship is not necessarily a simple straight line.

---

# 9. Model 3 — Gradient Boosting

Gradient Boosting Regressor will be used as another comparison model.

It builds models sequentially and attempts to correct errors made by previous models.

The system can compare:

```text
Linear Regression
       vs
Random Forest
       vs
Gradient Boosting
```

This makes the project more meaningful from a machine-learning perspective.

---

# 10. Model Evaluation

The models should be evaluated using regression metrics.

### MAE — Mean Absolute Error

MAE tells us approximately how much the prediction differs from the actual rent.

For example:

```text
MAE = ৳3,500
```

means the prediction is off by approximately ৳3,500 on average.

### RMSE — Root Mean Squared Error

RMSE gives more importance to larger prediction errors.

Lower RMSE is better.

### R² Score

R² indicates how well the model explains the variation in rent.

Higher R² is better.

Example:

| Model             |  MAE | RMSE |   R² |
| ----------------- | ---: | ---: | ---: |
| Linear Regression | 5800 | 8200 | 0.72 |
| Random Forest     | 3200 | 5100 | 0.89 |
| Gradient Boosting | 3500 | 5400 | 0.87 |

In this example, Random Forest would be selected as the best model.

---

# 11. React Interface Design

The application should be a **single-page dashboard**.

The interface can have the following sections:

```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              HOME RENT PREDICTION SYSTEM                   │
│       Predict house rent using machine learning            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DATASET TRAINING                                           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │          Drag & Drop CSV Dataset                    │    │
│  │                                                     │    │
│  │             Browse CSV File                         │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│                    [ Train Models ]                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MODEL PERFORMANCE                                          │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ Linear       │ │ Random       │ │ Gradient     │        │
│  │ Regression   │ │ Forest       │ │ Boosting     │        │
│  │              │ │              │ │              │        │
│  │ R²: 0.72     │ │ R²: 0.89     │ │ R²: 0.87     │        │
│  │ MAE: 5800    │ │ MAE: 3200    │ │ MAE: 3500    │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PREDICT HOUSE RENT                                         │
│                                                             │
│  Location                 Room Count                        │
│  ┌─────────────────┐     ┌─────────────────┐               │
│  │ Select Location │     │       3         │               │
│  └─────────────────┘     └─────────────────┘               │
│                                                             │
│  Balcony Count            Road Facility                     │
│  ┌─────────────────┐     ┌─────────────────┐               │
│  │       2         │     │      Yes        │               │
│  └─────────────────┘     └─────────────────┘               │
│                                                             │
│                    [ Predict Rent ]                         │
│                                                             │
│              ESTIMATED MONTHLY RENT                         │
│                                                             │
│                    ৳ 32,500                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 12. Interface Title

### Recommended Title

**HomeRent AI**

### Subtitle

**Predict smarter. Rent better.**

Alternative:

**House Rent Prediction System**

**Machine-learning powered rental price prediction based on location and property features.**

---

# 13. Visual Design

The interface should have a modern real-estate/AI dashboard appearance.

### Recommended Style

* Clean white/light background
* Dark navy text
* Green accent
* Soft shadows
* Rounded cards
* Large typography
* Minimal borders
* Smooth hover animations
* Responsive layout

A premium color combination could be:

```text
Primary:       #0F172A
Secondary:     #1E293B
Accent:        #16A34A
Background:    #F8FAFC
Card:          #FFFFFF
Text:          #334155
```

The prediction result should be visually prominent.

For example:

```text
┌──────────────────────────────┐
│      ESTIMATED MONTHLY RENT  │
│                              │
│          ৳ 32,500            │
│                              │
│       Random Forest          │
│       Confidence/Metric      │
└──────────────────────────────┘
```

---

# 14. Backend API

FastAPI will expose REST APIs to React.

### Upload and Train

```http
POST /train
```

The React frontend sends the CSV file to this endpoint.

Python will:

1. Read the CSV.
2. Process the data.
3. Train all three models.
4. Evaluate them.
5. Save the trained models.
6. Return their performance.

Example response:

```json
{
  "status": "success",
  "best_model": "Random Forest",
  "models": {
    "linear_regression": {
      "mae": 5800,
      "rmse": 8200,
      "r2": 0.72
    },
    "random_forest": {
      "mae": 3200,
      "rmse": 5100,
      "r2": 0.89
    },
    "gradient_boosting": {
      "mae": 3500,
      "rmse": 5400,
      "r2": 0.87
    }
  }
}
```

---

# 15. Prediction API

The React application will send property information to:

```http
POST /predict
```

Example request:

```json
{
  "location": "Mirpur",
  "room_count": 3,
  "balcony_count": 2,
  "road_facility": "Yes"
}
```

Python will load the trained model and perform the prediction.

Example response:

```json
{
  "predicted_rent": 32500,
  "model": "Random Forest"
}
```

React will then display:

```text
Estimated Monthly Rent

৳ 32,500
```

---

# 16. Recommended Project Structure

```text
home-rent-prediction/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── DatasetUpload.jsx
│   │   │   ├── ModelPerformance.jsx
│   │   │   ├── PredictionForm.jsx
│   │   │   └── PredictionResult.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── main.py
│   ├── model.py
│   ├── preprocessing.py
│   ├── schemas.py
│   │
│   ├── models/
│   │   ├── linear_regression.pkl
│   │   ├── random_forest.pkl
│   │   └── gradient_boosting.pkl
│   │
│   └── requirements.txt
│
├── dataset/
│   └── train.csv
│
└── README.md
```

---

# 17. Python Backend Responsibilities

The Python backend should handle:

### Dataset

```text
CSV Upload
     ↓
Pandas DataFrame
```

### Preprocessing

```text
Categorical Encoding
        +
Numerical Features
        ↓
Preprocessed Dataset
```

### Training

```text
Linear Regression
Random Forest
Gradient Boosting
```

### Evaluation

```text
MAE
RMSE
R²
```

### Model Saving

The trained pipeline should be saved using `joblib`.

For example:

```text
random_forest.pkl
```

This means the model does not need to be retrained every time the user wants to make a prediction.

---

# 18. Why the Training Dataset Should Be Separate

The uploaded CSV is specifically considered the **training dataset**.

The system can internally split that uploaded training data into:

```text
Training Data
     │
     ├── 80% → Model Training
     │
     └── 20% → Validation/Test
```

This is important because simply training and evaluating a model on exactly the same data can give misleadingly good results.

The user therefore uploads the cleaned dataset, and Python handles the internal split.

---

# 19. Prediction Process

After training:

```text
User selects:

Location = Uttara
Rooms = 3
Balcony = 2
Road Facility = Yes
```

The frontend sends these values to Python.

Python performs:

```text
User Input
    ↓
Preprocessing
    ↓
Random Forest
    ↓
Prediction
    ↓
৳ 45,000
```

React displays the final result.

---

# 20. User Experience

The interface should guide the user through three simple stages.

### Stage 1 — Upload

```text
Upload your cleaned CSV dataset
```

Then:

```text
[ Train Models ]
```

A loading indicator should appear:

```text
Training models...

████████████░░░░░░

This may take a few moments.
```

---

### Stage 2 — Compare

After training, show the three models.

```text
MODEL COMPARISON

Linear Regression       R² 72%
Random Forest           R² 89%   ★ Best
Gradient Boosting       R² 87%
```

A small bar chart can make this section more visually understandable.

---

### Stage 3 — Predict

The user enters:

```text
Location
Room Count
Balcony Count
Road Facility
```

Then clicks:

```text
Predict Rent
```

The result appears as a large card.

---

# 21. Error Handling

The system should handle common errors.

### No Dataset

```text
Please upload a training dataset first.
```

### Invalid CSV

```text
Invalid CSV file. Please upload a valid dataset.
```

### Missing Required Columns

```text
Required columns are missing:
location, room_count, balcony_count, road_facility, rent
```

### Prediction Before Training

```text
Please train the models before making a prediction.
```

### Invalid Input

For example:

```text
Room count must be greater than 0.
```

---

# 22. Security Considerations

Since the application accepts uploaded files, the backend should validate:

* File extension
* File size
* Required columns
* Data types
* Unexpected values

Only CSV files should be accepted.

The backend should also avoid blindly executing or interpreting uploaded data.

---

# 23. Future Improvements

The project can later be extended with:

### More Features

```text
Location
Rooms
Bathrooms
Balconies
Floor
Building Age
Size
Parking
Road Width
Furnished Status
Property Type
```

### More Models

```text
XGBoost
Decision Tree
Extra Trees
Support Vector Regression
CatBoost
```

### Advanced Features

* Interactive map
* Location-based prediction
* Prediction history
* User accounts
* Download prediction report
* Model performance charts
* Feature importance
* Actual vs predicted graph
* House recommendation system
* Price-per-square-foot analysis

---

# 24. Final System Flow

The complete application can be summarized as:

```text
                USER
                  │
                  ▼
        ┌───────────────────┐
        │    React UI       │
        └─────────┬─────────┘
                  │
           Upload CSV
                  │
                  ▼
        ┌───────────────────┐
        │  FastAPI Backend  │
        └─────────┬─────────┘
                  │
                  ▼
        ┌───────────────────┐
        │ Data Preprocessing│
        └─────────┬─────────┘
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
     Linear    Random    Gradient
    Regression  Forest    Boosting
        │         │         │
        └─────────┼─────────┘
                  ▼
          Model Evaluation
                  │
                  ▼
           Best Model Saved
                  │
                  ▼
        ┌───────────────────┐
        │ Prediction Form   │
        │                   │
        │ Location          │
        │ Rooms             │
        │ Balconies         │
        │ Road Facility     │
        └─────────┬─────────┘
                  │
                  ▼
            Python Model
                  │
                  ▼
          Predicted Rent
                  │
                  ▼
        ┌───────────────────┐
        │   React Result    │
        │                   │
        │     ৳ 32,500      │
        └───────────────────┘
```

# 25. Recommended Implementation Approach

The project should be developed in this order:

**Step 1:** Prepare the cleaned training CSV.

**Step 2:** Build the Python preprocessing pipeline.

**Step 3:** Implement Linear Regression.

**Step 4:** Implement Random Forest.

**Step 5:** Implement Gradient Boosting.

**Step 6:** Evaluate all three models using MAE, RMSE, and R².

**Step 7:** Save the trained preprocessing pipeline and models using Joblib.

**Step 8:** Create FastAPI `/train` endpoint.

**Step 9:** Create FastAPI `/predict` endpoint.

**Step 10:** Build the React dashboard.

**Step 11:** Connect React with FastAPI using Axios.

**Step 12:** Add model-performance visualization.

**Step 13:** Add prediction result animation/card.

**Step 14:** Test the complete workflow from CSV upload → training → prediction.

---

# 26. Final Objective

The final application should feel less like a traditional machine-learning experiment and more like a **professional AI-powered real-estate dashboard**.

The user should be able to understand the complete process without knowing machine learning:

```text
UPLOAD DATASET
       ↓
TRAIN MODELS
       ↓
COMPARE MODELS
       ↓
ENTER PROPERTY DETAILS
       ↓
PREDICT RENT
       ↓
GET ESTIMATED MONTHLY RENT
```

The most important architectural principle is:

> **React is responsible for presentation and user interaction, while Python is responsible for preprocessing, model training, model evaluation, model storage, and rent prediction.**
