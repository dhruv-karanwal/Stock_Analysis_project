'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Minus, Zap, Shield, Target, Activity } from 'lucide-react';
import { PredictionResult } from '@/types';
import { getRiskColor } from '@/lib/mockData';

function AnimatedNumber({ value, decimals = 2 }: { value: number; decimals?: number }) {
  const motionVal = useMotionValue(0);
  const displayVal = useTransform(motionVal, (v) => v.toFixed(decimals));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctrl = animate(motionVal, value, { duration: 1.5, ease: 'easeOut' });
    return ctrl.stop;
  }, [value, motionVal]);

  return <motion.span ref={ref}>{displayVal}</motion.span>;
}

interface PredictionCardProps {
  result: PredictionResult;
}

export function PredictionCard({ result }: PredictionCardProps) {
  const riskColor = getRiskColor(result.riskLevel);
  const riskBg = result.riskLevel === 'Low' ? 'rgba(0  , 245, 160, 0.1)' :
                 result.riskLevel === 'Medium' ? 'rgba(245, 158, 11, 0.1)' :
                 'rgba(239, 68, 68, 0.1)';

  const cards = [
    {
      icon: Activity,
      label: 'Volatility Score',
      value: result.volatilityScore,
      display: <><AnimatedNumber value={result.volatilityScore} decimals={3} /></>,
      suffix: '',
      color: riskColor,
      description: result.volatilityScore < 0.3 ? 'Low volatility detected' : result.volatilityScore < 0.6 ? 'Moderate market movement' : 'High market turbulence',
    },
    {
      icon: Shield,
      label: 'Risk Level',
      value: result.riskLevel,
      display: result.riskLevel,
      suffix: '',
      color: riskColor,
      description: `${result.riskLevel} risk investment profile`,
    },
    {
      icon: Target,
      label: 'Confidence',
      value: result.confidence,
      display: <><AnimatedNumber value={result.confidence} decimals={1} />%</>,
      suffix: '%',
      color: '#7F5AF0',
      description: 'Model prediction confidence',
    },
    {
      icon: result.trendDirection === 'Bullish' ? TrendingUp : result.trendDirection === 'Bearish' ? TrendingDown : Minus,
      label: 'Trend Direction',
      value: result.trendDirection,
      display: result.trendDirection,
      suffix: '',
      color: result.trendDirection === 'Bullish' ? '#00F5A0' : result.trendDirection === 'Bearish' ? '#EF4444' : '#F59E0B',
      description: `Market trending ${result.trendDirection.toLowerCase()}`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-2xl border p-5 glass-card group hover:neon-glow-mint transition-all"
            style={{ borderColor: card.color + '20' }}
          >
            {/* Glow effect */}
            <div
              className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur-2xl"
              style={{ backgroundColor: card.color }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl" style={{ backgroundColor: card.color + '15' }}>
                  <card.icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <span className="text-[#64748B] text-xs font-bold uppercase tracking-widest">{card.label}</span>
              </div>

              <div
                className="text-4xl font-black metric-value mb-2 tracking-tighter"
                style={{ color: card.color }}
              >
                {card.display}
              </div>

              <p className="text-[#94A3B8] text-[11px] leading-relaxed">{card.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Interpretation Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6 border-l-4"
        style={{ borderLeftColor: riskColor }}
      >
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-white/5 mt-1">
            <Activity className="w-5 h-5 text-[#E2E8F0]" />
          </div>
          <div>
            <h4 className="text-[#E2E8F0] font-bold text-sm flex items-center gap-2">
              Interpretation Summary
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-[#94A3B8]">
                Conf: {result.confidence}%
              </span>
            </h4>
            <p className="text-[#94A3B8] text-xs mt-2 leading-relaxed">
              Based on the ensemble analysis of {result.indicators.length} indicators, the model predicts a <span className="text-[#E2E8F0] font-semibold">{result.riskLevel} Risk</span> environment. 
              {result.volatilityScore > 0.6 
                ? " Significant price swings are anticipated. Consider defensive strategies or widening stop-losses." 
                : result.volatilityScore < 0.3 
                ? " Low volatility suggests a consolidation phase. Look for breakout confirmations." 
                : " Market is exhibiting moderate movement consistent with current volume trends."}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
