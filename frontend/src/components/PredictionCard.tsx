'use client';

import { AlertCircle } from 'lucide-react';

interface PredictionCardProps {
  prediction: string;
  confidence: number;
}

export function PredictionCard({ prediction, confidence }: PredictionCardProps) {
  const riskColor = prediction === 'High' ? 'text-red-400' : prediction === 'Medium' ? 'text-yellow-400' : 'text-green-400';
  const riskBg = prediction === 'High' ? 'bg-red-500/10' : prediction === 'Medium' ? 'bg-yellow-500/10' : 'bg-green-500/10';

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
          Volatility Prediction
        </h3>
        <AlertCircle className="w-5 h-5 text-teal-400" />
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-slate-400 mb-2">Prediction</p>
          <p className={`text-4xl font-bold ${riskColor}`}>{prediction}</p>
        </div>

        <div className={`${riskBg} border border-current border-opacity-30 rounded-lg p-4`}>
          <p className="text-xs text-slate-400 mb-1">Risk Level</p>
          <p className={`font-semibold ${riskColor}`}>{prediction}</p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-slate-400">Confidence</p>
            <p className="text-sm font-semibold text-teal-400">{Math.min(100, Math.max(0, confidence)).toFixed(1)}%</p>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
