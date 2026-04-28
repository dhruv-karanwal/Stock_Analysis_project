'use client';

import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import { PredictionTable } from '@/components/PredictionTable';
import { getPredictionHistory, getRiskColor } from '@/lib/mockData';
import { ExplanationBlock } from '@/components/layout/ExplanationBlock';

const historyData = getPredictionHistory();
const totalPredictions = historyData.length;
const avgVolatility = historyData.reduce((a, b) => a + b.predictedVolatility, 0) / totalPredictions;
const avgConfidence = historyData.reduce((a, b) => a + b.confidence, 0) / totalPredictions;
const highRiskCount = historyData.filter(d => d.riskLevel === 'High').length;

export default function HistoryPage() {
  return (
    <div className="p-8 space-y-10 bg-[#0B0F19] min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-black font-display text-[#E2E8F0] flex items-center gap-3 tracking-tighter">
            <History className="w-8 h-8 text-[#7F5AF0]" />
            Prediction Audit
          </h1>
          <p className="text-[#64748B] text-base mt-2">Historical performance and model accuracy tracking</p>
        </div>
        <div className="text-[10px] font-bold text-[#64748B] bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-widest">
          Dataset Size: {totalPredictions} Samples
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Predictions', value: totalPredictions, color: '#00F5A0', desc: 'Cumulative model runs' },
              { label: 'Avg Volatility', value: avgVolatility.toFixed(3), color: '#7F5AF0', desc: 'Mean predicted σ' },
              { label: 'Avg Confidence', value: `${avgConfidence.toFixed(1)}%`, color: '#00C9FF', desc: 'Model certainty score' },
              { label: 'High Risk Alerts', value: highRiskCount, color: '#EF4444', desc: 'Critical risk detections' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 group hover:neon-glow-mint transition-all"
              >
                <div className="text-[#64748B] text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</div>
                <div className="text-4xl font-black metric-value mb-2 tracking-tighter" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[#475569] text-[10px] font-medium">{s.desc}</div>
              </motion.div>
            ))}
          </div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-8"
          >
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-[#E2E8F0] font-black text-xl tracking-tight">Audit Trail</h2>
               <div className="flex gap-2">
                 {['ALL', 'HIGH RISK', 'LOW RISK'].map(f => (
                   <button key={f} className="text-[10px] font-bold text-[#64748B] px-3 py-1 rounded-md hover:bg-white/5 transition-all uppercase">{f}</button>
                 ))}
               </div>
            </div>
            <PredictionTable data={historyData} />
          </motion.div>
        </div>

        <div className="space-y-8">
          {/* Risk distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 bg-gradient-to-br from-[#1a2235]/40 to-transparent"
          >
            <h2 className="text-[#E2E8F0] font-black text-lg mb-6 tracking-tight">Risk Distribution</h2>
            <div className="space-y-8">
              {(['Low', 'Medium', 'High'] as const).map((level) => {
                const count = historyData.filter(d => d.riskLevel === level).length;
                const pct = Math.round((count / totalPredictions) * 100);
                const color = getRiskColor(level);
                return (
                  <div key={level} className="space-y-3">
                    <div className="flex justify-between text-xs font-bold items-end">
                      <span className="flex items-center gap-2" style={{ color }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                        {level} Risk
                      </span>
                      <span className="text-[#64748B] font-mono">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-[#0B0F19] rounded-full overflow-hidden border border-white/5 p-[1px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1.2, ease: "circOut", delay: 0.5 }}
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: color,
                          boxShadow: `0 0 10px ${color}40`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <div className="space-y-4">
             <h3 className="text-[#E2E8F0] font-bold text-sm uppercase tracking-widest px-1">Explanatory Context</h3>
             <ExplanationBlock 
                title="Historical Benchmarking"
                description="The audit trail allows us to compare model predictions against actual market realized volatility over time."
                whyItMatters="Essential for validating the LSTM temporal patterns and XGBoost feature weights in real-world scenarios."
             />
             <ExplanationBlock 
                title="Confidence Stability"
                description="Tracking average confidence ensures the model isn't overfitting or providing low-certainty gambles."
                whyItMatters="A stable confidence score indicates a well-generalized model that performs across different market regimes."
                icon="help"
             />
          </div>
        </div>
      </div>
    </div>
  );
}
