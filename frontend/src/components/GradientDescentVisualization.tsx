'use client';

import { useState, useEffect } from 'react';
import { gradientDescentOptimizer, GradientDescentInfo } from '@/utils/regressionModels';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Zap } from 'lucide-react';

interface GradientDescentVisualizationProps {
  X?: number[];
  y?: number[];
}

export function GradientDescentVisualization({ X, y }: GradientDescentVisualizationProps) {
  const [gdResults, setGdResults] = useState<GradientDescentInfo | null>(null);
  const [selectedLearningRate, setSelectedLearningRate] = useState<'low' | 'optimal' | 'high'>('optimal');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runGradientDescent = () => {
      // Default data if not provided
      let features = X || Array.from({ length: 20 }, (_, i) => i);
      let targets = y || Array.from({ length: 20 }, (_, i) => 50 + i * 3 + Math.random() * 10);

      // Run gradient descent with selected learning rate
      const rates: Record<string, number> = {
        low: 0.001,
        optimal: 0.01,
        high: 0.1,
      };

      const result = gradientDescentOptimizer(features, targets, rates[selectedLearningRate], 1000, 1e-6);
      setGdResults(result);
      setLoading(false);
    };

    setLoading(true);
    const timer = setTimeout(runGradientDescent, 500);
    return () => clearTimeout(timer);
  }, [X, y, selectedLearningRate]);

  if (loading || !gdResults) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // Prepare chart data
  const lossChartData = gdResults.lossHistory.map((loss, i) => ({
    iteration: i,
    loss: parseFloat(loss.toFixed(2)),
  }));

  // Limit chart data to last 100 points for readability
  const displayChartData = lossChartData.slice(-100);

  // Convergence status color
  const convergenceColor =
    gdResults.convergenceStatus === 'converged'
      ? 'text-green-400'
      : gdResults.convergenceStatus === 'oscillating'
        ? 'text-yellow-400'
        : 'text-red-400';

  const convergenceBgColor =
    gdResults.convergenceStatus === 'converged'
      ? 'bg-green-500/10 border-green-500/30'
      : gdResults.convergenceStatus === 'oscillating'
        ? 'bg-yellow-500/10 border-yellow-500/30'
        : 'bg-red-500/10 border-red-500/30';

  // Learning rate comparison data
  const learningRates = [
    { rate: 0.001, name: 'Too Low', description: 'Slow convergence' },
    { rate: 0.01, name: 'Optimal', description: 'Good balance' },
    { rate: 0.1, name: 'Too High', description: 'May diverge' },
  ];

  const learningRateData = learningRates.map((lr) => ({
    name: lr.name,
    expectedIterations: lr.rate === 0.001 ? 500 : lr.rate === 0.01 ? 150 : 1000,
  }));

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          Gradient Descent Optimization
        </h3>
        <p className="text-sm text-slate-400">Training progress and convergence analysis</p>
      </div>

      {/* Learning Rate Selector */}
      <div className="flex gap-2 bg-slate-700/50 p-2 rounded-lg">
        {(['low', 'optimal', 'high'] as const).map((rate) => (
          <button
            key={rate}
            onClick={() => setSelectedLearningRate(rate)}
            className={`flex-1 px-3 py-2 rounded text-sm font-medium transition ${
              selectedLearningRate === rate ? 'bg-teal-500 text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {rate === 'low' ? 'Low (0.001)' : rate === 'optimal' ? 'Optimal (0.01)' : 'High (0.1)'}
          </button>
        ))}
      </div>

      {/* Convergence Status Card */}
      <div className={`${convergenceBgColor} border rounded-lg p-4`}>
        <p className="text-xs font-bold text-slate-400 mb-2">CONVERGENCE STATUS</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className={`text-2xl font-bold ${convergenceColor} mb-1`}>
              {gdResults.convergenceStatus === 'converged'
                ? '✓ Converged'
                : gdResults.convergenceStatus === 'oscillating'
                  ? '⟳ Oscillating'
                  : '✗ Not Converged'}
            </p>
            <p className="text-xs text-slate-400">
              {gdResults.convergenceStatus === 'converged'
                ? 'Model successfully converged to minimum loss'
                : gdResults.convergenceStatus === 'oscillating'
                  ? 'Loss oscillates around minimum'
                  : 'Did not converge within iteration limit'}
            </p>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-slate-400">Iterations to Converge</p>
              <p className="text-xl font-bold text-blue-400">{gdResults.iterationsToConverge}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Final Loss</p>
              <p className="text-lg font-bold text-purple-400">{gdResults.finalLoss.toFixed(4)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loss Over Iterations Chart */}
      <div>
        <p className="text-sm font-bold text-slate-300 mb-3">Loss Function Over Iterations</p>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={displayChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="iteration" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value: any) => value.toFixed(4)}
              />
              <Line
                type="monotone"
                dataKey="loss"
                stroke="#06b6d4"
                name="Loss (MSE)"
                dot={false}
                isAnimationActive={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Each iteration updates weights to reduce loss. Steeper drops indicate faster learning.
        </p>
      </div>

      {/* Gradient Descent Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-700/50 rounded-lg p-4">
        <div>
          <p className="text-xs text-slate-400 mb-1">Learning Rate (α)</p>
          <p className="text-2xl font-bold text-cyan-400">{gdResults.learningRate}</p>
          <p className="text-xs text-slate-500 mt-1">Controls step size down gradient</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Max Iterations</p>
          <p className="text-2xl font-bold text-cyan-400">1000</p>
          <p className="text-xs text-slate-500 mt-1">Iteration limit before stopping</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Convergence Tolerance</p>
          <p className="text-2xl font-bold text-cyan-400">1e-6</p>
          <p className="text-xs text-slate-500 mt-1">Loss change threshold</p>
        </div>
      </div>

      {/* Learning Rate Impact Comparison */}
      <div>
        <p className="text-sm font-bold text-slate-300 mb-3">Learning Rate Impact on Convergence</p>
        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={learningRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" label={{ value: 'Iterations', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Bar dataKey="expectedIterations" fill="#f59e0b" name="Expected Iterations" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Algorithm Explanation */}
      <div className="bg-slate-700/50 rounded-lg p-4 space-y-3 text-xs text-slate-400">
        <div>
          <p className="font-bold text-slate-300 mb-1">What is Gradient Descent?</p>
          <p>
            Iterative optimization algorithm that updates model weights to minimize loss function. Starting from random weights,
            it computes gradients and moves in opposite direction (steepest descent) by α × gradient step.
          </p>
        </div>
        <div>
          <p className="font-bold text-slate-300 mb-1">Key Concepts:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Learning Rate (α):</strong> Step size. Too low = slow, too high = diverges.
            </li>
            <li>
              <strong>Gradient:</strong> Direction of steepest increase. We go opposite direction.
            </li>
            <li>
              <strong>Convergence:</strong> When loss stops improving significantly.
            </li>
            <li>
              <strong>Epoch/Iteration:</strong> One complete pass through data.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
