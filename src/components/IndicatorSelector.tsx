'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="grid grid-cols-1 gap-2.5">
      {ALL_INDICATORS.map((ind, i) => {
        const isSelected = selected.includes(ind.id);
        const meta = INDICATOR_META[ind.id];

        return (
          <motion.button
            key={ind.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onToggle(ind.id)}
            className={`relative flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-300 group overflow-hidden ${
              isSelected
                ? 'bg-opacity-15 shadow-lg shadow-black/20'
                : 'border-white/5 bg-[#111827]/50 hover:border-white/15 hover:bg-[#111827]'
            }`}
            style={isSelected ? {
              borderColor: meta.color + '40',
              backgroundColor: meta.color + '12',
            } : { borderColor: 'rgba(255,255,255,0.05)' }}
          >
            {/* Glow on hover */}
            <div 
              className="absolute -right-4 -top-4 w-12 h-12 rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-xl"
              style={{ backgroundColor: meta.color }}
            />

            {/* Checkbox */}
            <div
              className="mt-1 w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 border-2 transition-all duration-300"
              style={isSelected
                ? { backgroundColor: meta.color, borderColor: meta.color }
                : { borderColor: 'rgba(255,255,255,0.1)' }
              }
            >
              <AnimatePresence>
                {isSelected && (
                  <motion.svg
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    width="12" height="12" viewBox="0 0 10 10"
                  >
                    <path d="M2 5l2 2 4-4" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1 min-w-0 z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="text-[9px] font-black font-mono px-1.5 py-0.5 rounded-md tracking-tighter"
                  style={{ color: meta.color, backgroundColor: meta.color + '20' }}
                >
                  {meta.short}
                </span>
                <span className={`text-sm font-bold transition-colors ${isSelected ? 'text-[#E2E8F0]' : 'text-[#94A3B8] group-hover:text-[#E2E8F0]'}`}>
                  {ind.name}
                </span>
              </div>
              <p className="text-[#64748B] text-[10px] leading-relaxed line-clamp-2">
                {ind.description}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
