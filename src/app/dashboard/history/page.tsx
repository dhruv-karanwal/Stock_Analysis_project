'use client';

import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import { PredictionTable } from '@/components/PredictionTable';
import { getPredictionHistory } from '@/lib/mockData';
import { getRiskColor } from '@/lib/mockData';

const historyData = getPredictionHistory();
const totalPredictions = historyData.length;
const avgVolatility = historyData.reduce((a, b) => a + b.predictedVolatility, 0) / totalPredictions;
const avgConfidence = historyData.reduce((a, b) => a + b.confidence, 0) / totalPredictions;
const highRiskCount = historyData.filter(d => d.riskLevel === 'High').length;

export default function HistoryPage() {
  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold font-display text-[#E2E8F0] flex items-center gap-2">
          <History className="w-5 h-5 text-[#7F5AF0]" />
          Prediction History
        </h1>
        <p className="text-[#64748B] text-sm mt-1">Past predictions and accuracy tracking</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Predictions', value: totalPredictions, color: '#00F5A0', suffix: '' },
          { label: 'Avg Volatility', value: avgVolatility.toFixed(3), color: '#7F5AF0', suffix: '' },
          { label: 'Avg Confidence', value: `${avgConfidence.toFixed(1)}%`, color: '#00C9FF', suffix: '' },
          { label: 'High Risk Alerts', value: highRiskCount, color: '#EF4444', suffix: '' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-4"
          >
            <div className="text-[#64748B] text-xs mb-1">{s.label}</div>
            <div className="text-2xl font-bold metric-value" style={{ color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Risk distribution */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-5"
      >
        <h2 className="text-[#E2E8F0] font-semibold text-sm mb-4">Risk Level Distribution</h2>
        <div className="flex gap-4 items-center">
          {(['Low', 'Medium', 'High'] as const).map((level) => {
            const count = historyData.filter(d => d.riskLevel === level).length;
            const pct = Math.round((count / totalPredictions) * 100);
            const color = getRiskColor(level);
            return (
              <div key={level} className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color }}>{level}</span>
                  <span className="text-[#64748B]">{count} ({pct}%)</span>
                </div>
                <div className="h-2 bg-[#0B0F19] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-5"
      >
        <h2 className="text-[#E2E8F0] font-semibold text-sm mb-4">All Predictions</h2>
        <PredictionTable data={historyData} />
      </motion.div>
    </div>
  );
}
