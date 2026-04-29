'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, BarChart3, Brain } from 'lucide-react';
import {
  monteCarloSimulation,
  calculateRiskMetrics,
  scenarioAnalysis,
  generateHistogramData,
  recommendAllocation,
  calculateEfficiencyScore,
  MonteCarloResult,
  RiskMetrics,
  ScenarioAnalysis,
} from '@/utils/portfolioML';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EnhancedPortfolioSimulatorProps {
  ticker: string;
  currentPrice?: number;
  predictedPrice?: number;
  confidence?: number; // ML confidence (0-100)
  historicalVolatility?: number; // Annual volatility (0-1)
}

export function EnhancedPortfolioSimulator({
  ticker,
  currentPrice = 150,
  predictedPrice = 165,
  confidence = 75,
  historicalVolatility = 0.25,
}: EnhancedPortfolioSimulatorProps) {
  const [investmentAmount, setInvestmentAmount] = useState(5000);
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ML Calculation States
  const [monteCarloResult, setMonteCarloResult] = useState<MonteCarloResult | null>(null);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioAnalysis | null>(null);
  const [histogramData, setHistogramData] = useState<any[]>([]);
  const [allocation, setAllocation] = useState<any>(null);
  const [efficiencyScore, setEfficiencyScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Basic calculations
  const shares = investmentAmount / currentPrice;
  const baselineFutureValue = shares * predictedPrice;
  const baselineProfit = baselineFutureValue - investmentAmount;
  const baselineProfitPercent = (baselineProfit / investmentAmount) * 100;

  // Calculate expected return for risk metrics
  const expectedReturn = ((predictedPrice - currentPrice) / currentPrice) * 100;

  useEffect(() => {
    const runMlAnalysis = () => {
      setLoading(true);

      // Run Monte Carlo simulation
      const mc = monteCarloSimulation(
        currentPrice,
        predictedPrice,
        historicalVolatility,
        confidence,
        252 // 1 year
      );

      // Calculate risk metrics
      const risks = calculateRiskMetrics(expectedReturn, historicalVolatility * 100, currentPrice, mc.scenarios, investmentAmount);

      // Generate scenario analysis
      const scenarioData = scenarioAnalysis(currentPrice, predictedPrice, confidence, historicalVolatility);

      // Generate histogram for visualization
      const histogram = generateHistogramData(mc.scenarios, currentPrice, 40);

      // Get allocation recommendation
      const alloc = recommendAllocation(risks.sharpeRatio, riskTolerance, 0.5);

      // Calculate efficiency score
      const score = calculateEfficiencyScore(risks.sharpeRatio, mc.probPositiveReturn);

      setMonteCarloResult(mc);
      setRiskMetrics(risks);
      setScenarios(scenarioData);
      setHistogramData(histogram);
      setAllocation(alloc);
      setEfficiencyScore(score);
      setLoading(false);
    };

    runMlAnalysis();
  }, [currentPrice, predictedPrice, confidence, historicalVolatility, riskTolerance, expectedReturn]);

  if (loading || !monteCarloResult || !riskMetrics || !scenarios) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const isPositive = baselineProfit >= 0;
  const probPositivePercent = (monteCarloResult.probPositiveReturn * 100).toFixed(1);

  // Color coding for risk metrics
  const sharpeColor = riskMetrics.sharpeRatio > 1 ? 'text-green-400' : riskMetrics.sharpeRatio > 0 ? 'text-yellow-400' : 'text-red-400';
  const varColor = 'text-blue-400';

  return (
    <div className="space-y-6">
      {/* Main Portfolio Simulator Card */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              ML-Powered Portfolio Simulator
            </h3>
            <p className="text-sm text-slate-400">Advanced risk analysis with Monte Carlo & statistical models</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Efficiency Score</p>
            <p className={`text-3xl font-bold ${efficiencyScore > 70 ? 'text-green-400' : efficiencyScore > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {efficiencyScore}
            </p>
          </div>
        </div>

        {/* Investment Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Investment Amount</label>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-teal-400" />
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                min="0"
                step="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Risk Tolerance</label>
            <select
              value={riskTolerance}
              onChange={(e) => setRiskTolerance(e.target.value as any)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
            >
              <option value="conservative">🛡️ Conservative (30% stock)</option>
              <option value="moderate">⚖️ Moderate (60% stock)</option>
              <option value="aggressive">🚀 Aggressive (80% stock)</option>
            </select>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2">Quick Set</label>
          <div className="grid grid-cols-4 gap-2">
            {[1000, 5000, 10000, 25000].map((amount) => (
              <button
                key={amount}
                onClick={() => setInvestmentAmount(amount)}
                className={`px-3 py-2 rounded text-sm font-medium transition ${
                  investmentAmount === amount ? 'bg-teal-500 text-slate-900' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                ${(amount / 1000).toFixed(0)}K
              </button>
            ))}
          </div>
        </div>

        {/* Current vs Predicted Prices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-700">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-2">Current Price</p>
            <p className="text-2xl font-bold text-blue-400">${currentPrice.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-2">Market price now</p>
          </div>
          <div className={`rounded-lg p-4 ${predictedPrice > currentPrice ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
            <p className="text-xs text-slate-400 mb-2">ML Predicted Price</p>
            <div className="flex items-center gap-2">
              <p className={`text-2xl font-bold ${predictedPrice > currentPrice ? 'text-green-400' : 'text-red-400'}`}>
                ${predictedPrice.toFixed(2)}
              </p>
              {predictedPrice > currentPrice ? (
                <TrendingUp className="w-6 h-6 text-green-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-400" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <p className={`text-xs font-semibold ${predictedPrice > currentPrice ? 'text-green-400' : 'text-red-400'}`}>
                {predictedPrice > currentPrice ? '+' : ''}{((predictedPrice - currentPrice) / currentPrice * 100).toFixed(2)}%
              </p>
              <p className="text-xs text-slate-400">
                ML Confidence: <span className="font-semibold text-teal-400">{confidence}%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Baseline Returns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-300 mb-3">Investment Details</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Shares to Buy</span>
                <span className="font-semibold">{shares.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Total Investment</span>
                <span className="font-semibold">${investmentAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700">
                <span className="text-sm text-slate-400">Expected Value (Baseline)</span>
                <span className="font-semibold text-blue-400">${baselineFutureValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-4 border ${isPositive ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <p className="text-xs text-slate-400 mb-2">Baseline Profit / Loss</p>
            <p className={`text-3xl font-bold mb-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}${baselineProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className={`text-sm font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{baselineProfitPercent.toFixed(2)}% ROI
            </p>
          </div>
        </div>
      </div>

      {/* ML Analysis Panel - Collapsible */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 flex items-center justify-between text-purple-400 hover:bg-purple-500/20 transition"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          <span className="font-semibold">Advanced ML Analysis</span>
        </div>
        <span className="text-xl">{showAdvanced ? '−' : '+'}</span>
      </button>

      {showAdvanced && (
        <div className="space-y-6">
          {/* Monte Carlo Probability Distribution */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
            <div>
              <h4 className="font-bold mb-1 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Monte Carlo Simulation (10,000 Scenarios)
              </h4>
              <p className="text-sm text-slate-400">Probability distribution of future stock prices</p>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histogramData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="range" stroke="#94a3b8" style={{ fontSize: '10px' }} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="percentage" fill="#06b6d4" name="Probability %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-700">
              <div className="bg-slate-700/50 rounded p-3">
                <p className="text-xs text-slate-400 mb-1">5th Percentile</p>
                <p className="font-bold text-red-400">${monteCarloResult.percentile5.toFixed(2)}</p>
              </div>
              <div className="bg-slate-700/50 rounded p-3">
                <p className="text-xs text-slate-400 mb-1">Median Price</p>
                <p className="font-bold text-blue-400">${monteCarloResult.median.toFixed(2)}</p>
              </div>
              <div className="bg-slate-700/50 rounded p-3">
                <p className="text-xs text-slate-400 mb-1">95th Percentile</p>
                <p className="font-bold text-green-400">${monteCarloResult.percentile95.toFixed(2)}</p>
              </div>
              <div className="bg-slate-700/50 rounded p-3">
                <p className="text-xs text-slate-400 mb-1">Prob Positive</p>
                <p className="font-bold text-teal-400">{probPositivePercent}%</p>
              </div>
            </div>
          </div>

          {/* Scenario Analysis */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
            <h4 className="font-bold">Scenario Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Worst Case */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-xs font-bold text-red-400 mb-2">WORST CASE (5%)</p>
                <p className="text-2xl font-bold text-red-400 mb-2">${scenarios.worstCase.price.toFixed(2)}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Expected Return</span>
                    <span className={`font-bold ${scenarios.worstCase.return < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {scenarios.worstCase.return.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Profit/Loss</span>
                    <span className={`font-bold ${(shares * scenarios.worstCase.price - investmentAmount) < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      ${(shares * scenarios.worstCase.price - investmentAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Base Case */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-xs font-bold text-blue-400 mb-2">BASE CASE (60%)</p>
                <p className="text-2xl font-bold text-blue-400 mb-2">${scenarios.baseCase.price.toFixed(2)}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Expected Return</span>
                    <span className={`font-bold ${scenarios.baseCase.return < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {scenarios.baseCase.return.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Profit/Loss</span>
                    <span className={`font-bold ${(shares * scenarios.baseCase.price - investmentAmount) < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      ${(shares * scenarios.baseCase.price - investmentAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Best Case */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-xs font-bold text-green-400 mb-2">BEST CASE (5%)</p>
                <p className="text-2xl font-bold text-green-400 mb-2">${scenarios.bestCase.price.toFixed(2)}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Expected Return</span>
                    <span className={`font-bold ${scenarios.bestCase.return < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {scenarios.bestCase.return.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Profit/Loss</span>
                    <span className={`font-bold ${(shares * scenarios.bestCase.price - investmentAmount) < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      ${(shares * scenarios.bestCase.price - investmentAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Metrics */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
            <h4 className="font-bold">Risk Metrics & Analytics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Sharpe Ratio</p>
                <p className={`text-3xl font-bold ${sharpeColor}`}>{riskMetrics.sharpeRatio.toFixed(2)}</p>
                <p className="text-xs text-slate-400 mt-2">
                  {riskMetrics.sharpeRatio > 1
                    ? '✓ Excellent risk-adjusted returns'
                    : riskMetrics.sharpeRatio > 0
                    ? '~ Moderate risk-adjusted returns'
                    : '✗ Poor risk-adjusted returns'}
                </p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Sortino Ratio</p>
                <p className={`text-3xl font-bold ${sharpeColor}`}>{riskMetrics.sortino.toFixed(2)}</p>
                <p className="text-xs text-slate-400 mt-2">Penalizes downside volatility only</p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Value at Risk (95%)</p>
                <p className={`text-2xl font-bold ${varColor}`}>${riskMetrics.valueAtRisk95.toFixed(2)}</p>
                <p className="text-xs text-slate-400 mt-2">Max expected loss in 1/20 scenarios</p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Maximum Drawdown</p>
                <p className="text-2xl font-bold text-orange-400">{(riskMetrics.maxDrawdown * 100).toFixed(2)}%</p>
                <p className="text-xs text-slate-400 mt-2">Largest peak-to-trough decline</p>
              </div>
            </div>
          </div>

          {/* Allocation Recommendation */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
            <h4 className="font-bold">AI Allocation Recommendation</h4>
            <p className="text-sm text-slate-400">{allocation.rationale}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
                <p className="text-sm font-semibold text-slate-300 mb-2">{ticker} Stock</p>
                <p className="text-4xl font-bold text-teal-400">{allocation.stock}%</p>
              </div>
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                <p className="text-sm font-semibold text-slate-300 mb-2">Cash / Stable</p>
                <p className="text-4xl font-bold text-slate-300">{allocation.cash}%</p>
              </div>
            </div>
          </div>

          {/* ML Metrics Legend */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-2">
            <p className="text-xs font-bold text-blue-400 mb-2">ML METRICS EXPLAINED</p>
            <div className="text-xs text-slate-300 space-y-1">
              <p>
                <strong>Sharpe Ratio:</strong> Returns per unit of risk. Higher is better. {'>'} 1 = excellent, 0-1 = moderate, {'<'} 0 = poor.
              </p>
              <p>
                <strong>Sortino Ratio:</strong> Like Sharpe but only penalizes downside volatility, better for asymmetric risk.
              </p>
              <p>
                <strong>VaR (Value at Risk):</strong> Maximum expected loss in given % of scenarios. Lower is safer.
              </p>
              <p>
                <strong>Max Drawdown:</strong> Largest peak-to-trough decline. Shows worst historical downside.
              </p>
              <p>
                <strong>Efficiency Score:</strong> 0-100 composite score combining Sharpe ratio and probability of positive returns.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-xs text-slate-300 space-y-1">
        <p className="font-semibold text-blue-400">⚠️ Disclaimer</p>
        <p>
          This simulator uses Monte Carlo modeling, Geometric Brownian Motion, and statistical analysis. Results are estimates based on historical volatility and ML predictions.
          Past performance does not guarantee future results. Not financial advice.
        </p>
      </div>
    </div>
  );
}
