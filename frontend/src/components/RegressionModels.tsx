'use client';

import { useState, useEffect } from 'react';
import { linearRegression, polynomialRegression, ridgeRegression, lassoRegression, RegressionResult } from '@/utils/regressionModels';
import { TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface RegressionModelsProps {
  ticker: string;
  historicalPrices: number[];
}

export function RegressionModels({ ticker, historicalPrices }: RegressionModelsProps) {
  const [models, setModels] = useState<Record<string, RegressionResult> | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'r2' | 'mse' | 'mae'>('r2');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateData = () => {
      if (historicalPrices.length < 20) return;

      // Create features (day index) and target (prices)
      const X = Array.from({ length: historicalPrices.length }, (_, i) => i);
      const y = historicalPrices;

      // Train models
      const linear = linearRegression(X, y);
      const poly2 = polynomialRegression(X, y, 2);
      const poly3 = polynomialRegression(X, y, 3);
      const ridge = ridgeRegression(X, y, 0.1);
      const lasso = lassoRegression(X, y, 0.01);

      setModels({
        'Linear': linear,
        'Polynomial (Degree 2)': poly2,
        'Polynomial (Degree 3)': poly3,
        'Ridge (λ=0.1)': ridge,
        'Lasso (λ=0.01)': lasso,
      });
      setLoading(false);
    };

    setLoading(true);
    const timer = setTimeout(generateData, 800);
    return () => clearTimeout(timer);
  }, [historicalPrices]);

  if (loading || !models) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const chartData = Object.entries(models).map(([name, result]) => ({
    name,
    r2Train: parseFloat(result.trainR2.toFixed(3)),
    r2Test: parseFloat(result.testR2.toFixed(3)),
    rmse: parseFloat(result.rmse.toFixed(3)),
  }));

  const metricsData = Object.entries(models).map(([name, result]) => {
    const metric = selectedMetric === 'r2' ? result.trainR2 : selectedMetric === 'mse' ? result.trainMSE : result.trainMAE;
    return {
      name: name.replace('Polynomial (Degree ', 'Poly-').replace(')', '').replace('Ridge', 'Ridge').replace('Lasso', 'Lasso'),
      value: parseFloat(metric.toFixed(3)),
    };
  });

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          Regression Models Comparison
        </h3>
        <p className="text-sm text-slate-400">Linear, Polynomial, Ridge, and Lasso regression models for price prediction</p>
      </div>

      {/* Model Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Model</th>
              <th className="text-right py-3 px-4 text-slate-300 font-semibold">R² (Train)</th>
              <th className="text-right py-3 px-4 text-slate-300 font-semibold">R² (Test)</th>
              <th className="text-right py-3 px-4 text-slate-300 font-semibold">RMSE</th>
              <th className="text-right py-3 px-4 text-slate-300 font-semibold">MAE</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(models).map(([name, result]) => (
              <tr key={name} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="py-3 px-4 text-slate-200 font-medium">{name}</td>
                <td className="text-right py-3 px-4 text-green-400">{result.trainR2.toFixed(4)}</td>
                <td className={`text-right py-3 px-4 ${result.testR2.toFixed(4) > result.trainR2.toFixed(4) ? 'text-blue-400' : 'text-orange-400'}`}>
                  {result.testR2.toFixed(4)}
                </td>
                <td className="text-right py-3 px-4 text-blue-400">{result.rmse.toFixed(4)}</td>
                <td className="text-right py-3 px-4 text-purple-400">{result.trainMAE.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Metric Selection */}
      <div className="flex gap-2 bg-slate-700/50 p-2 rounded-lg">
        {(['r2', 'mse', 'mae'] as const).map((metric) => (
          <button
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            className={`flex-1 px-3 py-2 rounded text-sm font-medium transition ${
              selectedMetric === metric
                ? 'bg-teal-500 text-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {metric === 'r2' ? 'R² Score' : metric === 'mse' ? 'MSE' : 'MAE'}
          </button>
        ))}
      </div>

      {/* Metrics Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0' }}
              formatter={(value: any) => value.toFixed(4)}
            />
            <Bar dataKey="value" fill="#06b6d4" name={selectedMetric.toUpperCase()} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Best Model */}
      <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
        <p className="text-sm font-bold text-teal-400 mb-2">BEST MODEL</p>
        {(() => {
          const best = Object.entries(models).reduce((a, b) =>
            a[1].trainR2 > b[1].trainR2 ? a : b
          );
          return (
            <div>
              <p className="text-lg font-bold text-slate-200 mb-1">{best[0]}</p>
              <p className="text-sm text-slate-400">
                R² Score: <span className="text-teal-400 font-semibold">{best[1].trainR2.toFixed(4)}</span>
                {' '} | RMSE: <span className="text-teal-400 font-semibold">₹{best[1].rmse.toFixed(2)}</span>
              </p>
            </div>
          );
        })()}
      </div>

      {/* Explanation */}
      <div className="bg-slate-700/50 rounded-lg p-4 text-xs text-slate-400 space-y-2">
        <p><strong className="text-slate-300">Linear Regression:</strong> Simple straight-line fit. Good baseline but may underfit.</p>
        <p><strong className="text-slate-300">Polynomial:</strong> Degree 2-3 captures non-linear trends. Higher degree = more complex.</p>
        <p><strong className="text-slate-300">Ridge (L2):</strong> Adds penalty for large coefficients. Prevents overfitting.</p>
        <p><strong className="text-slate-300">Lasso (L1):</strong> Shrinks some coefficients to zero. Feature selection built-in.</p>
      </div>
    </div>
  );
}
