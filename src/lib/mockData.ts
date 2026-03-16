import {
  FeatureImportance,
  Indicator,
  ModelMetrics,
  PredictionHistoryItem,
  PredictionResult,
  Stock,
  StockDataPoint,
} from '@/types';

// Known stocks
export const STOCK_DATABASE: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.43, change: 2.15, changePercent: 1.15, volume: 54320000, marketCap: 2.93e12, sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 241.72, change: -5.38, changePercent: -2.18, volume: 98740000, marketCap: 7.68e11, sector: 'Automotive' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.26, change: 3.87, changePercent: 0.94, volume: 23100000, marketCap: 3.08e12, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 163.48, change: -1.22, changePercent: -0.74, volume: 18500000, marketCap: 2.04e12, sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 196.85, change: 4.43, changePercent: 2.30, volume: 34600000, marketCap: 2.07e12, sector: 'E-Commerce' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 847.19, change: 18.34, changePercent: 2.21, volume: 42100000, marketCap: 2.09e12, sector: 'Technology' },
  { symbol: 'META', name: 'Meta Platforms', price: 513.62, change: -7.18, changePercent: -1.38, volume: 19800000, marketCap: 1.30e12, sector: 'Social Media' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 212.34, change: 1.67, changePercent: 0.79, volume: 8900000, marketCap: 6.07e11, sector: 'Finance' },
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2847.60, change: 34.20, changePercent: 1.22, volume: 12300000, marketCap: 1.92e13, sector: 'Conglomerate' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3921.45, change: -42.15, changePercent: -1.06, volume: 2450000, marketCap: 1.43e13, sector: 'IT Services' },
  { symbol: 'INFY', name: 'Infosys Ltd.', price: 1542.30, change: 18.70, changePercent: 1.23, volume: 4500000, marketCap: 6.39e12, sector: 'IT Services' },
  { symbol: 'HDFC', name: 'HDFC Bank', price: 1678.90, change: -12.40, changePercent: -0.73, volume: 5200000, marketCap: 9.06e12, sector: 'Banking' },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 637.82, change: 11.45, changePercent: 1.83, volume: 4600000, marketCap: 2.73e11, sector: 'Entertainment' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 167.43, change: -3.21, changePercent: -1.88, volume: 38200000, marketCap: 2.71e11, sector: 'Semiconductors' },
];

// Generate realistic stock price data
export function generateStockData(symbol: string, days: number = 90): StockDataPoint[] {
  const data: StockDataPoint[] = [];
  const stock = STOCK_DATABASE.find(s => s.symbol === symbol);
  let basePrice = stock?.price ?? 150;
  const startPrice = basePrice * (0.85 + Math.random() * 0.15);
  let currentPrice = startPrice;

  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const volatility = Math.random() * 0.035 + 0.005;
    const drift = (Math.random() - 0.47) * 0.008;
    const change = currentPrice * (drift + volatility * (Math.random() - 0.5));

    const open = currentPrice;
    const close = Math.max(currentPrice + change, 1);
    const high = Math.max(open, close) * (1 + Math.random() * 0.015);
    const low = Math.min(open, close) * (1 - Math.random() * 0.015);
    const vol = Math.floor((stock?.volume ?? 10000000) * (0.7 + Math.random() * 0.6));

    // Calculate historical volatility (20-day rolling)
    const histVol = volatility * Math.sqrt(252);

    data.push({
      date: date.toISOString().split('T')[0],
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume: vol,
      volatility: +histVol.toFixed(4),
    });

    currentPrice = close;
  }

  return data;
}

// Generate indicator values
export function generateIndicators(symbol: string): Indicator[] {
  const rsiVal = Math.floor(Math.random() * 100);
  const macdVal = (Math.random() - 0.5) * 4;
  const atrVal = Math.random() * 10 + 2;
  const stochVal = Math.floor(Math.random() * 100);
  const bbWidth = Math.random() * 5 + 1;

  return [
    {
      id: 'RSI',
      name: 'Relative Strength Index',
      description: 'Measures momentum — values above 70 are overbought, below 30 oversold.',
      value: rsiVal,
      signal: rsiVal > 70 ? 'Overbought' : rsiVal < 30 ? 'Oversold' : 'Neutral',
      signalType: rsiVal > 70 ? 'overbought' : rsiVal < 30 ? 'oversold' : 'neutral',
      data: Array.from({ length: 20 }, () => Math.floor(Math.random() * 100)),
    },
    {
      id: 'MACD',
      name: 'MACD',
      description: 'Moving Average Convergence Divergence — shows trend direction and momentum.',
      value: +macdVal.toFixed(3),
      signal: macdVal > 0 ? 'Bullish Crossover' : 'Bearish Crossover',
      signalType: macdVal > 0 ? 'bullish' : 'bearish',
      data: Array.from({ length: 20 }, (_, i) => +(Math.sin(i / 3) * 2 + (Math.random() - 0.5)).toFixed(2)),
    },
    {
      id: 'BB',
      name: 'Bollinger Bands',
      description: 'Volatility bands placed above/below a moving average. Width indicates volatility.',
      value: `±${bbWidth.toFixed(2)}%`,
      signal: bbWidth > 3.5 ? 'High Volatility' : bbWidth < 2 ? 'Low Volatility' : 'Normal Range',
      signalType: bbWidth > 3.5 ? 'bearish' : 'neutral',
      data: Array.from({ length: 20 }, () => +(bbWidth + (Math.random() - 0.5) * 0.5).toFixed(2)),
    },
    {
      id: 'MA',
      name: 'Moving Average',
      description: 'Smooths price data to identify trend direction (SMA 50 vs SMA 200).',
      value: 'Above SMA 50',
      signal: Math.random() > 0.5 ? 'Golden Cross' : 'Below SMA 200',
      signalType: Math.random() > 0.5 ? 'bullish' : 'bearish',
      data: Array.from({ length: 20 }, (_, i) => 150 + i * 0.5 + (Math.random() - 0.5) * 3),
    },
    {
      id: 'ATR',
      name: 'Average True Range',
      description: 'Measures market volatility. Higher ATR = higher volatility.',
      value: +atrVal.toFixed(2),
      signal: atrVal > 8 ? 'High Volatility' : atrVal < 4 ? 'Low Volatility' : 'Moderate',
      signalType: atrVal > 8 ? 'bearish' : 'neutral',
      data: Array.from({ length: 20 }, () => +(atrVal + (Math.random() - 0.5) * 2).toFixed(2)),
    },
    {
      id: 'Stochastic',
      name: 'Stochastic Oscillator',
      description: 'Compares closing price to price range. Signals overbought/oversold conditions.',
      value: stochVal,
      signal: stochVal > 80 ? 'Overbought' : stochVal < 20 ? 'Oversold' : 'Neutral',
      signalType: stochVal > 80 ? 'overbought' : stochVal < 20 ? 'oversold' : 'neutral',
      data: Array.from({ length: 20 }, () => Math.floor(Math.random() * 100)),
    },
  ];
}

