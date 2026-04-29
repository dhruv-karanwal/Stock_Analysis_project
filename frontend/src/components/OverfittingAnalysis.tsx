'use client';

import { useState, useEffect } from 'react';
import { analyzeOverfitting, OverfittingAnalysis } from '@/utils/classificationModels';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertCircle } from 'lucide-react';

interface OverfittingAnalysisProps {
  trainAccuracy?: number;
  testAccuracy?: number;
}

export function OverfittingAnalysisComponent({ trainAccuracy = 0.95, testAccuracy = 0.72 }: OverfittingAnalysisProps) {
  const [analysis, setAnalysis] = useState<OverfittingAnalysis | null>(null);

  useEffect(() => {
    const result = analyzeOverfitting(trainAccuracy, testAccuracy);
    setAnalysis(result);
  }, [trainAccuracy, testAccuracy]);

  if (!analysis) {
    return null;
  }

  const gap = (analysis.trainAccuracy - analysis.testAccuracy).toFixed(4);
  const gapPercentage = parseFloat(gap) * 100;

  // Determine status color and icon
  let statusColor = 'text-blue-400';
  let statusBgColor = 'bg-blue-500/10 border-blue-500/30';
  let statusIcon = '⚡';
  let statusMessage = '';

  if (analysis.overfit === 'Overfitting') {
    statusColor = 'text-red-400';
    statusBgColor = 'bg-red-500/10 border-red-500/30';
    statusIcon = '⚠';
    statusMessage = 'Model memorized training data. Poor generalization expected.';
  } else if (analysis.overfit === 'Underfitting') {
    statusColor = 'text-orange-400';
    statusBgColor = 'bg-orange-500/10 border-orange-500/30';
    statusIcon = '📉';
    statusMessage = 'Model too simple. Increase complexity or train longer.';
  } else {
    statusColor = 'text-green-400';
    statusBgColor = 'bg-green-500/10 border-green-500/30';
    statusIcon = '✓';
    statusMessage = 'Good generalization. Model balances bias and variance well.';
  }

  // Example learning curves
  const learningCurveData = Array.from({ length: 100 }, (_, i) => ({
    epoch: i + 1,
    trainLoss: 1.2 * Math.exp(-i / 50) + 0.1,
    testLoss: 1.2 * Math.exp(-i / 40) + 0.2 + (i > 50 ? (i - 50) * 0.005 : 0),
  }));

  // Bias-Variance tradeoff visualization
  const tradeoffData = [
    { modelComplexity: 'Underfitting\n(High Bias)', bias: 0.9, variance: 0.1, totalError: 1.0 },
    { modelComplexity: 'Medium\n(Optimal)', bias: 0.3, variance: 0.15, totalError: 0.45 },
    { modelComplexity: 'Overfitting\n(High Variance)', bias: 0.05, variance: 0.7, totalError: 0.75 },
  ];

  // Comparison data
  const accuracyData = [
    { type: 'Train Accuracy', value: analysis.trainAccuracy * 100 },
    { type: 'Test Accuracy', value: analysis.testAccuracy * 100 },
  ];

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-cyan-400" />
          Overfitting vs Underfitting Analysis
        </h3>
        <p className="text-sm text-slate-400">Bias-variance tradeoff and generalization assessment</p>
      </div>

      {/* Status Card */}
      <div className={`${statusBgColor} border rounded-lg p-4`}>
        <p className="text-xs font-bold text-slate-400 mb-2">MODEL STATUS</p>
        <div className="flex items-center gap-4 mb-3">
          <p className={`text-4xl ${statusColor}`}>{statusIcon}</p>
          <div>
            <p className={`text-xl font-bold ${statusColor} capitalize`}>
              {analysis.overfit}
            </p>
            <p className="text-xs text-slate-400 mt-1">{statusMessage}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-slate-700/50 rounded p-2">
            <p className="text-slate-400">Train Acc.</p>
            <p className="text-green-400 font-bold">{(analysis.trainAccuracy * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-slate-700/50 rounded p-2">
            <p className="text-slate-400">Test Acc.</p>
            <p className="text-blue-400 font-bold">{(analysis.testAccuracy * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-slate-700/50 rounded p-2">
            <p className="text-slate-400">Gap</p>
            <p className={gapPercentage > 15 ? 'text-red-400 font-bold' : 'text-yellow-400 font-bold'}>
              {gapPercentage.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Train vs Test Accuracy */}
      <div>
        <p className="text-sm font-bold text-slate-300 mb-3">Training vs Testing Accuracy</p>
        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="type" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={[0, 100]} label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value: any) => `${value.toFixed(1)}%`}
              />
              <Bar dataKey="value" fill="#06b6d4" name="Accuracy" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Learning Curves */}
      <div>
        <p className="text-sm font-bold text-slate-300 mb-3">Learning Curves (Train vs Test Loss)</p>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={learningCurveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="epoch" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value: any) => value.toFixed(4)}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line
                type="monotone"
                dataKey="trainLoss"
                stroke="#10b981"
                name="Training Loss"
                dot={false}
                isAnimationActive={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="testLoss"
                stroke="#f59e0b"
                name="Testing Loss"
                dot={false}
                isAnimationActive={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {analysis.overfit === 'Overfitting'
            ? 'Large gap between curves indicates overfitting. Model learns training noise instead of patterns.'
            : analysis.overfit === 'Underfitting'
              ? 'Both curves stay high. Model lacks capacity to learn patterns.'
              : 'Curves follow similar trajectory. Good generalization.'}
        </p>
      </div>

      {/* Bias-Variance Tradeoff */}
      <div>
        <p className="text-sm font-bold text-slate-300 mb-3">Bias-Variance Tradeoff</p>
        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tradeoffData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis type="category" dataKey="modelComplexity" stroke="#94a3b8" width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value: any) => value.toFixed(3)}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="bias" fill="#f87171" name="Bias" />
              <Bar dataKey="variance" fill="#60a5fa" name="Variance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Remedies */}
      <div className="bg-slate-700/50 rounded-lg p-4">
        <p className="text-sm font-bold text-slate-300 mb-3">
          How to Fix {analysis.overfit}?
        </p>
        {analysis.overfit === 'Overfitting' && (
          <ul className="text-xs text-slate-400 space-y-2">
            <li>✓ Add more training data to better cover feature space</li>
            <li>✓ Use regularization (Ridge/Lasso) to penalize large weights</li>
            <li>✓ Reduce model complexity (fewer features, simpler model)</li>
            <li>✓ Apply early stopping to prevent excessive training</li>
            <li>✓ Use dropout or cross-validation</li>
          </ul>
        )}
        {analysis.overfit === 'Underfitting' && (
          <ul className="text-xs text-slate-400 space-y-2">
            <li>✓ Increase model complexity (polynomial features, more parameters)</li>
            <li>✓ Train longer (more iterations)</li>
            <li>✓ Decrease regularization strength</li>
            <li>✓ Add more relevant features</li>
            <li>✓ Try a more powerful model architecture</li>
          </ul>
        )}
        {analysis.overfit === 'Good Fit' && (
          <ul className="text-xs text-slate-400 space-y-2">
            <li>✓ Model generalizes well. Use for predictions.</li>
            <li>✓ Continue monitoring with new test data</li>
            <li>✓ Ensure consistent performance across different datasets</li>
            <li>✓ Consider ensemble methods for further improvement</li>
          </ul>
        )}
      </div>

      {/* Academic Explanation */}
      <div className="bg-slate-700/50 rounded-lg p-4 space-y-3 text-xs text-slate-400">
        <div>
          <p className="font-bold text-slate-300 mb-1">🎓 Key Concepts</p>
          <p>
            <strong>Bias:</strong> Systematic error from oversimplified assumptions. High bias → underfitting.
          </p>
          <p>
            <strong>Variance:</strong> Sensitivity to random fluctuations in training data. High variance → overfitting.
          </p>
          <p>
            <strong>Generalization:</strong> Model's ability to perform well on unseen data. Our ultimate goal.
          </p>
        </div>
        <div>
          <p className="font-bold text-slate-300 mb-1">📊 Interpretation</p>
          {analysis.overfit === 'Overfitting' && (
            <p>Train-test gap {gapPercentage > 15 ? '> 15%' : '10-15%'} indicates model memorized training patterns. Expected performance on new data will be lower.</p>
          )}
          {analysis.overfit === 'Underfitting' && (
            <p>Both accuracies below 70% indicate model is too simple. Predictions unreliable even on training data.</p>
          )}
          {analysis.overfit === 'Good Fit' && (
            <p>Small train-test gap ({'<'}15%) and high accuracy on both indicate good model fit. Ready for production.</p>
          )}
        </div>
      </div>
    </div>
  );
}
