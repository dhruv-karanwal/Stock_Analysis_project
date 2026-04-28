'use client';

import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, Zap } from 'lucide-react';
import { FeatureImportanceChart } from '@/components/FeatureImportanceChart';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';
import { getFeatureImportance, getModelMetrics, getHistoricalAccuracy } from '@/lib/mockData';
import { ExplanationBlock } from '@/components/layout/ExplanationBlock';

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
    <div className="p-8 space-y-10 bg-[#0B0F19] min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-black font-display text-[#E2E8F0] tracking-tighter flex items-center gap-3">
            <Brain className="w-8 h-8 text-[#00F5A0]" />
            Model Intelligence
          </h1>
          <p className="text-[#64748B] text-base mt-2">ML model interpretability and institutional performance analytics</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex flex-col items-end">
             <span className="text-[10px] font-black text-[#475569] uppercase tracking-[0.2em]">Model State</span>
             <span className="text-[#00F5A0] text-xs font-bold flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-[#00F5A0] animate-pulse" />
               Operational
             </span>
           </div>
        </div>
      </div>

      {/* Model Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRIC_CARDS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 group hover:neon-glow-mint transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl" style={{ backgroundColor: m.color + '15' }}>
                <m.icon className="w-4 h-4" style={{ color: m.color }} />
              </div>
              <span className="text-[#64748B] text-[10px] font-black uppercase tracking-widest">{m.label}</span>
            </div>
            <div className="text-4xl font-black metric-value tracking-tighter mb-2" style={{ color: m.color }}>{m.value}</div>
            <p className="text-[#475569] text-[10px] font-medium leading-relaxed">{m.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Feature Importance Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-[#E2E8F0] font-black text-xl tracking-tight mb-1">Feature Contribution Analysis</h2>
                <p className="text-[#64748B] text-xs">Relative weighting of input indicators in the final prediction</p>
              </div>
              <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-[#94A3B8]">
                SHAP VALUES
              </div>
            </div>
            <div className="h-[350px]">
              <FeatureImportanceChart data={featureData} type="bar" />
            </div>
          </motion.div>

          {/* Historical Accuracy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-8"
          >
             <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-[#E2E8F0] font-black text-xl tracking-tight mb-1">Training Accuracy (30 Days)</h2>
                <p className="text-[#64748B] text-xs">Backtested performance of the XGBoost + LSTM ensemble</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={histData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00F5A0" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00F5A0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="accuracy" stroke="#00F5A0" strokeWidth={3} fill="url(#accGrad)" dot={{ r: 4, fill: '#00F5A0', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="space-y-8">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 bg-gradient-to-br from-[#1a2235]/40 to-transparent"
          >
            <h2 className="text-[#E2E8F0] font-black text-lg mb-2 tracking-tight">Indicator Bias</h2>
            <p className="text-[#64748B] text-xs mb-8">Multi-dimensional sensitivity analysis</p>
            <div className="h-64">
              <FeatureImportanceChart data={featureData} type="radar" />
            </div>
          </motion.div>

          <div className="space-y-4">
             <h3 className="text-[#E2E8F0] font-bold text-sm uppercase tracking-widest px-1">Interpretability</h3>
             <ExplanationBlock 
                title="Model Interpretability"
                description="We use SHAP (SHapley Additive exPlanations) to decompose the model's output into contributions from each technical indicator."
                whyItMatters="Ensures the model is making decisions based on sound financial theory rather than noise."
             />
             <ExplanationBlock 
                title="Ensemble Architecture"
                description="Our pipeline utilizes an XGBoost regressor for non-linear feature interactions and an LSTM for sequential dependency mapping."
                whyItMatters="Hybridizing these architectures reduces bias and improves generalizability across volatile market sessions."
                icon="help"
             />
          </div>
        </div>
      </div>
    </div>
  );
}
