'use client';

import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Brush,
} from 'recharts';
import { motion } from 'framer-motion';
import { StockDataPoint } from '@/types';
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl p-3 shadow-2xl text-xs">
        <p className="text-[#94A3B8] mb-2 font-medium">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[#94A3B8]">{entry.name}:</span>
            <span className="text-[#E2E8F0] font-bold font-mono">{
              entry.name === 'Volatility' ? entry.value?.toFixed(4) : `$${entry.value?.toFixed(2)}`
            }</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

type ChartView = 'price' | 'volatility';

interface VolatilityChartProps {
  data: StockDataPoint[];
  symbol: string;
}

export function VolatilityChart({ data, symbol }: VolatilityChartProps) {
  const [view, setView] = useState<ChartView>('price');

  const chartData = data.map((d) => ({
    date: d.date.slice(5), // MM-DD
    Close: d.close,
    Open: d.open,
    High: d.high,
    Low: d.low,
    Volatility: +(d.volatility ?? 0),
    Volume: d.volume,
  }));

  const avgVol = chartData.reduce((acc, d) => acc + d.Volatility, 0) / chartData.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-[#00F5A0]/10">
            <TrendingUp className="w-4 h-4 text-[#00F5A0]" />
          </div>
          <div>
            <h3 className="text-[#E2E8F0] font-semibold text-sm">{symbol} — {view === 'price' ? 'Price Chart' : 'Volatility Chart'}</h3>
            <p className="text-[#64748B] text-xs">{data.length} data points</p>
          </div>
        </div>

        <div className="flex bg-[#0B0F19] rounded-lg p-0.5">
          {(['price', 'volatility'] as ChartView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                view === v
                  ? 'bg-[#1a2235] text-[#00F5A0] shadow-sm'
                  : 'text-[#64748B] hover:text-[#94A3B8]'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F5A0" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#00F5A0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7F5AF0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7F5AF0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748B', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={Math.floor(chartData.length / 6)}
            />
            <YAxis
              tick={{ fill: '#64748B', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => view === 'price' ? `$${v.toFixed(0)}` : v.toFixed(3)}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            {view === 'price' ? (
              <Area
                type="monotone"
                dataKey="Close"
                stroke="#00F5A0"
                strokeWidth={2}
                fill="url(#colorPrice)"
                dot={false}
                activeDot={{ r: 4, fill: '#00F5A0', strokeWidth: 2, stroke: '#0B0F19' }}
                animationDuration={1000}
              />
            ) : (
              <>
                <ReferenceLine y={avgVol} stroke="#F59E0B" strokeDasharray="4 4" opacity={0.6} />
                <Area
                  type="monotone"
                  dataKey="Volatility"
                  stroke="#7F5AF0"
                  strokeWidth={2}
                  fill="url(#colorVol)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#7F5AF0', strokeWidth: 2, stroke: '#0B0F19' }}
                  animationDuration={1000}
                />
              </>
            )}
            <Brush dataKey="date" height={20} fill="#111827" stroke="rgba(255,255,255,0.05)" travellerWidth={6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
