'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Zap, BarChart3, Brain, Shield, TrendingUp,
  Activity, Target, ChevronRight, Star,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Generate demo chart data
const DEMO_CHART = Array.from({ length: 60 }, (_, i) => ({
  i,
  price: 150 + Math.sin(i / 5) * 20 + i * 0.8 + (Math.random() - 0.5) * 8,
  volatility: 0.1 + Math.abs(Math.sin(i / 3)) * 0.5 + (Math.random() - 0.5) * 0.15,
}));

const FEATURES = [
  {
    icon: Brain,
    title: 'ML Volatility Prediction',
    description: 'XGBoost + LSTM ensemble trained on 5 years of market data. Predicts volatility with 87%+ accuracy.',
    color: '#00F5A0',
    detail: 'Accuracy: 87.4%',
  },
  {
    icon: BarChart3,
    title: 'Technical Indicator Analysis',
    description: 'RSI, MACD, Bollinger Bands, ATR, Stochastic — all computed and interpreted in real time.',
    color: '#7F5AF0',
    detail: '6 Indicators',
  },
  {
    icon: Shield,
    title: 'Risk Assessment',
    description: 'Visual risk gauge from 0–1. Color-coded Low / Medium / High with animated confidence score.',
    color: '#00C9FF',
    detail: '3 Risk Levels',
  },
  {
    icon: Activity,
    title: 'Interactive Charts',
    description: 'Zoomable price and volatility charts with brush selection, hover tooltips, and smooth animations.',
    color: '#F59E0B',
    detail: 'Zoom + Pan',
  },
];

const STATS = [
  { value: '87.4%', label: 'Prediction Accuracy' },
  { value: '6', label: 'Technical Indicators' },
  { value: '<2s', label: 'Prediction Speed' },
  { value: '14+', label: 'Stocks Supported' },
];

const TESTIMONIALS = [
  { name: 'Arjun Mehta', role: 'Quantitative Analyst', text: 'The volatility prediction accuracy is impressive. The risk gauge is exactly what I needed for position sizing.' },
  { name: 'Priya Sharma', role: 'ML Researcher', text: 'Feature importance charts give me real insights into what the model is learning. Best ML dashboard I\'ve seen.' },
  { name: 'David Chen', role: 'Day Trader', text: 'The MACD + RSI combo integration makes my trading decisions so much faster. The UI is gorgeous.' },
];

