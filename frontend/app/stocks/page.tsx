'use client';

import { useEffect, useState } from 'react';
import { getAllStocks, StockResponse } from '@/services/api';
import { StockList } from '@/components/StockList';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AlertCircle } from 'lucide-react';

export default function StocksPage() {
  const [stocks, setStocks] = useState<StockResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'confidence' | 'prediction'>('confidence');

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllStocks();
        setStocks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stocks');
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const sortedStocks = [...stocks].sort((a, b) => {
    if (sortBy === 'confidence') {
      return b.Confidence - a.Confidence;
    }
    return a.Prediction.localeCompare(b.Prediction);
  });

  return (
    <main className="flex-1 flex flex-col py-12 px-6">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">All Stocks</h1>
            <p className="text-slate-400">{stocks.length} stocks analyzed</p>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-400">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'confidence' | 'prediction')}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
            >
              <option value="confidence">Confidence (Highest)</option>
              <option value="prediction">Prediction Type</option>
            </select>
          </div>
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

        {/* Stocks List */}
        {!loading && stocks.length > 0 && (
          <StockList stocks={sortedStocks} title={`All ${stocks.length} Stocks`} />
        )}

        {/* Empty State */}
        {!loading && stocks.length === 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Stocks Available</h3>
            <p className="text-slate-400">No stock data available at the moment</p>
          </div>
        )}
      </div>
    </main>
  );
}
