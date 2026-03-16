'use client';

import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { Indicator, IndicatorId } from '@/types';

const INDICATOR_META: Record<IndicatorId, { color: string; short: string }> = {
  RSI: { color: '#00F5A0', short: 'RSI' },
  MACD: { color: '#7F5AF0', short: 'MACD' },
  BB: { color: '#00C9FF', short: 'BB' },
  MA: { color: '#F59E0B', short: 'MA' },
  ATR: { color: '#EF4444', short: 'ATR' },
  Stochastic: { color: '#EC4899', short: 'STOCH' },
};

const ALL_INDICATORS: Indicator[] = [
  { id: 'RSI', name: 'RSI', description: 'Relative Strength Index (14) — Measures price momentum. Overbought >70, Oversold <30.' },
  { id: 'MACD', name: 'MACD', description: 'Moving Average Convergence Divergence — Trend and momentum signal from EMA crossovers.' },
  { id: 'BB', name: 'Bollinger Bands', description: 'Volatility bands ±2σ around SMA 20. Band squeeze signals low volatility breakout.' },
  { id: 'MA', name: 'Moving Average', description: 'SMA 50 and SMA 200 — Identifies trend direction. Golden Cross = bullish; Death Cross = bearish.' },
  { id: 'ATR', name: 'ATR', description: 'Average True Range (14) — Measures market volatility. Higher ATR = wider price swings.' },
  { id: 'Stochastic', name: 'Stochastic %K', description: 'Stochastic Oscillator — Compares closing price to range. Overbought >80, Oversold <20.' },
];

interface IndicatorSelectorProps {
  selected: IndicatorId[];
  onToggle: (id: IndicatorId) => void;
}

export function IndicatorSelector({ selected, onToggle }: IndicatorSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {ALL_INDICATORS.map((ind, i) => {
        const isSelected = selected.includes(ind.id);
        const meta = INDICATOR_META[ind.id];

        return (
          <motion.button
            key={ind.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onToggle(ind.id)}
            className={`relative flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 group ${
              isSelected
                ? 'border-opacity-50 bg-opacity-10'
                : 'border-white/7 bg-[#111827] hover:border-white/15'
            }`}
            style={isSelected ? {
              borderColor: meta.color + '60',
              backgroundColor: meta.color + '10',
            } : {}}
          >
            {/* Checkbox */}
            <div
              className="mt-0.5 w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all"
              style={isSelected
                ? { backgroundColor: meta.color, borderColor: meta.color }
                : { borderColor: 'rgba(255,255,255,0.2)' }
              }
            >
              {isSelected && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  width="10" height="10" viewBox="0 0 10 10"
                >
                  <path d="M2 5l2 2 4-4" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </motion.svg>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                  style={{ color: meta.color, backgroundColor: meta.color + '20' }}
                >
                  {meta.short}
                </span>
                <span className="text-[#E2E8F0] text-sm font-medium">{ind.name}</span>
              </div>
              <p className="text-[#64748B] text-xs mt-1 leading-relaxed">{ind.description}</p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
