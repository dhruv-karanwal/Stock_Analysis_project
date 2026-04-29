'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { getPrediction, getPricePrediction, PredictionResponse, PricePredictionResponse } from '@/services/api';
import { PredictionCard } from '@/components/PredictionCard';
import { PriceCard } from '@/components/PriceCard';
import { HistoricalPriceChart } from '@/components/HistoricalPriceChart';
import { TechnicalIndicators } from '@/components/TechnicalIndicators';
import { ExplainableAI } from '@/components/ExplainableAI';
import { EnhancedPortfolioSimulator } from '@/components/EnhancedPortfolioSimulator';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AlertCircle } from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const ticker = searchParams.get('ticker');

  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);
  const [priceData, setPriceData] = useState<PricePredictionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) {
      setError('No ticker provided');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prediction, price] = await Promise.all([
          getPrediction(ticker),
          getPricePrediction(ticker),
        ]);
        setPredictionData(prediction);
        setPriceData(price);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticker]);

  if (!ticker) {
    return (
      <main className="flex-1 flex items-center justify-center py-20 px-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">No Ticker Selected</h1>
          <p className="text-slate-400">Please enter a ticker symbol to analyze</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col py-12 px-6">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">{ticker}</h1>
          <p className="text-slate-400">Comprehensive ML-powered analysis and portfolio simulation</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-400 mb-1">Error</h3>
              <p className="text-red-400/80 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Core Predictions */}
        {!loading && predictionData && priceData && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PredictionCard
                prediction={predictionData.Prediction}
                confidence={predictionData.Confidence}
              />
              <PriceCard
                currentPrice={priceData.Current_Price}
                predictedPrice={priceData.Predicted_Price}
                expectedChange={priceData.Expected_Change}
              />
            </div>

            {/* Model Confidence Breakdown */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Model Confidence Breakdown</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-slate-400">Random Forest</p>
                    <p className="font-semibold">{(predictionData.RF_prob * 100).toFixed(1)}%</p>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${predictionData.RF_prob * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-slate-400">Logistic Regression</p>
                    <p className="font-semibold">{(predictionData.LR_prob * 100).toFixed(1)}%</p>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${predictionData.LR_prob * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-slate-400">Support Vector Machine</p>
                    <p className="font-semibold">{(predictionData.SVM_prob * 100).toFixed(1)}%</p>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${predictionData.SVM_prob * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Historical Price Chart */}
            <HistoricalPriceChart ticker={ticker} />

            {/* Technical Indicators */}
            <TechnicalIndicators ticker={ticker} />

            {/* Explainable AI */}
            <ExplainableAI ticker={ticker} />

            {/* Portfolio Simulator */}
            <EnhancedPortfolioSimulator
              ticker={ticker}
              currentPrice={priceData.Current_Price}
              predictedPrice={priceData.Predicted_Price}
              confidence={predictionData.Confidence}
              historicalVolatility={0.25}
            />
          </>
        )}
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardContent />
    </Suspense>
  );
}
