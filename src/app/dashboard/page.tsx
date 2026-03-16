'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Loader2, AlertCircle, RefreshCw, Clock,
  TrendingUp, BarChart3, Sliders, ChevronDown,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { StockSearchBar } from '@/components/StockSearchBar';
import { IndicatorSelector } from '@/components/IndicatorSelector';
import { PredictionCard } from '@/components/PredictionCard';
import { IndicatorCard } from '@/components/IndicatorCard';
import { RiskGauge } from '@/components/RiskGauge';
import { VolatilityChart } from '@/components/VolatilityChart';
import { generateStockData, generateIndicators, simulatePrediction } from '@/lib/mockData';
import { Stock, TimeFrame } from '@/types';

const TIMEFRAMES: TimeFrame[] = ['1D', '1W', '1M', '3M', '6M', '1Y'];
const TF_DAYS: Record<TimeFrame, number> = { '1D': 1, '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365 };

const LOADING_STEPS = [
  'Loading stock data...',
  'Computing indicators...',
  'Running ML model...',
  'Calculating confidence...',
  'Generating report...',
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

// ─────────────────────────────────────────────────────────────────────────────

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
      setProgress(Math.round(((step + 1) / LOADING_STEPS.length) * 100));
      await new Promise(r => setTimeout(r, 450));
    }
    try {
      const result = await simulatePrediction(selectedStock.symbol, selectedIndicators, 800);
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
      <div className="w-80 xl:w-96 flex-shrink-0 flex flex-col border-r border-white/5 bg-[#0d1117] overflow-y-auto no-scrollbar">

        {/* Panel title */}
        <div className="px-5 py-4 border-b border-white/5 flex-shrink-0">
          <h2 className="text-[#E2E8F0] font-bold text-base font-display">Analysis Controls</h2>
          <p className="text-[#64748B] text-xs mt-0.5">Click any section to expand or collapse</p>
        </div>

        {/* 1 — Stock Selection */}
        <CollapsibleSection
          title="Stock Selection"
          icon={TrendingUp}
          iconColor="#00F5A0"
          badge={selectedStock ? `Selected: ${selectedStock.symbol} — ${selectedStock.name}` : 'Search a symbol to begin'}
        >
          <StockSearchBar onSelect={handleStockSelect} selectedStock={selectedStock} />
        </CollapsibleSection>

        {/* 2 — Time Frame */}
        <CollapsibleSection
          title="Time Frame"
          icon={Clock}
          iconColor="#7F5AF0"
          badge={`Active window: ${timeFrame}`}
        >
          <div className="grid grid-cols-3 gap-2">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFrame(tf)}
                className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                  timeFrame === tf
                    ? 'bg-[#7F5AF0] text-white shadow-lg'
                    : 'bg-[#111827] text-[#64748B] hover:text-[#94A3B8] hover:bg-[#1a2235] border border-white/5'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </CollapsibleSection>

        {/* 3 — Indicators */}
        <CollapsibleSection
          title="Indicators"
          icon={Sliders}
          iconColor="#00C9FF"
          badge={`${selectedIndicators.length} of 6 selected`}
        >
          <IndicatorSelector selected={selectedIndicators} onToggle={toggleIndicator} />
        </CollapsibleSection>

        {/* ── Spacer so button stays at bottom ─── */}
        <div className="flex-1" />

        {/* Run Prediction */}
        <div className="p-5 border-t border-white/5 space-y-3 flex-shrink-0">
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

          {!selectedStock && (
            <p className="text-center text-[#475569] text-xs">Select a stock to begin</p>
          )}
          {selectedIndicators.length === 0 && selectedStock && (
            <p className="text-center text-[#475569] text-xs">Select at least one indicator</p>
          )}

          <motion.button
            whileHover={canPredict ? { scale: 1.02 } : {}}
            whileTap={canPredict ? { scale: 0.98 } : {}}
            onClick={handleRunPrediction}
            disabled={!canPredict}
            className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              canPredict
                ? 'bg-gradient-to-r from-[#00F5A0] to-[#00C9FF] text-black shadow-lg hover:shadow-[0_0_24px_rgba(0,245,160,0.4)]'
                : 'bg-[#1a2235] text-[#475569] cursor-not-allowed'
            }`}
          >
            {isPredicting
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Predicting...</>
              : <><Play className="w-4 h-4 fill-current" /> Run Prediction</>
            }
          </motion.button>

          <AnimatePresence>
            {isPredicting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-xs text-[#64748B]">
                  <span>{LOADING_STEPS[loadingStep]}</span>
                  <span className="font-mono text-[#00F5A0]">{progress}%</span>
                </div>
                <div className="h-1.5 bg-[#1a2235] rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#00F5A0] to-[#7F5AF0]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Right analysis panel ────────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">

        {/* Empty state */}
        {!selectedStock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col items-center justify-center gap-6 text-center"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#00F5A0]/20 to-[#7F5AF0]/20 flex items-center justify-center border border-white/10">
                <BarChart3 className="w-12 h-12 text-[#00F5A0]" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#7F5AF0] animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#E2E8F0] font-display">Start Your Analysis</h2>
              <p className="text-[#64748B] text-sm mt-2 max-w-xs">
                Search for a stock symbol on the left, select technical indicators, and run the ML prediction.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {['AAPL', 'TSLA', 'NVDA', 'RELIANCE', 'TCS'].map((sym) => (
                <motion.button
                  key={sym}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const { STOCK_DATABASE } = require('@/lib/mockData');
                    const stock = STOCK_DATABASE.find((s: Stock) => s.symbol === sym);
                    if (stock) handleStockSelect(stock);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#1a2235] text-[#00F5A0] text-xs font-mono font-bold border border-[#00F5A0]/20 hover:border-[#00F5A0]/50 transition-all"
                >
                  {sym}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main analysis content */}
        {selectedStock && (
          <>
            {/* Stock header */}
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold font-display text-[#E2E8F0]">{selectedStock.symbol}</h1>
                  <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${selectedStock.change >= 0 ? 'bg-[#00F5A0]/15 text-[#00F5A0]' : 'bg-[#EF4444]/15 text-[#EF4444]'}`}>
                    {selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
                  </div>
                </div>
                <p className="text-[#64748B] text-sm mt-0.5">{selectedStock.name} · {selectedStock.sector}</p>
              </div>
              <div className="flex gap-4 text-xs">
                <div>
                  <div className="text-[#64748B]">Price</div>
                  <div className="text-[#E2E8F0] font-bold font-mono text-lg">${selectedStock.price.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[#64748B]">Volume</div>
                  <div className="text-[#E2E8F0] font-bold font-mono">{(selectedStock.volume / 1e6).toFixed(1)}M</div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <VolatilityChart data={stockData} symbol={selectedStock.symbol} />

            {/* Prediction results */}
            <AnimatePresence>
              {predictionResult && predictionResult.stockSymbol === selectedStock.symbol && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00F5A0] animate-pulse" />
                    Prediction Results
                  </h3>
                  <div className="flex flex-wrap xl:flex-nowrap gap-4">
                    <div className="flex-1 min-w-0">
                      <PredictionCard result={predictionResult} />
                    </div>
                    <div className="glass-card p-4 flex flex-col items-center justify-center min-w-48">
                      <div className="text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-3">Risk Gauge</div>
                      <RiskGauge score={predictionResult.volatilityScore} size={160} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active indicators */}
            {selectedIndicatorData.length > 0 && (
              <div>
                <h3 className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#7F5AF0]" />
                  Technical Indicators
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {selectedIndicatorData.map((ind, i) => (
                    <IndicatorCard key={ind.id} indicator={ind} index={i} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
