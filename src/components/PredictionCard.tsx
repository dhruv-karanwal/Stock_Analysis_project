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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.12, duration: 0.5, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-xl border p-4"
          style={{ borderColor: card.color + '30', backgroundColor: card.color + '08' }}
        >
          {/* Glow top-right */}
          <div
            className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20 blur-xl"
            style={{ backgroundColor: card.color }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: card.color + '20' }}>
                <card.icon className="w-3.5 h-3.5" style={{ color: card.color }} />
              </div>
              <span className="text-[#64748B] text-xs font-medium">{card.label}</span>
            </div>

            <div
              className="text-2xl font-bold metric-value mb-1"
              style={{ color: card.color }}
            >
              {card.display}
            </div>

            <p className="text-[#64748B] text-xs">{card.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
