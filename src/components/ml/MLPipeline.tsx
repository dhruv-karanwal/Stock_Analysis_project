'use client';

import { motion } from 'framer-motion';
import { Database, Zap, Cpu, BarChart3, Target, ArrowRight } from 'lucide-react';

const STEPS = [
  { id: 'data', label: 'Raw Stock Data', icon: Database, color: '#94A3B8' },
  { id: 'indicators', label: 'Technical Indicators', icon: Zap, color: '#7F5AF0' },
  { id: 'features', label: 'Feature Vector', icon: BarChart3, color: '#00C9FF' },
  { id: 'model', label: 'ML Model (XGBoost+LSTM)', icon: Cpu, color: '#00F5A0' },
  { id: 'output', label: 'Prediction Output', icon: Target, color: '#F59E0B' },
];

export function MLPipeline() {
  return (
    <div className="w-full py-8 overflow-x-auto no-scrollbar">
      <div className="flex items-center justify-between min-w-[800px] px-4">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center gap-3 relative group"
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 glass-card"
                style={{ 
                  borderColor: step.color + '40',
                  boxShadow: `0 0 20px ${step.color}10`
                }}
              >
                <step.icon className="w-6 h-6" style={{ color: step.color }} />
              </div>
              <div className="text-center">
                <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-tighter mb-1">Step {i + 1}</div>
                <div className="text-[#E2E8F0] text-xs font-bold whitespace-nowrap">{step.label}</div>
              </div>
              
              {/* Tooltip-like explanation */}
              <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl bg-[#111827] border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-2xl">
                <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                  {i === 0 && "Fetching real-time OHLCV data from market providers."}
                  {i === 1 && "Computing RSI, MACD, Bollinger Bands, and ATR values."}
                  {i === 2 && "Normalizing indicators into a multi-dimensional tensor."}
                  {i === 3 && "Ensemble model analyzes temporal patterns and volatility spikes."}
                  {i === 4 && "Generating risk score, confidence, and trend classification."}
                </p>
              </div>
            </motion.div>

            {i < STEPS.length - 1 && (
              <div className="flex-1 flex flex-col items-center justify-center px-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: i * 0.15 + 0.3, duration: 0.8 }}
                  className="h-[2px] bg-gradient-to-r relative"
                  style={{ 
                    backgroundImage: `linear-gradient(to right, ${step.color}, ${STEPS[i+1].color})` 
                  }}
                >
                  <motion.div 
                    animate={{ x: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full blur-[2px]"
                    style={{ backgroundColor: step.color }}
                  />
                </motion.div>
                <ArrowRight className="w-3 h-3 text-[#475569] mt-1" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
