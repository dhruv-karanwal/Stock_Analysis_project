'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, History, Brain, Settings, Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Analysis & Prediction' },
  { href: '/dashboard/history', label: 'History', icon: History, desc: 'Past Predictions' },
  { href: '/dashboard/insights', label: 'Model Insights', icon: Brain, desc: 'ML Interpretability' },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, desc: 'Preferences' },
];

const MARKET_TICKERS = [
  { sym: 'BTC/USD', val: '+2.4%', price: '$67,842', up: true },
  { sym: 'S&P 500', val: '+0.7%', price: '5,248', up: true },
  { sym: 'VIX', val: '-3.1%', price: '14.82', up: false },
  { sym: 'DXY', val: '+0.2%', price: '104.3', up: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 flex-shrink-0 flex flex-col h-full bg-[#0d1117] border-r border-white/5">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#00F5A0] to-[#00C9FF] flex items-center justify-center shadow-lg flex-shrink-0">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="font-bold text-base gradient-text-primary font-display">VolatilityAI</div>
            <div className="text-xs text-[#64748B]">ML Trading Analytics</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-1.5">
        <div className="text-[11px] text-[#475569] font-semibold tracking-widest uppercase px-3 mb-4">
          Navigation
        </div>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative group ${
                active
                  ? 'sidebar-item-active text-[#00F5A0]'
                  : 'text-[#64748B] hover:text-[#94A3B8] hover:bg-white/3'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-[#00F5A0]/8"
                  transition={{ duration: 0.2 }}
                />
              )}
              <div
                className="relative z-10 p-2 rounded-lg flex-shrink-0"
                style={active ? { backgroundColor: 'rgba(0,245,160,0.12)' } : { backgroundColor: 'rgba(255,255,255,0.04)' }}
              >
                <item.icon className="w-4 h-4" />
              </div>
              <div className="relative z-10">
                <div className="text-sm font-semibold">{item.label}</div>
                <div className={`text-xs mt-0.5 ${active ? 'text-[#00F5A0]/60' : 'text-[#475569]'}`}>{item.desc}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Market Ticker */}
      <div className="px-4 pb-4 pt-3 border-t border-white/5">
        <div className="text-[11px] text-[#475569] font-semibold tracking-widest uppercase mb-3 px-1">
          Market Pulse
        </div>
        <div className="grid grid-cols-2 gap-2">
          {MARKET_TICKERS.map(({ sym, val, price, up }) => (
            <div key={sym} className="bg-[#111827] rounded-xl p-3 border border-white/5">
              <div className="text-[11px] text-[#64748B] font-medium mb-1">{sym}</div>
              <div className="text-sm font-bold text-[#E2E8F0] font-mono">{price}</div>
              <div className={`text-xs font-semibold mt-0.5 ${up ? 'text-[#00F5A0]' : 'text-[#EF4444]'}`}>
                {val}
              </div>
            </div>
          ))}
        </div>

        {/* System status */}
        <div className="mt-3 flex items-center gap-2.5 px-2 py-2 rounded-xl bg-[#111827] border border-white/5">
          <div className="w-2 h-2 rounded-full bg-[#00F5A0] animate-pulse flex-shrink-0" />
          <div>
            <div className="text-xs text-[#E2E8F0] font-medium">ML Model · Online</div>
            <div className="text-[10px] text-[#64748B]">XGBoost + LSTM Ready</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