// Simulate ML prediction
export async function simulatePrediction(
  symbol: string,
  indicators: string[],
  delay: number = 2500
): Promise<PredictionResult> {
  await new Promise((res) => setTimeout(res, delay));

  const volatilityScore = +(Math.random() * 0.9 + 0.05).toFixed(3);
  const riskLevel =
    volatilityScore < 0.3 ? 'Low' : volatilityScore < 0.6 ? 'Medium' : 'High';
  const confidence = +(Math.random() * 25 + 70).toFixed(1);
  const trends = ['Bullish', 'Bearish', 'Sideways'] as const;
  const trendDirection = trends[Math.floor(Math.random() * trends.length)];

  return {
    volatilityScore,
    riskLevel,
    confidence,
    trendDirection,
    timestamp: new Date().toISOString(),
    indicators: indicators as any,
    stockSymbol: symbol,
  };
}

// Feature importance data
export function getFeatureImportance(): FeatureImportance[] {
  return [
    { feature: 'RSI (14)', importance: 0.87, color: '#00F5A0' },
    { feature: 'MACD Signal', importance: 0.76, color: '#7F5AF0' },
    { feature: 'ATR (14)', importance: 0.71, color: '#00C9FF' },
    { feature: 'Bollinger Width', importance: 0.65, color: '#F59E0B' },
    { feature: 'Volume Ratio', importance: 0.58, color: '#EF4444' },
    { feature: 'SMA 50/200', importance: 0.52, color: '#EC4899' },
    { feature: 'Stochastic %K', importance: 0.48, color: '#8B5CF6' },
    { feature: 'Price Momentum', importance: 0.41, color: '#06B6D4' },
  ];
}

// Model metrics
export function getModelMetrics(): ModelMetrics {
  return {
    accuracy: 87.4,
    precision: 84.2,
    recall: 89.1,
    f1Score: 86.6,
    mse: 0.023,
    mae: 0.118,
  };
}

// Prediction history
export function getPredictionHistory(): PredictionHistoryItem[] {
  const stocks = STOCK_DATABASE.slice(0, 8);
  return stocks.map((stock, i) => {
    const vol = +(Math.random() * 0.9 + 0.05).toFixed(3);
    const date = new Date();
    date.setDate(date.getDate() - i * 3 - Math.floor(Math.random() * 3));
    return {
      id: `pred-${i}`,
      stock: stock.symbol,
      stockName: stock.name,
      date: date.toISOString().split('T')[0],
      indicators: ['RSI', 'MACD', 'BB'].slice(0, Math.floor(Math.random() * 3) + 1) as any,
      predictedVolatility: vol,
      riskLevel: vol < 0.3 ? 'Low' : vol < 0.6 ? 'Medium' : 'High',
      confidence: +(Math.random() * 20 + 72).toFixed(1),
      actual: +(vol + (Math.random() - 0.5) * 0.1).toFixed(3),
    };
  });
}

// Historical accuracy data for chart
export function getHistoricalAccuracy() {
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    return {
      date: date.toISOString().split('T')[0],
      accuracy: +(80 + Math.random() * 15).toFixed(1),
      predicted: +(Math.random() * 0.8 + 0.1).toFixed(3),
      actual: +(Math.random() * 0.8 + 0.1).toFixed(3),
    };
  });
}

export function formatMarketCap(val?: number): string {
  if (!val) return 'N/A';
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
  return `$${val.toFixed(0)}`;
}

export function formatVolume(val: number): string {
  if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
  if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`;
  return val.toString();
}

export function getRiskColor(level: string): string {
  if (level === 'Low') return '#00F5A0';
  if (level === 'Medium') return '#F59E0B';
  return '#EF4444';
}

export function getVolatilityLabel(score: number): string {
  if (score < 0.3) return 'Low';
  if (score < 0.6) return 'Medium';
  return 'High';
}
