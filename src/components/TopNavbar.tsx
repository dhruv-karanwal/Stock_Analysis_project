'use client';

import { motion } from 'framer-motion';
import { Bell, Menu, X, TrendingUp, TrendingDown, Clock, Cpu } from 'lucide-react';
import Link from 'next/link';
import { Stock } from '@/types';

interface TopNavbarProps {
  selectedStock?: Stock | null;
  timeFrame?: string;
  onMenuToggle?: () => void;
  sidebarOpen?: boolean;
}

export function TopNavbar({ selectedStock, timeFrame, onMenuToggle, sidebarOpen }: TopNavbarProps) {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateString = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 glass-dark flex-shrink-0 gap-4">
      {/* Left: menu + breadcrumb + stock info */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-[#64748B] flex-shrink-0"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm flex-shrink-0">
          <Link href="/dashboard" className="text-[#64748B] hover:text-[#94A3B8] transition-colors font-medium">
            Dashboard
          </Link>
          {selectedStock && (
            <>
              <span className="text-[#334155]">/</span>
              <span className="font-bold text-[#00F5A0] font-mono">{selectedStock.symbol}</span>
              <span className="text-[#475569] hidden sm:inline">— {selectedStock.name}</span>
            </>
          )}
        </div>

        {/* Stock quick-info pill (shown when a stock is selected) */}
        {selectedStock && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-4 px-4 py-2 rounded-xl bg-[#111827] border border-white/7"
          >
            <div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider">Price</div>
              <div className="text-sm font-bold font-mono text-[#E2E8F0]">${selectedStock.price.toFixed(2)}</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider">24h Change</div>
              <div className={`text-sm font-bold font-mono flex items-center gap-1 ${selectedStock.change >= 0 ? 'text-[#00F5A0]' : 'text-[#EF4444]'}`}>
                {selectedStock.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider">Sector</div>
              <div className="text-sm font-medium text-[#94A3B8]">{selectedStock.sector ?? 'N/A'}</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Right: status badges + time + bell + avatar */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Live analysis badge */}
        {selectedStock && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#00F5A0]/10 border border-[#00F5A0]/25"
          >
            <div className="w-2 h-2 rounded-full bg-[#00F5A0] animate-pulse" />
            <span className="text-[#00F5A0] text-xs font-semibold">Live Analysis</span>
            <span className="text-[#00F5A0]/60 text-xs">·</span>
            <span className="text-[#00F5A0] text-xs font-mono">{timeFrame}</span>
          </motion.div>
        )}

        {/* ML model status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#7F5AF0]/10 border border-[#7F5AF0]/25">
          <Cpu className="w-3.5 h-3.5 text-[#7F5AF0]" />
          <span className="text-[#7F5AF0] text-xs font-semibold">Model Ready</span>
        </div>

        {/* Date & time */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111827] border border-white/7">
          <Clock className="w-3.5 h-3.5 text-[#64748B]" />
          <div className="text-right">
            <div className="text-xs text-[#E2E8F0] font-mono font-semibold">{timeString}</div>
            <div className="text-[10px] text-[#64748B]">{dateString}</div>
          </div>
        </div>

        {/* Notification bell */}
        <button className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors border border-white/7">
          <Bell className="w-4 h-4 text-[#64748B]" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] border border-[#0d1117]" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7F5AF0] to-[#C471F5] flex items-center justify-center text-sm font-bold text-white shadow-lg">
          AI
        </div>
      </div>
    </header>
  );
}
