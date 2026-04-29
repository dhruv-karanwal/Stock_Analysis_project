'use client';

import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface PriceCardProps {
  currentPrice: number;
  predictedPrice: number;
  expectedChange: number;
}

export function PriceCard({ currentPrice, predictedPrice, expectedChange }: PriceCardProps) {
  const percentChange = ((expectedChange / currentPrice) * 100).toFixed(2);
  const isPositive = expectedChange >= 0;
  const signal = isPositive ? 'Buy' : 'Sell';

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
          Price Prediction
        </h3>
        <DollarSign className="w-5 h-5 text-teal-400" />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-2">Current Price</p>
            <p className="text-2xl font-bold text-slate-200">${currentPrice.toFixed(2)}</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-2">Predicted Price</p>
            <p className="text-2xl font-bold text-teal-400">${predictedPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
            <div>
              <p className="text-xs text-slate-400">Expected Change</p>
              <p className={`text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}
                {expectedChange.toFixed(2)} ({percentChange}%)
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs text-slate-400 mb-2">Trading Signal</p>
          <span className={`inline-block px-4 py-2 rounded-lg font-semibold text-sm ${
            isPositive 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {signal}
          </span>
        </div>
      </div>
    </div>
  );
}
