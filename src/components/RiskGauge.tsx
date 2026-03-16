'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface RiskGaugeProps {
  score: number; // 0 - 1
  size?: number;
}

export function RiskGauge({ score, size = 160 }: RiskGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const riskColor =
    score < 0.3 ? '#00F5A0'
    : score < 0.6 ? '#F59E0B'
    : '#EF4444';

  const riskLabel =
    score < 0.3 ? 'LOW RISK'
    : score < 0.6 ? 'MEDIUM RISK'
    : 'HIGH RISK';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.38;
    const startAngle = Math.PI * 0.75;
    const endAngle = Math.PI * 2.25;
    const totalAngle = endAngle - startAngle;

    ctx.clearRect(0, 0, size, size);

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Color gradient arc
    const gradient = ctx.createLinearGradient(0, 0, size, 0);
    gradient.addColorStop(0, '#00F5A0');
    gradient.addColorStop(0.4, '#F59E0B');
    gradient.addColorStop(1, '#EF4444');

    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, startAngle + totalAngle * score);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Needle
    const needleAngle = startAngle + totalAngle * score;
    const needleLen = radius - 8;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(
      cx + needleLen * Math.cos(needleAngle),
      cy + needleLen * Math.sin(needleAngle)
    );
    ctx.strokeStyle = riskColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = riskColor;
    ctx.fill();
  }, [score, size, riskColor]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size * 0.72 }}>
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          style={{ marginTop: -(size * 0.28) }}
        />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-center"
      >
        <div className="text-3xl font-bold metric-value" style={{ color: riskColor }}>
          {score.toFixed(3)}
        </div>
        <div
          className="text-xs font-bold tracking-widest mt-1"
          style={{ color: riskColor }}
        >
          {riskLabel}
        </div>
        <div className="flex gap-3 mt-2 text-xs text-[#64748B]">
          <span>0.0 Low</span>
          <span>0.3</span>
          <span>0.6</span>
          <span>High 1.0</span>
        </div>
      </motion.div>
    </div>
  );
}
