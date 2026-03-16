'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Indicator } from '@/types';

const SIGNAL_COLORS: Record<string, string> = {
  bullish: '#00F5A0',
  bearish: '#EF4444',
  neutral: '#94A3B8',
  overbought: '#F59E0B',
  oversold: '#7F5AF0',
};

const INDICATOR_COLORS: Record<string, string> = {
  RSI: '#00F5A0',
  MACD: '#7F5AF0',
  BB: '#00C9FF',
  MA: '#F59E0B',
  ATR: '#EF4444',
  Stochastic: '#EC4899',
};

interface IndicatorCardProps {
  indicator: Indicator;
  index?: number;
}

export function IndicatorCard({ indicator, index = 0 }: IndicatorCardProps) {
  const color = INDICATOR_COLORS[indicator.id] || '#00F5A0';
  const signalColor = SIGNAL_COLORS[indicator.signalType || 'neutral'];
  const signalBg = signalColor + '15';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="glass-card p-4 flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
          />
          <span className="text-[#E2E8F0] text-sm font-semibold">{indicator.name}</span>
        </div>
        <div
          className="px-2 py-0.5 rounded-full text-xs font-medium border"
          style={{ color: signalColor, backgroundColor: signalBg, borderColor: signalColor + '40' }}
        >
          {indicator.signal}
        </div>
      </div>

      {/* Value */}
      <div>
        <div className="text-2xl font-bold metric-value" style={{ color }}>
          {typeof indicator.value === 'number'
            ? indicator.value.toFixed(2)
            : indicator.value}
        </div>
        <div className="text-xs text-[#64748B] mt-0.5">{indicator.id} Value</div>
      </div>

      {/* Mini sparkline */}
      {indicator.data && indicator.data.length > 0 && (
        <div className="h-10 opacity-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={indicator.data.map((v, i) => ({ i, v }))}>
              <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
