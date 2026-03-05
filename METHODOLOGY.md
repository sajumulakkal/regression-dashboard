# Technical Documentation: ML Regression & Diagnostics Engine

This document outlines the mathematical framework and statistical validation techniques implemented in the **ML Regression Dashboard**. This engine is designed for high-stakes analytical environments where model interpretability is as critical as predictive accuracy.

---

## 1. Regression Methodologies
The engine employs a variety of linear estimators to accommodate different data characteristics and noise profiles.

### 1.1 Ordinary Least Squares (OLS)
The baseline model for the dashboard. It calculates the line that minimizes the sum of the squares of the vertical deviations between each data point and the fitted line.
* **Best use case:** Data with a clear linear trend and constant variance (homoscedasticity).

### 1.2 Regularization Techniques (Ridge & Lasso)
To combat **overfitting** and handle high-dimensional data, the engine supports:
* **Ridge ($L_2$):** Penalizes the square of the coefficients. It is excellent for reducing model complexity without removing variables.
* **Lasso ($L_1$):** Penalizes the absolute value of the coefficients. It can shrink coefficients to exactly zero, providing **automated feature selection**.



### 1.3 Huber Regression (Robust Estimator)
Standard OLS is highly sensitive to outliers. **Huber Regression** uses a loss function that is quadratic for small errors and linear for large errors, making it "robust" to anomalies in datasets like sensor noise or power plant fluctuations.

---

## 2. Statistical Validation & Diagnostics
A model is only as good as its underlying assumptions. The dashboard automates three critical diagnostic tests:

### 2.1 Multicollinearity: Variance Inflation Factor (VIF)
VIF detects if independent variables are highly correlated with each other. High multicollinearity can "inflate" the variance of the coefficients, making them unstable.
* **Thresholds:** * **VIF < 5:** Low correlation (Ideal).
  * **VIF > 10:** Severe multicollinearity; suggests removing or combining features.

### 2.2 Autocorrelation: Durbin-Watson (DW) Test
This test checks if the residuals (errors) are independent. This is vital for ensuring that there are no hidden patterns in the data that the model missed.
* **Range:** 0 to 4.
* **Result:** A value of **2.0** indicates no autocorrelation. Values near 0 or 4 suggest the model is missing key variables or trend-based information.



### 2.3 Error Distribution: Residual Analysis
The dashboard visualizes **Actual vs. Predicted** values to check for **Homoscedasticity**.
* **Goal:** Residuals should be randomly scattered.
* **Warning Sign:** A "fan" or "cone" shape (Heteroscedasticity) indicates that the model's reliability varies across different ranges of the input data.



---

## 3. Evaluation Metrics
The engine reports four primary metrics to provide a 360-degree view of model performance:

| Metric | Purpose |
| :--- | :--- |
| **$R^2$** | The percentage of variance explained by the model. |
| **Adjusted $R^2$** | $R^2$ adjusted for the number of predictors; prevents over-optimism. |
| **RMSE** | Root Mean Square Error; penalizes large outliers heavily. |
| **MAE** | Mean Absolute Error; provides the average "real-world" error magnitude. |

---

## 4. Engineering & Cloud Infrastructure
The system follows a modern **BFF (Backend-for-Frontend)** architectural pattern:

* **Computation Layer:** **FastAPI** (Python) manages the Scikit-learn and Statsmodels pipelines.
* **Deployment:** Containerized via **Docker** and deployed on **Google Cloud Run** for serverless, horizontal scaling.
* **Frontend:** **React.js** (Vite) for state-driven data visualization and real-time UI updates.

---
**Developed by [Saju Mulakkal Joseph](https://github.com/sajumulakkal)** *Expertise in Software Engineering, Cloud Infrastructure, and Data Science.*
