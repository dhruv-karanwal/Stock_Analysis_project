const API_BASE_URL = 'http://127.0.0.1:8000';

export interface PredictionResponse {
  RF_prob: number;
  LR_prob: number;
  SVM_prob: number;
  Confidence: number;
  Prediction: string;
}

export interface PricePredictionResponse {
  Current_Price: number;
  Predicted_Price: number;
  Expected_Change: number;
}

export interface StockResponse {
  Ticker: string;
  Prediction: string;
  Confidence: number;
  Strength?: string;
}

export interface HistoricalPriceResponse {
  date: string;
  price: number;
  volume: number;
  ma50?: number;
  ma200?: number;
}

export interface TechnicalIndicatorsResponse {
  rsi: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  ma50: number;
  ma200: number;
  currentPrice: number;
}

export interface FeatureImportanceResponse {
  features: Array<{
    name: string;
    importance: number;
    impact: 'positive' | 'negative' | 'neutral';
  }>;
}

export async function getPrediction(ticker: string): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict/${ticker}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch prediction');
  }
  return response.json();
}

export async function getPricePrediction(ticker: string): Promise<PricePredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict_price/${ticker}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch price prediction');
  }
  return response.json();
}

export async function getAllStocks(): Promise<StockResponse[]> {
  const response = await fetch(`${API_BASE_URL}/predict_all`);
  if (!response.ok) {
    throw new Error('Failed to fetch all stocks');
  }
  return response.json();
}

export async function getHistoricalPrices(ticker: string, period: string = '1M'): Promise<HistoricalPriceResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/historical_prices/${ticker}?period=${period}`);
    if (!response.ok) {
      throw new Error('Failed to fetch historical prices');
    }
    return response.json();
  } catch (error) {
    // Return mock data if endpoint doesn't exist
    console.log('Using mock historical data');
    return [];
  }
}

export async function getTechnicalIndicators(ticker: string): Promise<TechnicalIndicatorsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/technical_indicators/${ticker}`);
    if (!response.ok) {
      throw new Error('Failed to fetch technical indicators');
    }
    return response.json();
  } catch (error) {
    // Return mock data if endpoint doesn't exist
    console.log('Using mock technical data');
    return {
      rsi: 55,
      macd: 0.5,
      macdSignal: 0.4,
      macdHistogram: 0.1,
      ma50: 145.32,
      ma200: 142.15,
      currentPrice: 150,
    };
  }
}

export async function getFeatureImportance(ticker: string): Promise<FeatureImportanceResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/feature_importance/${ticker}`);
    if (!response.ok) {
      throw new Error('Failed to fetch feature importance');
    }
    return response.json();
  } catch (error) {
    // Return mock data if endpoint doesn't exist
    console.log('Using mock feature importance data');
    return {
      features: [
        { name: 'RSI', importance: 0.28, impact: 'positive' },
        { name: 'MACD Signal', importance: 0.22, impact: 'positive' },
        { name: 'Volume Change', importance: 0.18, impact: 'negative' },
        { name: 'SMA 50', importance: 0.16, impact: 'positive' },
        { name: 'Momentum', importance: 0.16, impact: 'neutral' },
      ],
    };
  }
}
