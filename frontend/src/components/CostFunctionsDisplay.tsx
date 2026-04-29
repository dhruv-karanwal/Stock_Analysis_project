'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Calculator } from 'lucide-react';

interface CostFunctionsDisplayProps {
  metrics?: {
    mse: number;
    mae: number;
    rmse: number;
    r2: number;
    predictions: number[];
    actual: number[];
  };
}

export function CostFunctionsDisplay({ metrics }: CostFunctionsDisplayProps) {
  const [activeMetric, setActiveMetric] = useState<'mse' | 'mae' | 'rmse' | 'r2'>('mse');

  // Example data for visualization
  const exampleData = metrics
    ? metrics.predictions.map((pred, i) => ({
        index: i,
        actual: metrics.actual[i],
        predicted: pred,
        error: Math.abs(pred - metrics.actual[i]),
      }))
    : Array.from({ length: 10 }, (_, i) => ({
        index: i,
        actual: 100 + Math.random() * 50,
        predicted: 95 + Math.random() * 60,
        error: Math.abs((95 + Math.random() * 60) - (100 + Math.random() * 50)),
      }));

  const metricsCardData = [
    {
      name: 'MSE',
      formula: 'MSE = (1/n) Σ(yᵢ - ŷᵢ)²',
      value: metrics?.mse ?? 125.4,
      description: 'Mean Squared Error: Average of squared differences. Penalizes large errors more.',
      unit: '₹²',
      color: 'bg-blue-500/10 border-blue-500/30',
      textColor: 'text-blue-400',
    },
    {
      name: 'MAE',
      formula: 'MAE = (1/n) Σ|yᵢ - ŷᵢ|',
      value: metrics?.mae ?? 8.7,
      description: 'Mean Absolute Error: Average absolute difference. Robust to outliers.',
      unit: '₹',
      color: 'bg-purple-500/10 border-purple-500/30',
      textColor: 'text-purple-400',
    },
    {
      name: 'RMSE',
      formula: 'RMSE = √MSE',
      value: metrics?.rmse ?? 11.2,
      description: 'Root Mean Squared Error: Same units as target. Popular in practice.',
      unit: '₹',
      color: 'bg-orange-500/10 border-orange-500/30',
      textColor: 'text-orange-400',
    },
    {
      name: 'R² Score',
      formula: 'R² = 1 - (SS_res / SS_tot)',
      value: metrics?.r2 ?? 0.8745,
      description: 'Coefficient of Determination: Explains variance (0-1). 1.0 = perfect fit.',
      unit: '',
      color: 'bg-green-500/10 border-green-500/30',
      textColor: 'text-green-400',
    },
  ];

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-cyan-400" />
          Cost Functions & Evaluation Metrics
        </h3>
        <p className="text-sm text-slate-400">Mathematical measures of model prediction quality</p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metricsCardData.map((metric) => (
          <div
            key={metric.name}
            onClick={() => setActiveMetric(metric.name.toLowerCase() as any)}
            className={`${metric.color} border rounded-lg p-4 cursor-pointer transition hover:border-opacity-100 border-opacity-50`}
          >
            <p className={`text-2xl font-bold ${metric.textColor} mb-1`}>{metric.value.toFixed(metric.name === 'R² Score' ? 4 : 2)}</p>
            <p className="text-xs text-slate-400 mb-2">{metric.unit}</p>
            <p className="font-mono text-xs text-slate-300 mb-2">{metric.formula}</p>
            <p className="text-xs text-slate-400">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Active Metric Details */}
      <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
        <div>
          <p className="text-sm font-bold text-slate-300 mb-2">
            {activeMetric === 'mse' && 'Mean Squared Error (MSE)'}
            {activeMetric === 'mae' && 'Mean Absolute Error (MAE)'}
            {activeMetric === 'rmse' && 'Root Mean Squared Error (RMSE)'}
            {activeMetric === 'r2' && 'R² Score (Coefficient of Determination)'}
          </p>
          {activeMetric === 'mse' && (
            <div className="text-xs text-slate-400 space-y-2">
              <p>
                <strong>Definition:</strong> Average of the squared differences between predicted and actual values.
              </p>
              <p>
                <strong>Formula:</strong> MSE = (1/n) × Σ(actual - predicted)²
              </p>
              <p>
                <strong>Characteristics:</strong> Heavily penalizes large errors. Sensitive to outliers. Always ≥ 0, with 0 being perfect.
              </p>
              <p>
                <strong>Use case:</strong> When large errors are especially costly (e.g., predicting stock prices).
              </p>
            </div>
          )}
          {activeMetric === 'mae' && (
            <div className="text-xs text-slate-400 space-y-2">
              <p>
                <strong>Definition:</strong> Average of the absolute differences between predicted and actual values.
              </p>
              <p>
                <strong>Formula:</strong> MAE = (1/n) × Σ|actual - predicted|
              </p>
              <p>
                <strong>Characteristics:</strong> Linear penalty. Robust to outliers. Easier to interpret than MSE.
              </p>
              <p>
                <strong>Use case:</strong> When outliers should not heavily influence the metric (e.g., general forecasting).
              </p>
            </div>
          )}
          {activeMetric === 'rmse' && (
            <div className="text-xs text-slate-400 space-y-2">
              <p>
                <strong>Definition:</strong> Square root of MSE. Returns error to original data scale.
              </p>
              <p>
                <strong>Formula:</strong> RMSE = √(MSE) = √((1/n) × Σ(actual - predicted)²)
              </p>
              <p>
                <strong>Characteristics:</strong> Same units as target variable. Penalizes large errors. Interpretable.
              </p>
              <p>
                <strong>Use case:</strong> Industry standard for regression. Easy to explain to non-technical stakeholders.
              </p>
            </div>
          )}
          {activeMetric === 'r2' && (
            <div className="text-xs text-slate-400 space-y-2">
              <p>
                <strong>Definition:</strong> Proportion of variance in target variable explained by the model.
              </p>
              <p>
                <strong>Formula:</strong> R² = 1 - (Sum of Squared Residuals / Total Sum of Squares)
              </p>
              <p>
                <strong>Characteristics:</strong> Range [0, 1]. 1.0 = perfect fit, 0.0 = baseline model. Can be negative (worse than baseline).
              </p>
              <p>
                <strong>Use case:</strong> Assessing overall model quality. Comparing models on same dataset.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Prediction Error Visualization */}
      <div>
        <p className="text-sm font-bold text-slate-300 mb-3">Actual vs Predicted Values</p>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={exampleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="index" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#10b981"
                name="Actual"
                dot={{ fill: '#10b981', r: 3 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#06b6d4"
                name="Predicted"
                dot={{ fill: '#06b6d4', r: 3 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Error Distribution */}
      <div>
        <p className="text-sm font-bold text-slate-300 mb-3">Prediction Errors Distribution</p>
        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={exampleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="index" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value: any) => `₹${value.toFixed(2)}`}
              />
              <Bar dataKey="error" fill="#f59e0b" name="Absolute Error" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metric Selection Guide */}
      <div className="bg-slate-700/50 rounded-lg p-4">
        <p className="text-sm font-bold text-slate-300 mb-3">When to Use Which Metric?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-400">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 mt-1 flex-shrink-0"></div>
            <p>
              <strong className="text-blue-400">MSE:</strong> When large errors matter more (weight in portfolio).
            </p>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 mt-1 flex-shrink-0"></div>
            <p>
              <strong className="text-purple-400">MAE:</strong> For interpretability and outlier robustness.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400 mt-1 flex-shrink-0"></div>
            <p>
              <strong className="text-orange-400">RMSE:</strong> Industry standard for regression problems.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 mt-1 flex-shrink-0"></div>
            <p>
              <strong className="text-green-400">R²:</strong> Overall model quality and variance explained.
            </p>
          </div>
        </div>
      </div>

      {/* Academic Note */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-xs text-slate-400">
        <p className="text-amber-400 font-bold mb-2">📚 Academic Note</p>
        <p>
          Cost functions measure how well your model fits data. During training, optimization algorithms minimize these functions using gradient descent. Lower error indicates better fit, but excessive optimization can lead to overfitting.
        </p>
      </div>
    </div>
  );
}
