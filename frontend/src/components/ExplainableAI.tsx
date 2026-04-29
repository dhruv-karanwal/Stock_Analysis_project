'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Feature {
  name: string;
  importance: number;
  impact: 'positive' | 'negative' | 'neutral';
}

interface ExplainableAIProps {
  ticker: string;
}

export function ExplainableAI({ ticker }: ExplainableAIProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateMockFeatures = () => {
      const mockFeatures: Feature[] = [
        { name: 'RSI', importance: 0.28, impact: 'positive' as const },
        { name: 'MACD Signal', importance: 0.22, impact: 'positive' as const },
        { name: 'Volume Change', importance: 0.18, impact: 'negative' as const },
        { name: 'SMA 50', importance: 0.16, impact: 'positive' as const },
        { name: 'Momentum', importance: 0.16, impact: 'neutral' as const },
      ].sort((a, b) => b.importance - a.importance);

      setFeatures(mockFeatures);
      setLoading(false);
    };

    setLoading(true);
    const timer = setTimeout(generateMockFeatures, 600);
    return () => clearTimeout(timer);
  }, [ticker]);

  if (loading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const chartData = features.map((f) => ({
    name: f.name,
    importance: (f.importance * 100).toFixed(1),
  }));

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold mb-1">Explainable AI</h3>
        <p className="text-sm text-slate-400">Top features influencing the ML prediction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value: any) => [`${value}%`, 'Importance']}
              />
              <Bar dataKey="importance" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Feature List */}
        <div className="space-y-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-3 border ${
                feature.impact === 'positive'
                  ? 'bg-green-500/10 border-green-500/30'
                  : feature.impact === 'negative'
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-slate-700/50 border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-200">{feature.name}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {(feature.importance * 100).toFixed(1)}% influence
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {feature.impact === 'positive' ? (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-bold text-green-400">+</span>
                    </div>
                  ) : feature.impact === 'negative' ? (
                    <div className="flex items-center gap-1">
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <span className="text-xs font-bold text-red-400">-</span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-yellow-400">~</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 text-sm text-slate-300 space-y-2">
        <p className="font-semibold">How to interpret:</p>
        <ul className="text-xs text-slate-400 space-y-1 ml-4">
          <li>• <span className="text-green-400">+</span> Positive impact: increases prediction confidence</li>
          <li>• <span className="text-red-400">-</span> Negative impact: decreases prediction confidence</li>
          <li>• <span className="text-yellow-400">~</span> Neutral impact: minimal influence on prediction</li>
        </ul>
      </div>
    </div>
  );
}
