/**
 * ML-Based Portfolio Risk & Return Calculator
 * Uses statistical models and Monte Carlo simulation for advanced portfolio analysis
 */

export interface MonteCarloResult {
  scenarios: number[];
  mean: number;
  median: number;
  std: number;
  percentile5: number;
  percentile25: number;
  percentile75: number;
  percentile95: number;
  probPositiveReturn: number;
}

export interface RiskMetrics {
  sharpeRatio: number;
  valueAtRisk95: number; // VaR at 95% confidence
  valueAtRisk99: number; // VaR at 99% confidence
  maxDrawdown: number;
  sortino: number;
}

export interface ScenarioAnalysis {
  bestCase: {
    price: number;
    return: number;
    probability: number;
  };
  baseCase: {
    price: number;
    return: number;
    probability: number;
  };
  worstCase: {
    price: number;
    return: number;
    probability: number;
  };
}

/**
 * Monte Carlo Simulation for portfolio returns
 * Generates 10,000 price scenarios based on geometric Brownian motion
 * @param currentPrice - Current stock price
 * @param predictedPrice - ML-predicted target price
 * @param historicalVolatility - Historical price volatility (0-1)
 * @param confidence - ML model confidence (0-100)
 * @param daysToForecast - Days until prediction (default 252 trading days = 1 year)
 */
export function monteCarloSimulation(
  currentPrice: number,
  predictedPrice: number,
  historicalVolatility: number = 0.25, // ~25% annual volatility
  confidence: number = 75,
  daysToForecast: number = 252,
  numSimulations: number = 10000
): MonteCarloResult {
  // Estimate drift from predicted price
  const expectedReturn = (predictedPrice - currentPrice) / currentPrice;
  const mu = expectedReturn / (daysToForecast / 252); // Annualized drift
  const sigma = historicalVolatility; // Annual volatility
  const dt = 1 / 252; // Daily time step

  // Adjust volatility based on confidence (higher confidence = lower uncertainty)
  const confidenceAdjustedVolatility = sigma * (1 - confidence / 100 * 0.3); // Max 30% reduction

  const scenarios: number[] = [];

  for (let i = 0; i < numSimulations; i++) {
    let price = currentPrice;

    // Generate price path using geometric Brownian motion
    for (let day = 0; day < daysToForecast; day++) {
      const z = gaussianRandom(); // Standard normal random variable
      const drift = mu * dt;
      const diffusion = confidenceAdjustedVolatility * Math.sqrt(dt) * z;
      price = price * Math.exp(drift + diffusion);
    }

    scenarios.push(price);
  }

  // Calculate statistics
  scenarios.sort((a, b) => a - b);
  const returns = scenarios.map((p) => (p - currentPrice) / currentPrice);

  const mean = scenarios.reduce((a, b) => a + b) / scenarios.length;
  const variance = scenarios.reduce((a, b) => a + Math.pow(b - mean, 2)) / scenarios.length;
  const std = Math.sqrt(variance);
  const median = scenarios[Math.floor(scenarios.length / 2)];

  const percentile5 = scenarios[Math.floor(scenarios.length * 0.05)];
  const percentile25 = scenarios[Math.floor(scenarios.length * 0.25)];
  const percentile75 = scenarios[Math.floor(scenarios.length * 0.75)];
  const percentile95 = scenarios[Math.floor(scenarios.length * 0.95)];

  const positivesCount = returns.filter((r) => r > 0).length;
  const probPositiveReturn = positivesCount / scenarios.length;

  return {
    scenarios,
    mean,
    median,
    std,
    percentile5,
    percentile25,
    percentile75,
    percentile95,
    probPositiveReturn,
  };
}

/**
 * Calculate risk-adjusted metrics
 * @param expectedReturn - Expected portfolio return (%)
 * @param volatility - Portfolio volatility (annual %)
 * @param riskFreeRate - Risk-free rate (annual %, typically 4-5%)
 * @param scenarios - Monte Carlo scenarios for additional metrics
 */
export function calculateRiskMetrics(
  expectedReturn: number,
  volatility: number,
  currentPrice: number,
  scenarios: number[],
  investmentAmount: number,
  riskFreeRate: number = 4.5
): RiskMetrics {
  // Sharpe Ratio = (Expected Return - Risk Free Rate) / Volatility
  // Measures excess return per unit of risk
  const sharpeRatio = (expectedReturn - riskFreeRate) / volatility;

  // Value at Risk (VaR) - maximum expected loss at given confidence level
  const sortedScenarios = [...scenarios].sort((a, b) => a - b);
  const var95Index = Math.floor(sortedScenarios.length * 0.05);
  const var99Index = Math.floor(sortedScenarios.length * 0.01);

  const valueAtRisk95 = currentPrice - sortedScenarios[var95Index];
  const valueAtRisk99 = currentPrice - sortedScenarios[var99Index];

  // Max Drawdown - largest peak-to-trough decline
  let maxDrawdown = 0;
  let peak = sortedScenarios[0];
  for (let i = 1; i < sortedScenarios.length; i++) {
    const drawdown = (peak - sortedScenarios[i]) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
    if (sortedScenarios[i] > peak) {
      peak = sortedScenarios[i];
    }
  }

  // Sortino Ratio - like Sharpe but only penalizes downside volatility
  const downscenarios = scenarios.filter((s) => s < currentPrice);
  const downvolatility = Math.sqrt(
    downscenarios.reduce((a, b) => a + Math.pow(b - currentPrice, 2), 0) / downscenarios.length
  );
  const sortino = downvolatility > 0 ? (expectedReturn - riskFreeRate) / (downvolatility / currentPrice * 100) : 0;

  return {
    sharpeRatio: Math.max(-10, Math.min(10, sharpeRatio)), // Cap for display
    valueAtRisk95,
    valueAtRisk99,
    maxDrawdown,
    sortino: Math.max(-10, Math.min(10, sortino)),
  };
}

