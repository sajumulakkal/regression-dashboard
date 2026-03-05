import { useState } from 'react'
import Papa from 'papaparse'
import './App.css'

const MODEL_SCHEMA = {
  LinearRegression: { name: "Linear Regression (OLS)", params: [] },
  Ridge: { name: "Ridge (L2 Regularization)", params: [{ id: "alpha", label: "Alpha (Penalty)", type: "range", min: 0.1, max: 20, step: 0.1, default: 1.0 }] },
  Lasso: { name: "Lasso (L1 Regularization)", params: [{ id: "alpha", label: "Alpha (Penalty)", type: "range", min: 0.1, max: 20, step: 0.1, default: 1.0 }] },
  ElasticNet: { 
    name: "Elastic Net (L1+L2)", 
    params: [
      { id: "alpha", label: "Alpha", type: "range", min: 0.1, max: 10, step: 0.1, default: 1.0 },
      { id: "l1_ratio", label: "L1 Ratio", type: "range", min: 0, max: 1, step: 0.1, default: 0.5 }
    ] 
  },
  Polynomial: { name: "Polynomial Regression", params: [{ id: "degree", label: "Polynomial Degree", type: "number", min: 2, max: 5, default: 2 }] },
  HuberRegressor: { name: "Huber (Robust)", params: [{ id: "epsilon", label: "Epsilon", type: "range", min: 1.1, max: 2.0, step: 0.05, default: 1.35 }] },
  SVR: { 
    name: "Support Vector (SVR)", 
    params: [
      { id: "C", label: "C (Regularization)", type: "number", default: 1.0 },
      { id: "kernel", label: "Kernel", type: "select", options: ["linear", "poly", "rbf"], default: "rbf" }
    ] 
  },
  SGDRegressor: { name: "Stochastic Gradient Descent", params: [{ id: "max_iter", label: "Max Iterations", type: "number", default: 1000 }] },
  BayesianRidge: { name: "Bayesian Ridge", params: [] },
  TheilSenRegressor: { name: "Theil-Sen (Robust)", params: [] }
};

const FORMULA_MAP = {
  LinearRegression: {
    title: "Ordinary Least Squares (OLS)",
    img: "https://latex.codecogs.com/png.latex?%5Ccolor%7BBlue%7DJ(w)%20%3D%20%5Cfrac%7B1%7D%7Bn%7D%20%5Csum_%7Bi%3D1%7D%5E%7Bn%7D%20(y_i%20-%20%5Chat%7By%7D_i)%5E2",
    desc: "Minimizes the sum of squared residuals to find the line of best fit."
  },
  Ridge: {
    title: "L2 Regularization (Ridge)",
    img: "https://latex.codecogs.com/png.latex?%5Ccolor%7BBlue%7DJ(w)%20%3D%20MSE%20+%20%5Calpha%20%5C%7Cw%5C%7C_2%5E2",
    desc: "Prevents overfitting by penalizing large coefficients with a squared magnitude penalty."
  },
  Lasso: {
    title: "L1 Regularization (Lasso)",
    img: "https://latex.codecogs.com/png.latex?%5Ccolor%7BBlue%7DJ(w)%20%3D%20MSE%20+%20%5Calpha%20%5C%7Cw%5C%7C_1",
    desc: "Encourages feature sparsity by penalizing the absolute magnitude of coefficients."
  },
  ElasticNet: {
    title: "Elastic Net (L1+L2)",
    img: "https://latex.codecogs.com/png.latex?%5Ccolor%7BBlue%7DJ(w)%20%3D%20MSE%20+%20%5Calpha%20%5Crho%20%5C%7Cw%5C%7C_1%20+%20%5Cfrac%7B%5Calpha(1-%5Crho)%7D%7B2%7D%20%5C%7Cw%5C%7C_2%5E2",
    desc: "A hybrid regularization that combines both L1 and L2 penalties."
  },
  Polynomial: {
    title: "Polynomial Regression",
    img: "https://latex.codecogs.com/png.latex?%5Ccolor%7BBlue%7D%5Chat%7By%7D%20%3D%20w_0%20+%20w_1x%20+%20w_2x%5E2%20+%20...%20+%20w_nx%5En",
    desc: "Models non-linear relationships by creating feature interactions to a specified degree."
  },
  SVR: {
    title: "Support Vector Regression (SVR)",
    img: "https://latex.codecogs.com/png.latex?%5Ccolor%7BBlue%7Dmin%20%5Cfrac%7B1%7D%7B2%7D%5C%7Cw%5C%7C%5E2%20s.t.%20%7Cy_i%20-%20(w%20%5Ccdot%20x_i%20+%20b)%7C%20%5Cleq%20%5Cepsilon",
    desc: "Uses an epsilon-insensitive tube to ignore errors within a certain threshold."
  },
  SGDRegressor: {
    title: "Stochastic Gradient Descent",
    img: "https://latex.codecogs.com/png.latex?%5Ccolor%7BBlue%7Dw_%7Bt+1%7D%20%3D%20w_t%20-%20%5Ceta%20%5Cnabla%20J(w_t)",
    desc: "Iteratively updates weights using gradients to minimize the cost function."
  },
  BayesianRidge: {
    title: "Bayesian Ridge",
    img: "https://latex.codecogs.com/png.latex?%5Ccolor%7BBlue%7Dp(w%7Cy,X)%20%5Cpropto%20p(y%7CX,w)%20p(w%7C%5Clambda)",
    desc: "Treats regression coefficients as a probability distribution to provide uncertainty estimates."
  }
};

