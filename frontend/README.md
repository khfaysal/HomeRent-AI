# HomeRent AI — Frontend Application

An interactive, modern React + Vite application for house rent prediction, machine learning model evaluation, dataset lifecycle tracking, and custom model selection.

---

## 🌟 Key Features

* **Dataset Upload & Smart Mapping**: Supports drag-and-drop CSV uploads with automatic header alias resolution (`price_in_taka` $\rightarrow$ `rent`, `beds` $\rightarrow$ `room_count`, `baths` $\rightarrow$ `balcony_count`).
* **Target Training Model Choice**: Choose whether to train **All Models (Auto Compare)** or target **Gradient Boosting**, **Random Forest**, or **Linear Regression**.
* **Model Performance Comparison**: Interactive bar charts and metrics cards showing $R^2$ Score, MAE, and RMSE across models.
* **Tracked Trained Datasets**: View training session history, timestamps, accuracy scores, and active status.
* **Dataset & Model Purging**: Delete inappropriate dataset entries and their associated `.pkl` model binaries with a single click.
* **Target Prediction Model Choice**: Select which trained model algorithm to compute estimated rent with during predictions (**Auto Best**, **Gradient Boosting**, **Random Forest**, or **Linear Regression**).

---

## 🛠️ Tech Stack

* **Framework**: React 19 + Vite
* **Styling**: Vanilla CSS (TailwindCSS v4 compatible tokens)
* **HTTP Client**: Axios with `VITE_API_URL` environment support
* **Charts**: Recharts

---

## 🚀 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start dev server:
   ```bash
   npm run dev
   ```
   App will open at `http://localhost:5173`.

---

## 🌐 Production Deployment Setup

When deploying the frontend to static hosting services (such as Vercel, Netlify, or Render Static):

1. Set the Environment Variable:
   ```env
   VITE_API_URL=https://your-backend-api-url.onrender.com
   ```

2. Build for production:
   ```bash
   npm run build
   ```