/**
 * Generate Best/Base/Worst case scenarios
 * Uses normal distribution confidence intervals
 */
export function scenarioAnalysis(
  currentPrice: number,
  predictedPrice: number,
  confidence: number,
  historicalVolatility: number = 0.25
): ScenarioAnalysis {
  const expectedReturn = (predictedPrice - currentPrice) / currentPrice;

  // Confidence interval multiplier (z-score)
  // 68% (1σ), 95% (2σ), 99.7% (3σ)
  const confidenceMultiplier = 1.96; // 95% confidence interval

  // Adjust standard deviation based on model confidence
  const adjustedVolatility = historicalVolatility * (1 - confidence / 100 * 0.3);
  const standardError = predictedPrice * adjustedVolatility;

  return {
    bestCase: {
      price: Math.max(currentPrice, predictedPrice + confidenceMultiplier * standardError),
      return: ((predictedPrice + confidenceMultiplier * standardError - currentPrice) / currentPrice) * 100,
      probability: 0.05, // ~5% chance
    },
    baseCase: {
      price: predictedPrice,
      return: expectedReturn * 100,
      probability: 0.6, // ~60% chance (most likely)
    },
    worstCase: {
      price: Math.min(currentPrice, predictedPrice - confidenceMultiplier * standardError),
      return: ((predictedPrice - confidenceMultiplier * standardError - currentPrice) / currentPrice) * 100,
      probability: 0.05, // ~5% chance
    },
  };
}

/**
 * Calculate portfolio allocation recommendation using ML
 * Recommends allocation between risk-free asset and stock based on risk tolerance
 */
export function recommendAllocation(
  sharpeRatio: number,
  userRiskTolerance: 'conservative' | 'moderate' | 'aggressive' = 'moderate',
  currentSharpe: number = 0.5 // Market Sharpe ratio benchmark
): { stock: number; cash: number; rationale: string } {
  let baseAllocation = 0.6; // 60% stock for moderate

  if (userRiskTolerance === 'conservative') {
    baseAllocation = 0.3;
  } else if (userRiskTolerance === 'aggressive') {
    baseAllocation = 0.8;
  }

  // Adjust based on Sharpe ratio (if negative, reduce stock allocation)
  const sharpeAdjustment = (sharpeRatio > currentSharpe ? 0.1 : -0.1);
  const stockAllocation = Math.max(0.1, Math.min(0.9, baseAllocation + sharpeAdjustment));
  const cashAllocation = 1 - stockAllocation;

  return {
    stock: parseFloat((stockAllocation * 100).toFixed(1)),
    cash: parseFloat((cashAllocation * 100).toFixed(1)),
    rationale:
      sharpeRatio > 1
        ? '✓ Strong risk-adjusted returns, favorable to increase allocation'
        : sharpeRatio > 0
        ? '~ Moderate risk-adjusted returns, maintain current allocation'
        : '✗ Poor risk-adjusted returns, consider reducing allocation',
  };
}

/**
 * Generate histogram data for probability distribution visualization
 */
export function generateHistogramData(
  scenarios: number[],
  currentPrice: number,
  bins: number = 50
): Array<{ range: string; count: number; percentage: number }> {
  const min = Math.min(...scenarios);
  const max = Math.max(...scenarios);
  const binWidth = (max - min) / bins;

  const histogram: Array<{ range: string; count: number; percentage: number }> = [];

  for (let i = 0; i < bins; i++) {
    const binStart = min + i * binWidth;
    const binEnd = binStart + binWidth;
    const count = scenarios.filter((s) => s >= binStart && s < binEnd).length;
    const percentage = (count / scenarios.length) * 100;

    histogram.push({
      range: `$${binStart.toFixed(0)}-${binEnd.toFixed(0)}`,
      count,
      percentage: parseFloat(percentage.toFixed(2)),
    });
  }

  return histogram;
}

/**
 * Box-Muller transform to generate standard normal random variables
 */
function gaussianRandom(): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Calculate portfolio efficiency score (0-100)
 * Based on Sharpe ratio and probability of positive returns
 */
export function calculateEfficiencyScore(
  sharpeRatio: number,
  probPositiveReturn: number
): number {
  // Normalize Sharpe ratio (assuming -2 to 2 range for good investments)
  const sharpeScore = Math.max(0, Math.min(50, (sharpeRatio + 2) * 12.5));
  // Probability of positive return (0-100)
  const probScore = probPositiveReturn * 100 * 0.5;

  return parseFloat((sharpeScore * 0.4 + probScore * 0.6).toFixed(1));
}