function App() {
  const [model, setModel] = useState("LinearRegression");
  const [dataMode, setDataMode] = useState("csv");
  const [cloudUrl, setCloudUrl] = useState("");
  const [file, setFile] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showPayload, setShowPayload] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "https://regression-bff-653100949628.us-central1.run.app";

  const [globalParams, setGlobalParams] = useState({ test_size: 20, random_state: 42, standardize: true, fit_intercept: true });
  const [modelParams, setModelParams] = useState({});
  const [diagnostics, setDiagnostics] = useState({ 
    generate_residuals: true, 
    durbin_watson: true, 
    vif_check: true, 
    cooks_distance: true, 
    cross_validation: false, 
    cv_folds: 5 
  });

  const analyzeDataHealth = (data) => {
    if (!data || data.length === 0) return null;
    const cols = Object.keys(data[0]);
    let missing = 0;
    data.forEach(row => cols.forEach(c => { if (row[c] === null || row[c] === "" || row[c] === undefined) missing++; }));
    return { rows: data.length, features: cols.length - 1, missing, isHealthy: missing === 0 };
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    const MAX_FILE_SIZE = 10485760; 
    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("⚠️ File too large! Max 10MB allowed.");
      return;
    }
    setFile(selectedFile);
    Papa.parse(selectedFile, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => setHealth(analyzeDataHealth(results.data)),
      error: (err) => alert("Error parsing CSV: " + err.message)
    });
  };

  const payload = {
    model_type: model,
    model_params: modelParams,
    pipeline_settings: globalParams,
    diagnostics: diagnostics,
    data_source: { mode: dataMode, url: cloudUrl }
  };

  const executePipeline = async () => {
    setLoading(true);
    const formData = new FormData();
    if (dataMode === 'csv' && file) formData.append("file", file);
    formData.append("settings", JSON.stringify(payload));

    try {
      const response = await fetch(`${API_URL}/process-regression`, { 
        method: "POST", 
        body: formData,
        mode: 'cors'
      });
      
      if (!response.ok) throw new Error("Backend Processing Error");
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert(`BFF Engine Error: ${error.message}. Verify Cloud Run logs.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="main-header">
        <div className="header-content">
          <div className="title-row">
            <h1>ML Regression Engine</h1>
            <div className="status-indicator online">
              <span className="status-dot"></span> BFF LIVE
            </div>
          </div>
          <div className="header-subtitle">
            <span className="prepared-by">
              Prepared By: <strong><a href="https://chrissajumulakkal.netlify.app" target="_blank" rel="noopener noreferrer">Chris Saju Mulakkal</a></strong>
            </span>
          </div>
        </div>
      </header>

      {/* STEP 1: DATA SOURCE */}
      <section className="card">
        <div className="step-header"><span className="step-num">01</span><label className="step-label"><strong>Step 1: Data Source & Ingestion</strong></label></div>
        <div className="tab-group">
          {['csv', 'gdrive', 's3', 'azure'].map(m => (
            <button key={m} className={dataMode === m ? 'active' : ''} onClick={() => setDataMode(m)}>{m.toUpperCase()}</button>
          ))}
        </div>
        {dataMode === 'csv' ? (
          <div className="upload-container">
            <input type="file" accept=".csv" onChange={handleFileUpload} className="file-input" id="csv-upload" />
            <label htmlFor="csv-upload" className="file-label">{file ? file.name : "Upload Local Dataset (Max 10 MB)"}</label>
          </div>
        ) : <input type="text" placeholder={`Enter Public ${dataMode.toUpperCase()} URL`} className="cloud-input" value={cloudUrl} onChange={(e)=>setCloudUrl(e.target.value)} />}
        {health && <div className="health-indicator"><span className={`badge-small ${health.isHealthy ? 'badge-success' : 'badge-warning'}`}>Missing: {health.missing}</span><span className="badge-small badge-info">Rows: {health.rows}</span></div>}
      </section>

      {/* STEP 2: MODEL */}
      <section className="card">
        <div className="step-header"><span className="step-num">02</span><label className="step-label"><strong>Step 2: Model Architecture</strong></label></div>
        <select className="model-select" value={model} onChange={(e) => { setModel(e.target.value); setModelParams({}); }}>
          {Object.keys(MODEL_SCHEMA).map(key => <option key={key} value={key}>{MODEL_SCHEMA[key].name}</option>)}
        </select>
      </section>

      {/* STEP 3: PRE-PROCESSING */}
      <section className="card">
        <div className="step-header"><span className="step-num">03</span><label className="step-label"><strong>Step 3: Global Pipeline Settings</strong></label></div>
        <div className="parameter-grid">
          <div className="input-group">
            <label>Test Split: <strong>{globalParams.test_size}%</strong></label>
            <input type="range" min="10" max="50" value={globalParams.test_size} onChange={(e) => setGlobalParams({...globalParams, test_size: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Standardize Features</label>
            <input type="checkbox" checked={globalParams.standardize} onChange={(e) => setGlobalParams({...globalParams, standardize: e.target.checked})} />
          </div>
        </div>
      </section>

      {/* STEP 4: HYPERPARAMETERS */}
      <section className="card">
        <div className="step-header"><span className="step-num">04</span><label className="step-label"><strong>Step 4: Hyperparameter Tuning</strong></label></div>
        <div className="parameter-grid">
          {MODEL_SCHEMA[model].params.length > 0 ? (
            MODEL_SCHEMA[model].params.map(p => (
              <div key={p.id} className="input-group">
                <label>{p.label}: <strong>{modelParams[p.id] || p.default}</strong></label>
                {p.type === 'select' ? (
                  <select value={modelParams[p.id] || p.default} onChange={(e) => setModelParams({...modelParams, [p.id]: e.target.value})}>
                    {p.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input type={p.type} min={p.min} max={p.max} step={p.step} value={modelParams[p.id] || p.default} onChange={(e) => setModelParams({...modelParams, [p.id]: e.target.value})} />
                )}
              </div>
            ))
          ) : <p className="no-params-text">No adjustable parameters for {MODEL_SCHEMA[model].name}.</p>}
        </div>
      </section>

      {/* STEP 5: RIGOR */}
      <section className="card">
        <div className="step-header"><span className="step-num">05</span><label className="step-label"><strong>Step 5: Statistical Rigor</strong></label></div>
        <div className="diagnostic-grid">
          <label><input type="checkbox" checked={diagnostics.durbin_watson} onChange={(e) => setDiagnostics({...diagnostics, durbin_watson: e.target.checked})} /> Durbin-Watson</label>
          <label><input type="checkbox" checked={diagnostics.vif_check} onChange={(e) => setDiagnostics({...diagnostics, vif_check: e.target.checked})} /> VIF Check</label>
          <label><input type="checkbox" checked={diagnostics.cooks_distance} onChange={(e) => setDiagnostics({...diagnostics, cooks_distance: e.target.checked})} /> Cook's Distance</label>
        </div>
      </section>

      {/* ACTION ZONE */}
      <div className="action-zone">
        <button className={`execute-btn ${loading ? 'loading' : ''}`} onClick={executePipeline} disabled={loading || (dataMode === 'csv' && !file)}>
          {loading ? "COMPUTING..." : "EXECUTE MATHEMATICAL PIPELINE"}
        </button>
        <label className="dev-toggle"><input type="checkbox" checked={showPayload} onChange={() => setShowPayload(!showPayload)} /> Inspect API Payload</label>
      </div>

      {showPayload && <pre className="inspector-panel">{JSON.stringify(payload, null, 2)}</pre>}

      {/* STEP 6: DASHBOARD */}
      <section className="card results-visualizer">
        <div className="step-header"><span className="step-num">06</span><label className="step-label"><strong>Step 6: Evaluation & Interpretability</strong></label></div>
        {result ? (
          <div className="dashboard-layout">
            <div className="result-panel">
              <h4>Generalization Performance</h4>
              <div className="metric-row"><span>Train $R^2$:</span> <strong>{result.train_score}</strong></div>
              <div className="metric-row"><span>Test $R^2$:</span> <strong>{result.test_score}</strong></div>
              {result.metrics && (
                <>
                  <div className="metric-row"><span>RMSE:</span> <strong>{result.metrics.rmse}</strong></div>
                  <div className="metric-row"><span>MAE:</span> <strong>{result.metrics.mae}</strong></div>
                </>
              )}
            </div>

            <div className="result-panel">
              <h4>Model Integrity Lights</h4>
              <div className="traffic-lights">
                <div className={`light-item ${result.dw_pass ? 'green' : 'red'}`}><span className="status-dot"></span> Independence (DW): {result.dw_val}</div>
                <div className={`light-item ${result.vif_pass ? 'green' : 'red'}`}><span className="status-dot"></span> VIF: {result.vif_pass ? 'Stable' : 'Collinear'}</div>
              </div>
            </div>

            {result.feature_importance && (
              <div className="result-panel importance-panel">
                <h4>Feature Importance (Weights)</h4>
                <div className="importance-list">
                  {result.feature_importance.map((f, i) => (
                    <div key={i} className="importance-row">
                      <span className="feat-name">{f.feature}</span>
                      <div className="feat-bar-bg">
                        <div className="feat-bar-fill" style={{ width: `${f.weight === "N/A" ? 0 : Math.min(Math.abs(f.weight) * 50, 100)}%` }}></div>
                      </div>
                      <span className="feat-val">{f.weight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="result-panel math-card full-width">
              <h4>Optimization Strategy</h4>
              <div className="math-display-area">
                <div className="formula-box">
                  <img src={FORMULA_MAP[model]?.img || FORMULA_MAP.LinearRegression.img} alt="Optimization Formula" className="formula-image" />
                </div>
                <div className="formula-explanation">
                  <h5>{FORMULA_MAP[model]?.title || "Linear Regression"}</h5>
                  <p>{FORMULA_MAP[model]?.desc || "Standard statistical optimization."}</p>
                </div>
              </div>
            </div>
          </div>
        ) : <p className="placeholder">Awaiting pipeline execution...</p>}
      </section>

      <footer className="app-footer">
        <p>Prepared By: <strong><a href="https://chrissajumulakkal.netlify.app" target="_blank">Chris Saju Mulakkal</a></strong></p>
      </footer>
    </div>
  );
}

export default App;
