'use client';

import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-slate-900" />
          </div>
          <span className="font-bold text-lg">StockVoice</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/stocks" className="text-slate-400 hover:text-teal-400 transition">
            All Stocks
          </Link>
          <Link href="/" className="text-slate-400 hover:text-teal-400 transition">
            Analyze
          </Link>
        </div>
      </div>
    </nav>
  );
}
