'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface IndicatorData {
  rsi: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  ma50: number;
  ma200: number;
  currentPrice: number;
}

interface TechnicalIndicatorsProps {
  ticker: string;
}

export function TechnicalIndicators({ ticker }: TechnicalIndicatorsProps) {
  const [indicators, setIndicators] = useState<IndicatorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateMockIndicators = () => {
      const mockData: IndicatorData = {
        rsi: 45 + Math.random() * 50,
        macd: (Math.random() - 0.5) * 3,
        macdSignal: (Math.random() - 0.5) * 2.8,
        macdHistogram: (Math.random() - 0.5) * 0.5,
        ma50: 145.32 + Math.random() * 10,
        ma200: 142.15 + Math.random() * 10,
        currentPrice: 150 + Math.random() * 20,
      };
      setIndicators(mockData);
      setLoading(false);
    };

    setLoading(true);
    const timer = setTimeout(generateMockIndicators, 600);
    return () => clearTimeout(timer);
  }, [ticker]);

  if (loading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!indicators) return null;

  const rsiStatus =
    indicators.rsi > 70 ? { label: 'Overbought', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' } :
    indicators.rsi < 30 ? { label: 'Oversold', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' } :
    { label: 'Neutral', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' };

  const macdStatus =
    indicators.macdHistogram > 0
      ? { label: 'Bullish', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' }
      : { label: 'Bearish', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' };

  const maTrend =
    indicators.currentPrice > indicators.ma50 && indicators.ma50 > indicators.ma200
      ? { label: 'Strong Uptrend', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' }
      : indicators.currentPrice < indicators.ma50 && indicators.ma50 < indicators.ma200
      ? { label: 'Strong Downtrend', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' }
      : { label: 'Consolidating', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold mb-1">Technical Indicators</h3>
        <p className="text-sm text-slate-400">RSI, MACD & Moving Average Analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RSI */}
        <div className={`border rounded-lg p-4 ${rsiStatus.bg}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-5 h-5 ${rsiStatus.color}`} />
              <span className="text-sm font-semibold text-slate-300">RSI (14)</span>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded ${rsiStatus.color} bg-slate-900/50`}>
              {rsiStatus.label}
            </span>
          </div>
          <p className={`text-3xl font-bold ${rsiStatus.color}`}>{indicators.rsi.toFixed(1)}</p>
          <div className="mt-2 w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                indicators.rsi > 70 ? 'bg-red-500' : indicators.rsi < 30 ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${indicators.rsi}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">0 (Oversold) — 100 (Overbought)</p>
        </div>

        {/* MACD */}
        <div className={`border rounded-lg p-4 ${macdStatus.bg}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-5 h-5 ${macdStatus.color}`} />
              <span className="text-sm font-semibold text-slate-300">MACD</span>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded ${macdStatus.color} bg-slate-900/50`}>
              {macdStatus.label}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">MACD Line</span>
              <span className={`font-semibold ${indicators.macd > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {indicators.macd.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Signal Line</span>
              <span className={`font-semibold ${indicators.macdSignal > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {indicators.macdSignal.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Histogram</span>
              <span className={`font-semibold ${indicators.macdHistogram > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {indicators.macdHistogram.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Moving Averages */}
        <div className={`border rounded-lg p-4 ${maTrend.bg} md:col-span-2`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {maTrend.label.includes('Uptrend') ? (
                <TrendingUp className={`w-5 h-5 ${maTrend.color}`} />
              ) : (
                <TrendingDown className={`w-5 h-5 ${maTrend.color}`} />
              )}
              <span className="text-sm font-semibold text-slate-300">Moving Average Trend</span>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded ${maTrend.color} bg-slate-900/50`}>
              {maTrend.label}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">Current Price</p>
              <p className="text-lg font-bold text-teal-400">${indicators.currentPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">MA50</p>
              <p className="text-lg font-bold text-blue-400">${indicators.ma50.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">MA200</p>
              <p className="text-lg font-bold text-purple-400">${indicators.ma200.toFixed(2)}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            {indicators.currentPrice > indicators.ma50 && indicators.ma50 > indicators.ma200
              ? '✓ All moving averages in bullish alignment'
              : indicators.currentPrice < indicators.ma50 && indicators.ma50 < indicators.ma200
              ? '✗ All moving averages in bearish alignment'
              : '~ Mixed moving average signals'}
          </p>
        </div>
      </div>
    </div>
  );
}
