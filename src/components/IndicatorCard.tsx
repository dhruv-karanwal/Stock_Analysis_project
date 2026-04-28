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
      className="glass-card p-5 flex flex-col gap-4 group hover:neon-glow-mint transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
          />
          <span className="text-[#E2E8F0] text-sm font-bold font-display">{indicator.name}</span>
        </div>
        <div
          className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border"
          style={{ color: signalColor, backgroundColor: signalBg, borderColor: signalColor + '30' }}
        >
          {indicator.signal}
        </div>
      </div>

      {/* Value & Description */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="text-3xl font-black metric-value leading-none" style={{ color }}>
            {indicator.value}
          </div>
          <p className="text-[#64748B] text-[11px] mt-2 leading-relaxed italic">
            {indicator.description}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
           <div className={`px-2 py-1 rounded-md text-[9px] font-bold ${indicator.usedInModel ? 'bg-[#00F5A0]/10 text-[#00F5A0] border border-[#00F5A0]/20' : 'bg-white/5 text-[#475569] border border-white/5'}`}>
              MODEL: {indicator.usedInModel ? 'ACTIVE' : 'INACTIVE'}
           </div>
        </div>
      </div>

      {/* Mini sparkline */}
      {indicator.data && indicator.data.length > 0 && (
        <div className="h-12 opacity-60 group-hover:opacity-100 transition-opacity mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={indicator.data.map((v, i) => ({ i, v }))}>
              <Line 
                type="monotone" 
                dataKey="v" 
                stroke={color} 
                strokeWidth={2} 
                dot={false}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
