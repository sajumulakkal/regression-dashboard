# ML Regression Engine & Analytics Dashboard

A high-performance, full-stack analytical platform designed for automated machine learning regression and statistical validation. This project bridges the gap between raw data and interpretable insights, providing a containerized solution for rapid model prototyping.

**Live Demo:** [https://ml-regression-engine.netlify.app/](https://ml-regression-engine.netlify.app/)

---

## 🚀 Architecture Overview

The system utilizes a decoupled, "BFF" (Backend-for-Frontend) architecture to ensure scalability and high availability:

* **Frontend:** React.js (Vite) deployed on **Netlify** for a responsive, state-driven user experience.
* **Backend:** FastAPI (Python) deployed on **Google Cloud Run** for high-performance asynchronous processing.
* **Infrastructure:** Containerized via Docker to ensure environment parity across local and cloud environments.

## 🛠️ Technical Key Features

### 1. Advanced Regression Suite
Supports multiple regression architectures to handle diverse data distributions:
* **OLS (Ordinary Least Squares):** The gold standard for linear relationships.
* **Ridge & Lasso:** Regularization techniques to prevent overfitting.
* **Robust Huber:** For datasets with significant outliers.
* **SVR (Support Vector Regression):** For non-linear complex mappings.

### 2. Statistical Rigor & Diagnostics
Unlike basic ML tools, this engine automates critical econometric validation:
* **Multicollinearity Check:** Automated **VIF (Variance Inflation Factor)** calculation to identify redundant features.
* **Independence Test:** **Durbin-Watson** diagnostics to detect autocorrelation in residuals.
* **Performance Metrics:** Real-time reporting of $R^2$, Adjusted $R^2$, and RMSE.

### 3. Seamless Data Handling
* Dynamic CSV ingestion.
* Instant feature selection for target and predictor variables.
* Real-time visualization of regression plots.

---

## 💻 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Tailwind CSS, Axios, Vite |
| **Backend** | Python, FastAPI, Uvicorn |
| **Data Science** | Scikit-learn, Pandas, Statsmodels, NumPy |
| **Cloud/DevOps** | Google Cloud Run (GCP), Netlify, Docker |

---

## 🔧 Installation & Local Setup

### Backend (WSL/Linux/Mac)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python index.py
