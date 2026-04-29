'use client';

import { ChevronRight } from 'lucide-react';
import { StockResponse } from '@/services/api';

interface StockListProps {
  stocks: StockResponse[];
  title?: string;
}

export function StockList({ stocks, title = 'Stocks' }: StockListProps) {
  if (stocks.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-slate-400">
        No stocks available
      </div>
    );
  }

  const getPredictionColor = (prediction: string) => {
    switch (prediction.toLowerCase()) {
      case 'high':
        return 'bg-red-500/10 text-red-400';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400';
      case 'low':
        return 'bg-green-500/10 text-green-400';
      default:
        return 'bg-slate-500/10 text-slate-400';
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="divide-y divide-slate-700">
        {stocks.map((stock, idx) => (
          <div
            key={`${stock.Ticker}-${idx}`}
            className="px-6 py-4 hover:bg-slate-700/30 transition flex items-center justify-between group cursor-pointer"
          >
            <div className="flex-1">
              <p className="font-semibold text-slate-200">{stock.Ticker}</p>
              <p className="text-xs text-slate-400">
                Confidence: {(stock.Confidence * 100).toFixed(1)}%
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded text-sm font-semibold ${getPredictionColor(stock.Prediction)}`}>
                {stock.Prediction}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
