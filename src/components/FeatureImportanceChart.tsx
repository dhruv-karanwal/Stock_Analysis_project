'use client';

import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Cell,
} from 'recharts';
import { FeatureImportance } from '@/types';

interface FeatureImportanceChartProps {
  data: FeatureImportance[];
  type?: 'bar' | 'radar';
}

const CustomBarTooltip = ({ active, payload }: any) => {
  if (active && payload?.[0]) {
    return (
      <div className="glass rounded-xl px-3 py-2 text-xs shadow-2xl">
        <p className="text-[#E2E8F0] font-bold">{payload[0].payload.feature}</p>
        <p className="text-[#00F5A0] font-mono">Importance: {(payload[0].value * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

export function FeatureImportanceChart({ data, type = 'bar' }: FeatureImportanceChartProps) {
  if (type === 'radar') {
    const radarData = data.map(d => ({ subject: d.feature.split(' ')[0], value: +(d.importance * 100).toFixed(1) }));
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.07)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} />
            <PolarRadiusAxis tick={false} axisLine={false} />
            <Radar
              name="Importance"
              dataKey="value"
              stroke="#7F5AF0"
              fill="#7F5AF0"
              fillOpacity={0.25}
              strokeWidth={2}
              dot={{ fill: '#7F5AF0', r: 4 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
          <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.04)" />
          <XAxis
            type="number"
            domain={[0, 1]}
            tick={{ fill: '#64748B', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          />
          <YAxis
            dataKey="feature"
            type="category"
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={100}
          />
          <Tooltip content={<CustomBarTooltip />} />
          <Bar dataKey="importance" radius={[0, 6, 6, 0]} animationDuration={1000} animationEasing="ease-out">
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color || '#00F5A0'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
