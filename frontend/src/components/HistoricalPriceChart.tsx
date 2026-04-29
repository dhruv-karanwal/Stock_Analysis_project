'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { LoadingSpinner } from './LoadingSpinner';

interface PriceData {
  date: string;
  price: number;
  volume: number;
  ma50?: number;
  ma200?: number;
}

interface HistoricalPriceChartProps {
  ticker: string;
  onDataLoad?: (data: PriceData[]) => void;
}

export function HistoricalPriceChart({ ticker, onDataLoad }: HistoricalPriceChartProps) {
  const [data, setData] = useState<PriceData[]>([]);
  const [period, setPeriod] = useState<'1M' | '3M' | '6M' | '1Y'>('1M');
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'price' | 'volume'>('price');

  useEffect(() => {
    const generateMockData = () => {
      const now = new Date();
      const daysBack = period === '1M' ? 30 : period === '3M' ? 90 : period === '6M' ? 180 : 365;
      const points = daysBack;
      const data: PriceData[] = [];

      let basePrice = 100 + Math.random() * 100;
      let sum50 = 0;
      let sum200 = 0;

      for (let i = points; i > 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        basePrice += (Math.random() - 0.48) * 3;
        const price = Math.max(50, basePrice);
        const volume = Math.floor(Math.random() * 100000000) + 50000000;

        sum50 = sum50 + price;
        sum200 = sum200 + price;

        const ma50 = sum50 / Math.min(50, data.length + 1);
        const ma200 = sum200 / Math.min(200, data.length + 1);

        if (data.length > 50) sum50 -= data[data.length - 50].price;
        if (data.length > 200) sum200 -= data[data.length - 200].price;

        data.push({
          date: dateStr,
          price: parseFloat(price.toFixed(2)),
          volume,
          ma50: parseFloat(ma50.toFixed(2)),
          ma200: parseFloat(ma200.toFixed(2)),
        });
      }

      setData(data);
      onDataLoad?.(data);
      setLoading(false);
    };

    setLoading(true);
    // Simulate API call delay
    const timer = setTimeout(generateMockData, 800);
    return () => clearTimeout(timer);
  }, [period, ticker, onDataLoad]);

  if (loading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <LoadingSpinner />
      </div>
    );
  }

  const periodButtons = ['1M', '3M', '6M', '1Y'] as const;
  const maxPrice = Math.max(...data.map(d => d.price)) * 1.05;
  const minPrice = Math.min(...data.map(d => d.price)) * 0.95;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Price History</h3>
          <p className="text-sm text-slate-400">Historical price and volume analysis</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-1 bg-slate-700/50 p-1 rounded-lg">
            {periodButtons.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  period === p
                    ? 'bg-teal-500 text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex gap-1 bg-slate-700/50 p-1 rounded-lg">
            <button
              onClick={() => setChartType('price')}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                chartType === 'price'
                  ? 'bg-teal-500 text-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Price
            </button>
            <button
              onClick={() => setChartType('volume')}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                chartType === 'volume'
                  ? 'bg-teal-500 text-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Volume
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-80">
        {chartType === 'price' ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} domain={[minPrice, maxPrice]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value: any) => [`$${typeof value === 'number' ? value.toFixed(2) : value}`, '']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#14b8a6"
                dot={false}
                strokeWidth={2}
                name="Price"
              />
              <Line
                type="monotone"
                dataKey="ma50"
                stroke="#f59e0b"
                dot={false}
                strokeWidth={1.5}
                strokeDasharray="5 5"
                name="MA50"
              />
              <Line
                type="monotone"
                dataKey="ma200"
                stroke="#ef4444"
                dot={false}
                strokeWidth={1.5}
                strokeDasharray="5 5"
                name="MA200"
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value: any) => {
                  if (typeof value === 'number') {
                    return [`${(value / 1000000).toFixed(1)}M`, 'Volume'];
                  }
                  return [value, ''];
                }}
              />
              <Bar dataKey="volume" fill="#8b5cf6" name="Volume" radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
        <div>
          <p className="text-xs text-slate-400 mb-1">Current Price</p>
          <p className="text-lg font-bold text-teal-400">${data[data.length - 1]?.price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">High</p>
          <p className="text-lg font-bold text-green-400">${Math.max(...data.map(d => d.price)).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Low</p>
          <p className="text-lg font-bold text-red-400">${Math.min(...data.map(d => d.price)).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Avg Volume</p>
          <p className="text-lg font-bold text-blue-400">{(data.reduce((a, b) => a + b.volume, 0) / data.length / 1000000).toFixed(1)}M</p>
        </div>
      </div>
    </div>
  );
}