function FloatingOrb({ x, y, color, size }: { x: string; y: string; color: string; size: number }) {
  return (
    <motion.div
      animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{
        left: x, top: y,
        width: 'min(90vw, var(--orb-size))',
        height: 'min(90vw, var(--orb-size))',
        backgroundColor: color,
        '--orb-size': `${size}px`,
      } as any}
    />
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen bg-[#0B0F19] overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00F5A0] to-[#00C9FF] flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold gradient-text-primary font-display">VolatilityAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#64748B]">
            {['Features', 'How It Works', 'Model', 'Demo'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} className="hover:text-[#E2E8F0] transition-colors">{l}</a>
            ))}
          </div>
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F5A0] to-[#00C9FF] text-black text-sm font-bold flex items-center gap-2"
            >
              Open Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-grid">
        {/* Floating orbs */}
        <FloatingOrb x="10%" y="20%" color="#00F5A0" size={400} />
        <FloatingOrb x="70%" y="10%" color="#7F5AF0" size={350} />
        <FloatingOrb x="50%" y="60%" color="#00C9FF" size={250} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00F5A0]/30 bg-[#00F5A0]/10 text-[#00F5A0] text-sm font-medium mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#00F5A0] animate-pulse" />
            Powered by XGBoost + LSTM Ensemble
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black font-display leading-tight mb-6"
          >
            <span className="text-[#E2E8F0]">Predict Stock</span>
            <br />
            <span className="gradient-text-primary text-glow-primary">Volatility</span>
            <br />
            <span className="text-[#E2E8F0]">with ML Precision</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Professional-grade stock volatility prediction using Machine Learning and Technical Indicators.
            {' '}<strong className="text-[#E2E8F0]">Know the risk before you trade.</strong>
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 245, 160, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00F5A0] to-[#00C9FF] text-black font-bold text-base flex items-center gap-2 shadow-lg"
              >
                <Zap className="w-4 h-4" />
                Start Analysis
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-2xl border border-white/10 text-[#E2E8F0] font-medium text-base flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-[#7F5AF0]" />
              View Demo
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="glass rounded-2xl p-4 text-center border border-white/5"
              >
                <div className="text-2xl font-black gradient-text-primary metric-value">{s.value}</div>
                <div className="text-[#64748B] text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Demo chart */}
      <section id="demo" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-card p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[#E2E8F0] font-bold">TSLA — Live Volatility Preview</h3>
                <p className="text-[#64748B] text-xs">Real-time prediction simulation</p>
              </div>
              <div className="flex gap-2">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00F5A0]/15 border border-[#00F5A0]/30"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00F5A0]" />
                  <span className="text-[#00F5A0] text-xs font-medium">Live</span>
                </motion.div>
                <div className="px-2.5 py-1 rounded-full bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] text-xs">
                  High Risk · 0.78
                </div>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DEMO_CHART}>
                  <defs>
                    <linearGradient id="demoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00F5A0" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#00F5A0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="i" hide />
                  <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v.toFixed(0)}`} width={45} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', fontSize: 12 }}
                    labelStyle={{ color: '#94A3B8' }}
                  />
                  <Area type="monotone" dataKey="price" stroke="#00F5A0" strokeWidth={2} fill="url(#demoGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-black font-display text-[#E2E8F0] mb-4">
              Everything You Need to{' '}
              <span className="gradient-text-primary">Beat Volatility</span>
            </h2>
            <p className="text-[#64748B] text-lg max-w-xl mx-auto">
              A complete toolkit for retail and professional traders to predict and manage market risk.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6 gradient-border group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: f.color + '15' }}
                  >
                    <f.icon className="w-6 h-6" style={{ color: f.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[#E2E8F0] font-bold text-base">{f.title}</h3>
                      <span
                        className="text-xs font-mono px-2 py-0.5 rounded-full font-bold"
                        style={{ color: f.color, backgroundColor: f.color + '15' }}
                      >
                        {f.detail}
                      </span>
                    </div>
                    <p className="text-[#64748B] text-sm leading-relaxed">{f.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 bg-[#0d1117]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-black font-display text-[#E2E8F0] mb-4">4 Steps to Volatility Clarity</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Search Stock', desc: 'Type any symbol — AAPL, TSLA, RELIANCE', icon: Target, color: '#00F5A0' },
              { step: '02', title: 'Pick Indicators', desc: 'Select RSI, MACD, Bollinger Bands, ATR and more', icon: Zap, color: '#7F5AF0' },
              { step: '03', title: 'Run Prediction', desc: 'ML model processes all indicators in <2 seconds', icon: Brain, color: '#00C9FF' },
              { step: '04', title: 'View Results', desc: 'Volatility score, risk level, trend, and confidence', icon: Shield, color: '#F59E0B' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-5 text-center relative"
              >
                <div
                  className="w-10 h-10 rounded-2xl mx-auto mb-4 flex items-center justify-center font-black text-sm"
                  style={{ backgroundColor: s.color + '20', color: s.color }}
                >
                  {s.step}
                </div>
                <h3 className="text-[#E2E8F0] font-bold mb-2">{s.title}</h3>
                <p className="text-[#64748B] text-xs leading-relaxed">{s.desc}</p>
                {i < 3 && (
                  <ChevronRight className="absolute -right-2 top-1/2 -translate-y-1/2 text-[#475569] w-4 h-4 hidden md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black font-display text-[#E2E8F0] mb-2">What Traders Say</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array(5).fill(0).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-[#94A3B8] text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7F5AF0] to-[#C471F5] flex items-center justify-center text-xs font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-[#E2E8F0] text-sm font-semibold">{t.name}</div>
                    <div className="text-[#64748B] text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-12 border border-[#00F5A0]/15 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00F5A0]/5 to-[#7F5AF0]/5 pointer-events-none" />
            <div className="relative z-10">
              <Zap className="w-12 h-12 text-[#00F5A0] mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-black font-display text-[#E2E8F0] mb-4">
                Ready to Predict <span className="gradient-text-primary">Volatility?</span>
              </h2>
              <p className="text-[#64748B] mb-8">
                Open the dashboard and run your first prediction in under 30 seconds.
              </p>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0, 245, 160, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#00F5A0] to-[#00C9FF] text-black font-black text-lg flex items-center gap-2 mx-auto"
                >
                  <Zap className="w-5 h-5" />
                  Launch Dashboard
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00F5A0] to-[#00C9FF] flex items-center justify-center">
              <Zap className="w-3 h-3 text-black" />
            </div>
            <span className="text-sm font-bold gradient-text-primary">VolatilityAI</span>
          </div>
          <p className="text-[#475569] text-xs">
            Stock Market Volatility Prediction using Machine Learning & Technical Indicators
          </p>
          <p className="text-[#475569] text-xs">© 2026 VolatilityAI Project</p>
        </div>
      </footer>
    </div>
  );
}
