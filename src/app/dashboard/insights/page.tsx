'use client';

import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, Zap } from 'lucide-react';
import { FeatureImportanceChart } from '@/components/FeatureImportanceChart';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';
import { getFeatureImportance, getModelMetrics, getHistoricalAccuracy } from '@/lib/mockData';

const metrics = getModelMetrics();
const featureData = getFeatureImportance();
const histData = getHistoricalAccuracy();

const METRIC_CARDS = [
  { label: 'Model Accuracy', value: `${metrics.accuracy}%`, icon: Target, color: '#00F5A0', description: 'Overall prediction correctness' },
  { label: 'Precision', value: `${metrics.precision}%`, icon: TrendingUp, color: '#7F5AF0', description: 'Positive prediction accuracy' },
  { label: 'Recall', value: `${metrics.recall}%`, icon: Brain, color: '#00C9FF', description: 'High-risk detection rate' },
  { label: 'F1 Score', value: `${metrics.f1Score}%`, icon: Zap, color: '#F59E0B', description: 'Harmonic mean (Precision, Recall)' },
];

export default function InsightsPage() {
  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold font-display text-[#E2E8F0]">Model Insights</h1>
        <p className="text-[#64748B] text-sm mt-1">ML model interpretability and performance analytics</p>
      </div>

      {/* Model Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {METRIC_CARDS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: m.color + '20' }}>
                <m.icon className="w-3.5 h-3.5" style={{ color: m.color }} />
              </div>
              <span className="text-[#64748B] text-xs">{m.label}</span>
            </div>
            <div className="text-2xl font-bold metric-value" style={{ color: m.color }}>{m.value}</div>
            <p className="text-[#475569] text-xs mt-1">{m.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Feature Importance Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <h2 className="text-[#E2E8F0] font-semibold text-sm mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00F5A0]" />
            Feature Importance
          </h2>
          <p className="text-[#64748B] text-xs mb-4">Which indicators contribute most to the prediction?</p>
          <FeatureImportanceChart data={featureData} type="bar" />
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <h2 className="text-[#E2E8F0] font-semibold text-sm mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#7F5AF0]" />
            Indicator Contribution Radar
          </h2>
          <p className="text-[#64748B] text-xs mb-4">Multi-dimensional view of indicator contributions</p>
          <FeatureImportanceChart data={featureData} type="radar" />
        </motion.div>

        {/* Historical Accuracy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5 xl:col-span-2"
        >
          <h2 className="text-[#E2E8F0] font-semibold text-sm mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00C9FF]" />
            Historical Accuracy (30 days)
          </h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={histData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C9FF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00C9FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} domain={[70, 100]} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} width={40} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: '#94A3B8' }}
                  itemStyle={{ color: '#00C9FF' }}
                />
                <Area type="monotone" dataKey="accuracy" stroke="#00C9FF" strokeWidth={2} fill="url(#accGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Model Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-5"
      >
        <h2 className="text-[#E2E8F0] font-semibold text-sm mb-4">Model Configuration</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {[
            { k: 'Algorithm', v: 'XGBoost + LSTM Ensemble' },
            { k: 'Training Data', v: '5 Years Historical' },
            { k: 'Features', v: '8 Technical Indicators' },
            { k: 'Last Updated', v: 'March 2026' },
            { k: 'MSE', v: metrics.mse.toFixed(4) },
            { k: 'MAE', v: metrics.mae.toFixed(4) },
            { k: 'Lookback Window', v: '20 Trading Days' },
            { k: 'Prediction Horizon', v: '5–10 Days Forward' },
          ].map(({ k, v }) => (
            <div key={k} className="bg-[#0B0F19] rounded-xl p-3">
              <div className="text-[#64748B] mb-1">{k}</div>
              <div className="text-[#E2E8F0] font-semibold">{v}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
