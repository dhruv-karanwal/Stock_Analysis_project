'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Loader2, AlertCircle, RefreshCw, Clock,
  TrendingUp, BarChart3, Sliders, ChevronDown,
  Cpu, Activity, Zap,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { StockSearchBar } from '@/components/StockSearchBar';
import { IndicatorSelector } from '@/components/IndicatorSelector';
import { PredictionCard } from '@/components/PredictionCard';
import { IndicatorCard } from '@/components/IndicatorCard';
import { RiskGauge } from '@/components/RiskGauge';
import { VolatilityChart } from '@/components/VolatilityChart';
import { generateStockData, generateIndicators, simulatePrediction, getRiskColor } from '@/lib/mockData';
import { Stock, TimeFrame } from '@/types';

import { MLPipeline } from '@/components/ml/MLPipeline';
import { ExplanationBlock } from '@/components/layout/ExplanationBlock';

const TIMEFRAMES: TimeFrame[] = ['1D', '1W', '1M', '3M', '6M', '1Y'];
const TF_DAYS: Record<TimeFrame, number> = { '1D': 1, '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365 };

const LOADING_STEPS = [
  'Fetching real-time stock data...',
  'Normalizing OHLCV tensors...',
  'Calculating technical indicators (RSI, MACD, BB)...',
  'Executing XGBoost + LSTM ensemble model...',
  'Optimizing volatility confidence scores...',
  'Finalizing prediction report...',
];

// ── Collapsible accordion section ─────────────────────────────────────────────
function CollapsibleSection({
  title,
  icon: Icon,
  iconColor,
  badge,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/5">
      {/* Clickable header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors group text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg flex-shrink-0 transition-all group-hover:scale-105"
            style={{ backgroundColor: iconColor + '18' }}
          >
            <Icon className="w-4 h-4" style={{ color: iconColor }} />
          </div>
          <div>
            <div className="text-[#E2E8F0] text-sm font-semibold">{title}</div>
            {badge && (
              <div className="text-[11px] mt-0.5" style={{ color: iconColor + 'aa' }}>
                {badge}
              </div>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-[#475569] group-hover:text-[#94A3B8] transition-colors" />
        </motion.div>
      </button>

      {/* Animated body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


export default function DashboardPage() {
  const {
    selectedStock, setSelectedStock,
    selectedIndicators, toggleIndicator,
    timeFrame, setTimeFrame,
    predictionResult, setPredictionResult,
    isPredicting, setIsPredicting,
    error, setError,
  } = useAppStore();

  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const stockData = selectedStock
    ? generateStockData(selectedStock.symbol, TF_DAYS[timeFrame])
    : [];

  const indicators = selectedStock ? generateIndicators(selectedStock.symbol) : [];
  const selectedIndicatorData = indicators.filter(ind => selectedIndicators.includes(ind.id));

  const handleStockSelect = useCallback((stock: Stock) => {
    setSelectedStock(stock);
    setProgress(0);
    setLoadingStep(0);
  }, [setSelectedStock]);

  const handleRunPrediction = async () => {
    if (!selectedStock || selectedIndicators.length === 0) return;
    setIsPredicting(true);
    setError(null);
    setProgress(0);
    for (let step = 0; step < LOADING_STEPS.length; step++) {
      setLoadingStep(step);
      const targetProgress = Math.round(((step + 1) / LOADING_STEPS.length) * 100);
      // Smooth progress animation
      for (let p = progress; p <= targetProgress; p++) {
        setProgress(p);
        await new Promise(r => setTimeout(r, 10));
      }
      await new Promise(r => setTimeout(r, 400));
    }
    try {
      const result = await simulatePrediction(selectedStock.symbol, selectedIndicators, 500);
      setPredictionResult(result);
    } catch {
      setError('Prediction service unavailable. Please try again.');
    } finally {
      setIsPredicting(false);
      setProgress(100);
    }
  };

  const canPredict = selectedStock && selectedIndicators.length > 0 && !isPredicting;

  return (
    <div className="flex h-full">

      {/* ── Left control panel ─────────────────────────────── */}
      <div className="w-80 xl:w-96 flex-shrink-0 flex flex-col border-r border-white/5 bg-[#0D1117] overflow-y-auto no-scrollbar">

        {/* Panel title */}
        <div className="px-5 py-6 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-4 h-4 text-[#00F5A0]" />
            <h2 className="text-[#E2E8F0] font-bold text-base font-display">Analysis Engine</h2>
          </div>
          <p className="text-[#64748B] text-[11px] leading-relaxed"> Configure your input parameters for the ML model</p>
        </div>

        {/* 1 — Stock Selection */}
        <CollapsibleSection
          title="Stock Selection"
          icon={TrendingUp}
          iconColor="#00F5A0"
          badge={selectedStock ? `${selectedStock.symbol}` : 'Step 1: Select Stock'}
        >
          <div className="space-y-3">
            <p className="text-[#64748B] text-[10px] leading-relaxed px-1">
              Select the primary equity for volatility analysis.
            </p>
            <StockSearchBar onSelect={handleStockSelect} selectedStock={selectedStock} />
          </div>
        </CollapsibleSection>

        {/* 2 — Time Frame */}
        <CollapsibleSection
          title="Lookback Window"
          icon={Clock}
          iconColor="#7F5AF0"
          badge={timeFrame}
        >
          <div className="space-y-4">
             <p className="text-[#64748B] text-[10px] leading-relaxed px-1">
              Defines the historical depth used for feature extraction and pattern recognition.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeFrame(tf)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    timeFrame === tf
                      ? 'bg-[#7F5AF0] text-white shadow-lg shadow-[#7F5AF0]/20'
                      : 'bg-[#111827] text-[#64748B] hover:text-[#94A3B8] hover:bg-[#1a2235] border border-white/5'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </CollapsibleSection>

        {/* 3 — Indicators */}
        <CollapsibleSection
          title="Technical Indicators"
          icon={Zap}
          iconColor="#00C9FF"
          badge={`${selectedIndicators.length} Selected`}
        >
           <div className="space-y-4">
            <p className="text-[#64748B] text-[10px] leading-relaxed px-1">
              Select technical overlays to be fed into the XGBoost feature vector.
            </p>
            <IndicatorSelector selected={selectedIndicators} onToggle={toggleIndicator} />
          </div>
        </CollapsibleSection>

        {/* ── Spacer so button stays at bottom ─── */}
        <div className="flex-1" />

        {/* Run Prediction */}
        <div className="p-5 border-t border-white/5 space-y-4 flex-shrink-0 bg-[#0B0F19]/50 backdrop-blur-md sticky bottom-0">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20"
            >
              <AlertCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#EF4444] text-xs font-medium">{error}</p>
                <button onClick={handleRunPrediction} className="text-[#EF4444] text-xs underline mt-1 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Retry
                </button>
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={canPredict ? { scale: 1.02 } : {}}
            whileTap={canPredict ? { scale: 0.98 } : {}}
            onClick={handleRunPrediction}
            disabled={!canPredict}
            className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all ${
              canPredict
                ? 'bg-gradient-to-r from-[#00F5A0] to-[#00C9FF] text-black shadow-xl hover:shadow-[0_0_30px_rgba(0,245,160,0.4)]'
                : 'bg-[#1a2235] text-[#475569] cursor-not-allowed border border-white/5'
            }`}
          >
            {isPredicting
              ? <><Loader2 className="w-4 h-4 animate-spin" /> RUNNING ML MODEL...</>
              : <><Play className="w-4 h-4 fill-current" /> GENERATE PREDICTION</>
            }
          </motion.button>

          <AnimatePresence>
            {isPredicting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider animate-pulse">
                    {LOADING_STEPS[loadingStep]}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[#00F5A0]">{progress}%</span>
                </div>
                <div className="h-1.5 bg-[#111827] rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#00F5A0] via-[#00C9FF] to-[#7F5AF0]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Right analysis panel ────────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10 bg-[#0B0F19] bg-grid">

        {/* Empty state */}
        {!selectedStock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col items-center justify-center gap-8 text-center max-w-2xl mx-auto"
          >
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#00F5A0]/10 via-transparent to-[#7F5AF0]/10 flex items-center justify-center border border-white/5 backdrop-blur-3xl animate-float">
                <BarChart3 className="w-16 h-16 text-[#00F5A0] opacity-40" />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-[#7F5AF0]/20 blur-xl animate-pulse" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-[#E2E8F0] font-display tracking-tight">
                Model Ready for <span className="gradient-text-primary">Input</span>
              </h2>
              <p className="text-[#64748B] text-base leading-relaxed">
                Select a ticker symbol from the left to initialize the analysis pipeline. Our model will process historical data, compute indicators, and generate a volatility risk profile.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {['AAPL', 'TSLA', 'NVDA', 'RELIANCE', 'TCS'].map((sym) => (
                <motion.button
                  key={sym}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const { STOCK_DATABASE } = require('@/lib/mockData');
                    const stock = STOCK_DATABASE.find((s: Stock) => s.symbol === sym);
                    if (stock) handleStockSelect(stock);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#1a2235] text-[#00F5A0] text-xs font-mono font-black border border-[#00F5A0]/20 hover:bg-[#00F5A0]/10 transition-all shadow-lg"
                >
                  {sym}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main analysis content */}
        {selectedStock && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* 1. Header & Quick Info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
              <div className="space-y-1">
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-black font-display text-[#E2E8F0] tracking-tighter">{selectedStock.symbol}</h1>
                  <div className={`px-3 py-1 rounded-lg text-xs font-black ${selectedStock.change >= 0 ? 'bg-[#00F5A0]/10 text-[#00F5A0]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                    {selectedStock.change >= 0 ? '▲' : '▼'} {selectedStock.changePercent.toFixed(2)}%
                  </div>
                </div>
                <p className="text-[#94A3B8] font-medium">{selectedStock.name} · <span className="text-[#64748B]">{selectedStock.sector}</span></p>
              </div>
              
              <div className="flex items-center gap-8 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="text-right">
                  <div className="text-[#64748B] text-[10px] font-bold uppercase tracking-widest mb-1">Last Price</div>
                  <div className="text-[#E2E8F0] font-black font-mono text-2xl tracking-tighter">${selectedStock.price.toFixed(2)}</div>
                </div>
                <div className="w-[1px] h-10 bg-white/5" />
                <div className="text-right">
                  <div className="text-[#64748B] text-[10px] font-bold uppercase tracking-widest mb-1">24h Volume</div>
                  <div className="text-[#E2E8F0] font-black font-mono text-2xl tracking-tighter">{(selectedStock.volume / 1e6).toFixed(1)}M</div>
                </div>
              </div>
            </div>

            {/* 2. Visual Pipeline Section */}
            <section className="space-y-4">
               <div className="flex items-center justify-between">
                <h3 className="text-[#E2E8F0] font-bold text-sm flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#7F5AF0]" />
                  ML Processing Pipeline
                </h3>
                <span className="text-[10px] font-bold text-[#64748B] bg-white/5 px-2 py-1 rounded-md border border-white/5 uppercase tracking-wider">
                  Real-time Data Flow
                </span>
              </div>
              <div className="glass-card rounded-3xl p-6 bg-gradient-to-br from-[#1a2235]/40 to-transparent">
                 <MLPipeline />
              </div>
            </section>

            {/* 3. Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                 <div className="flex items-center justify-between px-1">
                  <h3 className="text-[#E2E8F0] font-bold text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#00F5A0]" />
                    Historical Price Analysis
                  </h3>
                </div>
                <div className="glass-card rounded-3xl p-6 h-[400px]">
                  <VolatilityChart data={stockData} symbol={selectedStock.symbol} />
                </div>
              </div>
              
              <div className="space-y-4">
                 <h3 className="text-[#E2E8F0] font-bold text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#F59E0B]" />
                    Academic Context
                  </h3>
                  <div className="space-y-4">
                    <ExplanationBlock 
                      title="Market Volatility"
                      description="Represents the degree of variation in stock prices over time. Higher volatility implies higher risk and potential for significant swings."
                      whyItMatters="Essential for risk management, option pricing, and determining position sizes in professional trading."
                    />
                    <ExplanationBlock 
                      title="XGBoost + LSTM Ensemble"
                      description="A hybrid model combining Gradient Boosting for feature importance and Long Short-Term Memory networks for temporal dependencies."
                      whyItMatters="Captures both static technical patterns and dynamic time-series trends that a single model might miss."
                      icon="help"
                    />
                  </div>
              </div>
            </div>

            {/* 4. Prediction Output Section */}
            <AnimatePresence>
              {predictionResult && predictionResult.stockSymbol === selectedStock.symbol && (
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 pt-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-[#E2E8F0] font-black text-xl font-display flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#00F5A0] neon-glow-mint" />
                      Prediction Output
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#64748B]">
                      MODEL VERSION: <span className="text-[#00F5A0]">V2.4.0-PROD</span>
                    </div>
                  </div>

                  <div className="flex flex-col xl:flex-row gap-6">
                    <div className="flex-1">
                      <PredictionCard result={predictionResult} />
                    </div>
                    <div className="glass-card p-8 flex flex-col items-center justify-center min-w-[320px] bg-gradient-to-br from-[#1a2235]/40 to-transparent group hover:neon-glow-purple transition-all">
                      <div className="text-[#64748B] text-[10px] font-black uppercase tracking-[0.2em] mb-6">Risk Classification Gauge</div>
                      <RiskGauge score={predictionResult.volatilityScore} size={200} />
                      <div className="mt-6 text-center space-y-1">
                         <div className="text-[#E2E8F0] font-black text-xl uppercase tracking-tighter" style={{ color: getRiskColor(predictionResult.riskLevel) }}>
                           {predictionResult.riskLevel} VOLATILITY
                         </div>
                         <p className="text-[#64748B] text-[10px] font-medium max-w-[200px]">
                           Risk level determined by ensemble confidence and volatility score.
                         </p>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* 5. Indicators Breakdown Section */}
            {selectedIndicatorData.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                   <h3 className="text-[#E2E8F0] font-bold text-sm flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#00C9FF]" />
                    Feature Breakdown (Technical Inputs)
                  </h3>
                  <p className="text-[#64748B] text-[10px] font-medium">Selected features being analyzed by the ML model</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {selectedIndicatorData.map((ind, i) => (
                    <IndicatorCard key={ind.id} indicator={ind} index={i} />
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
