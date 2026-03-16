import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  AppState,
  IndicatorId,
  PredictionResult,
  Stock,
  TimeFrame,
} from '@/types';

interface AppStore extends AppState {
  setSelectedStock: (stock: Stock | null) => void;
  toggleIndicator: (id: IndicatorId) => void;
  setIndicators: (ids: IndicatorId[]) => void;
  setTimeFrame: (tf: TimeFrame) => void;
  setPredictionResult: (result: PredictionResult | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsPredicting: (predicting: boolean) => void;
  setError: (error: string | null) => void;
  resetPrediction: () => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      selectedStock: null,
      selectedIndicators: ['RSI', 'MACD', 'BB'],
      timeFrame: '3M',
      predictionResult: null,
      isLoading: false,
      isPredicting: false,
      error: null,

      setSelectedStock: (stock) =>
        set({ selectedStock: stock, predictionResult: null, error: null }),

      toggleIndicator: (id) =>
        set((state) => ({
          selectedIndicators: state.selectedIndicators.includes(id)
            ? state.selectedIndicators.filter((i) => i !== id)
            : [...state.selectedIndicators, id],
        })),

      setIndicators: (ids) => set({ selectedIndicators: ids }),

      setTimeFrame: (tf) => set({ timeFrame: tf }),

      setPredictionResult: (result) => set({ predictionResult: result }),

      setIsLoading: (loading) => set({ isLoading: loading }),

      setIsPredicting: (predicting) => set({ isPredicting: predicting }),

      setError: (error) => set({ error }),

      resetPrediction: () =>
        set({ predictionResult: null, error: null, isPredicting: false }),
    }),
    { name: 'VolatilityAI' }
  )
);
