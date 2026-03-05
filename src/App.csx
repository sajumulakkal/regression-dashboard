/* Base Layout */
:root {
  --ntu-blue: #004b98;
  --ntu-gold: #a98d4f;
  --bg-gray: #f4f7f9;
  --success-green: #2e7d32;
}

#root {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  text-align: left;
}

body {
  background-color: var(--bg-gray);
  color: #333;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  margin: 0;
}

header {
  margin-bottom: 2rem;
  border-bottom: 3px solid var(--ntu-blue);
  padding-bottom: 1rem;
}

h1 {
  color: var(--ntu-blue);
  margin: 0;
  font-size: 2.2rem;
}

/* Container Cards */
section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  border: 1px solid #e1e4e8;
}

.step-label {
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--ntu-blue);
  margin-bottom: 15px;
}

/* Form Elements */
select {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #fff;
  cursor: pointer;
}

select:focus {
  border-color: var(--ntu-blue);
  outline: none;
}

/* File Upload Area */
.file-input {
  border: 2px dashed var(--ntu-blue);
  padding: 30px;
  width: 100%;
  border-radius: 8px;
  background: #f8fbff;
  cursor: pointer;
  transition: background 0.3s;
}

.file-input:hover {
  background: #edf4ff;
}

/* Parameter Grid */
.parameter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

input[type="range"] {
  width: 100%;
  cursor: pointer;
}

input[type="number"] {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

/* Data Preview Table */
.preview-container {
  margin-top: 20px;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #eee;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th {
  background: #f1f3f5;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
  color: var(--ntu-blue);
}

td {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

/* Execution Button */
button {
  width: 100%;
  padding: 16px;
  background: var(--ntu-blue);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover:not(:disabled) {
  background: #003366;
  transform: translateY(-2px);
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Results Display */
.results-card {
  border-left: 6px solid var(--success-green);
  background: #f9fff9;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  min-width: 120px;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--success-green);
}
