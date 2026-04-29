'use client';

import { useState, useEffect } from 'react';
import { linearRegression, polynomialRegression, ridgeRegression, RegressionResult } from '@/utils/regressionModels';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Wallet } from 'lucide-react';

interface AcademicPortfolioSimulatorProps {
  ticker: string;
  currentPrice?: number;
  historicalPrices?: number[];
  investmentAmount?: number;
}

interface SimulationResult {
  model: string;
  predictedPrice: number;
  expectedReturn: number;
  returnPercentage: number;
  investmentValue: number;
  profit: number;
  finalValue: number;
}

export function AcademicPortfolioSimulator({
  ticker = 'RELIANCE',
  currentPrice = 2750,
  historicalPrices = Array.from({ length: 50 }, (_, i) => 2500 + Math.random() * 500),
  investmentAmount = 100000,
}: AcademicPortfolioSimulatorProps) {
  const [selectedModel, setSelectedModel] = useState<'linear' | 'poly2' | 'poly3' | 'ridge'>('linear');
  const [investment, setInvestment] = useState(investmentAmount);
  const [timeHorizon, setTimeHorizon] = useState(30); // days
  const [simulations, setSimulations] = useState<Record<string, SimulationResult> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runSimulations = () => {
      if (!historicalPrices || historicalPrices.length < 10) return;

      // Create features and targets
      const X = Array.from({ length: historicalPrices.length }, (_, i) => i);
      const y = historicalPrices;

      // Train models
      const linear = linearRegression(X, y);
      const poly2 = polynomialRegression(X, y, 2);
      const poly3 = polynomialRegression(X, y, 3);
      const ridge = ridgeRegression(X, y, 0.1);

      // Predict future price at timeHorizon
      const predictFuturePrice = (model: RegressionResult, dayOffset: number) => {
        if (model.coefficients.length === 1) {
          // Linear: y = mx + b
          return model.coefficients[0] * dayOffset + model.intercept;
        }
        // Polynomial: sum all terms
        let result = model.intercept;
        for (let i = 0; i < model.coefficients.length; i++) {
          result += model.coefficients[i] * Math.pow(dayOffset, i + 1);
        }
        return result;
      };

      // Generate predictions
      const linearPred = predictFuturePrice(linear, timeHorizon);
      const poly2Pred = predictFuturePrice(poly2, timeHorizon);
      const poly3Pred = predictFuturePrice(poly3, timeHorizon);
      const ridgePred = predictFuturePrice(ridge, timeHorizon);

      // Calculate returns
      const calculateReturn = (predictedPrice: number) => {
        const returnPercentage = ((predictedPrice - currentPrice) / currentPrice) * 100;
        const totalReturn = (returnPercentage / 100) * investment;
        const finalValue = investment + totalReturn;
        return {
          predictedPrice: Math.max(0, predictedPrice), // Ensure non-negative
          returnPercentage,
          totalReturn,
          finalValue,
          expectedReturn: totalReturn,
        };
      };

      const results = {
        linear: {
          model: 'Linear Regression',
          ...calculateReturn(linearPred),
          investmentValue: investment,
          profit: calculateReturn(linearPred).totalReturn,
        },
        poly2: {
          model: 'Polynomial (Degree 2)',
          ...calculateReturn(poly2Pred),
          investmentValue: investment,
          profit: calculateReturn(poly2Pred).totalReturn,
        },
        poly3: {
          model: 'Polynomial (Degree 3)',
          ...calculateReturn(poly3Pred),
          investmentValue: investment,
          profit: calculateReturn(poly3Pred).totalReturn,
        },
        ridge: {
          model: 'Ridge Regression',
          ...calculateReturn(ridgePred),
          investmentValue: investment,
          profit: calculateReturn(ridgePred).totalReturn,
        },
      };

      setSimulations(results as any);
      setLoading(false);
    };

    setLoading(true);
    const timer = setTimeout(runSimulations, 800);
    return () => clearTimeout(timer);
  }, [historicalPrices, currentPrice, investment, timeHorizon]);

  if (loading || !simulations) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const selectedResult = simulations[selectedModel];

  // Generate price projection chart
  const priceProjectionData = Array.from({ length: timeHorizon + 1 }, (_, i) => ({
    day: i,
    currentTrajectory: currentPrice + (i / timeHorizon) * (selectedResult.predictedPrice - currentPrice),
  }));

  // Portfolio allocation data for pie chart
  const chartData = Object.entries(simulations).map(([key, result]) => ({
    name: result.model.split(' ')[0],
    value: Math.max(0, result.predictedPrice),
  }));

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-cyan-400" />
          Academic Portfolio Simulator
        </h3>
        <p className="text-sm text-slate-400">Regression-based price prediction for investment analysis</p>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-700/50 rounded-lg p-4">
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">Investment Amount (₹)</label>
          <input
            type="number"
            value={investment}
            onChange={(e) => setInvestment(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">Time Horizon (Days)</label>
          <input
            type="range"
            min="5"
            max="365"
            value={timeHorizon}
            onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-slate-400 mt-1">{timeHorizon} days</p>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">Current Price (₹)</label>
          <p className="text-xl font-bold text-teal-400">{currentPrice.toFixed(0)}</p>
        </div>
      </div>

      {/* Model Selector */}
      <div className="flex gap-2 bg-slate-700/50 p-2 rounded-lg overflow-x-auto">
        {(['linear', 'poly2', 'poly3', 'ridge'] as const).map((model) => (
          <button
            key={model}
            onClick={() => setSelectedModel(model)}
            className={`px-3 py-2 rounded text-sm font-medium whitespace-nowrap transition ${
              selectedModel === model
                ? 'bg-teal-500 text-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {model === 'linear' ? 'Linear' : model === 'poly2' ? 'Poly-2' : model === 'poly3' ? 'Poly-3' : 'Ridge'}
          </button>
        ))}
      </div>

      {/* Selected Model Result Card */}
      <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/30 rounded-lg p-6">
        <p className="text-xs font-bold text-slate-400 mb-2">SELECTED MODEL: {selectedResult.model}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-400 mb-1">Current Price</p>
            <p className="text-xl font-bold text-slate-200">₹{currentPrice.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Predicted Price ({timeHorizon}d)</p>
            <p className="text-xl font-bold text-blue-400">₹{selectedResult.predictedPrice.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Expected Return</p>
            <p className={`text-xl font-bold ${selectedResult.returnPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {selectedResult.returnPercentage.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Profit/Loss</p>
            <p className={`text-xl font-bold ${selectedResult.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ₹{selectedResult.profit.toFixed(0)}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-600">
          <p className="text-xs text-slate-400 mb-2">Portfolio Value Projection</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-slate-400">Initial Investment</p>
              <p className="text-2xl font-bold text-slate-200">₹{investment.toFixed(0)}</p>
            </div>
            <div className="text-3xl text-slate-400">→</div>
            <div>
              <p className="text-sm text-slate-400">Expected Value</p>
              <p className={`text-2xl font-bold ${selectedResult.finalValue >= investment ? 'text-green-400' : 'text-red-400'}`}>
                ₹{(investment + selectedResult.profit).toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Price Projection Chart */}
      <div>
        <p className="text-sm font-bold text-slate-300 mb-3">Predicted Price Trajectory ({selectedResult.model})</p>
        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceProjectionData}>
              <defs>
                <linearGradient id="colorTrajectory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" label={{ value: 'Days', position: 'insideBottomRight', offset: -5 }} />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value: any) => `₹${value.toFixed(0)}`}
              />
              <Area type="monotone" dataKey="currentTrajectory" stroke="#06b6d4" fillOpacity={1} fill="url(#colorTrajectory)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Comparison Table */}
      <div>
        <p className="text-sm font-bold text-slate-300 mb-3">All Models Comparison</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-300 font-semibold">Model</th>
                <th className="text-right py-3 px-4 text-slate-300 font-semibold">Predicted Price</th>
                <th className="text-right py-3 px-4 text-slate-300 font-semibold">Return %</th>
                <th className="text-right py-3 px-4 text-slate-300 font-semibold">Profit (₹)</th>
                <th className="text-right py-3 px-4 text-slate-300 font-semibold">Final Value (₹)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(simulations).map(([key, result]) => (
                <tr key={key} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 px-4 text-slate-200 font-medium">{result.model}</td>
                  <td className="text-right py-3 px-4 text-blue-400">₹{result.predictedPrice.toFixed(0)}</td>
                  <td className={`text-right py-3 px-4 font-bold ${result.returnPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {result.returnPercentage.toFixed(2)}%
                  </td>
                  <td className={`text-right py-3 px-4 font-bold ${result.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ₹{result.profit.toFixed(0)}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-300">₹{(investment + result.profit).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic Explanation */}
      <div className="bg-slate-700/50 rounded-lg p-4 space-y-3 text-xs text-slate-400">
        <div>
          <p className="font-bold text-slate-300 mb-1">📊 Methodology</p>
          <p>
            This simulator uses trained regression models to predict future stock prices. Each model learns from historical price patterns and extrapolates to estimate value at specified time horizon.
          </p>
        </div>
        <div>
          <p className="font-bold text-slate-300 mb-1">⚠️ Key Assumptions</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Past patterns continue into future (market assumption)</li>
            <li>No sudden market shocks or black swan events</li>
            <li>Technical indicators driving price are captured in historical data</li>
            <li>Linear/Polynomial relationships hold in prediction horizon</li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-slate-300 mb-1">💡 Interpretation</p>
          <p>
            Predicted returns show expected value change based on regression coefficients. Different models may disagree—ensemble or consensus approach recommended for actual trading decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
