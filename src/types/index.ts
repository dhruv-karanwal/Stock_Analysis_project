// Stock types
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  sector?: string;
}

export interface StockDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  volatility?: number;
}

// Technical Indicators
export type IndicatorId = 'RSI' | 'MACD' | 'BB' | 'MA' | 'ATR' | 'Stochastic';

export interface Indicator {
  id: IndicatorId;
  name: string;
  description: string;
  value?: number | string;
  signal?: string;
  signalType?: 'bullish' | 'bearish' | 'neutral' | 'overbought' | 'oversold';
  data?: number[];
}

// Prediction types
export interface PredictionResult {
  volatilityScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  confidence: number;
  trendDirection: 'Bullish' | 'Bearish' | 'Sideways';
  timestamp: string;
  indicators: IndicatorId[];
  stockSymbol: string;
}

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type TimeFrame = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

// Prediction History
export interface PredictionHistoryItem {
  id: string;
  stock: string;
  stockName: string;
  date: string;
  indicators: IndicatorId[];
  predictedVolatility: number;
  riskLevel: RiskLevel;
  confidence: number;
  actual?: number;
}

// Feature importance
export interface FeatureImportance {
  feature: string;
  importance: number;
  color?: string;
}

// Model metrics
export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  mse: number;
  mae: number;
}

// App state
export interface AppState {
  selectedStock: Stock | null;
  selectedIndicators: IndicatorId[];
  timeFrame: TimeFrame;
  predictionResult: PredictionResult | null;
  isLoading: boolean;
  isPredicting: boolean;
  error: string | null;
}
