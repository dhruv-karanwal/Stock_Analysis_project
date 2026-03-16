'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, TrendingDown } from 'lucide-react';
import { STOCK_DATABASE } from '@/lib/mockData';
import { Stock } from '@/types';

interface StockSearchBarProps {
  onSelect: (stock: Stock) => void;
  selectedStock?: Stock | null;
}

export function StockSearchBar({ onSelect, selectedStock }: StockSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.length > 0
    ? STOCK_DATABASE.filter(
        (s) =>
          s.symbol.toLowerCase().includes(query.toLowerCase()) ||
          s.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 7)
    : STOCK_DATABASE.slice(0, 6);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (stock: Stock) => {
    onSelect(stock);
    setQuery('');
    setIsOpen(false);
    setFocused(false);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <motion.div
        animate={{ borderColor: focused ? 'rgba(0, 245, 160, 0.5)' : 'rgba(255,255,255,0.07)' }}
        className="relative flex items-center rounded-xl border bg-[#111827] transition-all"
        style={{ boxShadow: focused ? '0 0 0 3px rgba(0, 245, 160, 0.08)' : 'none' }}
      >
        <Search className="absolute left-3 w-4 h-4 text-[#64748B]" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search symbol or company (e.g. AAPL, Tesla)..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => { setFocused(true); setIsOpen(true); }}
          className="w-full bg-transparent text-sm text-[#E2E8F0] placeholder:text-[#475569] pl-10 pr-10 py-3 outline-none rounded-xl"
        />
        {query && (
          <button onClick={handleClear} className="absolute right-3 text-[#64748B] hover:text-[#E2E8F0]">
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 glass rounded-xl overflow-hidden shadow-2xl"
            style={{ maxHeight: '320px', overflowY: 'auto' }}
          >
            {query.length === 0 && (
              <div className="px-3 py-2 border-b border-white/5">
                <span className="text-xs text-[#64748B] font-medium">Popular Stocks</span>
              </div>
            )}
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-[#64748B] text-sm">No stocks found for "{query}"</p>
                <p className="text-[#475569] text-xs mt-1">Try symbols like AAPL, TSLA, RELIANCE</p>
              </div>
            ) : (
              results.map((stock, i) => (
                <motion.button
                  key={stock.symbol}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => handleSelect(stock)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#1a2235] flex items-center justify-center text-xs font-bold text-[#00F5A0] font-mono">
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-[#E2E8F0] text-sm font-semibold">{stock.symbol}</div>
                      <div className="text-[#64748B] text-xs">{stock.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#E2E8F0] text-sm font-mono">${stock.price.toFixed(2)}</div>
                    <div className={`text-xs flex items-center gap-0.5 justify-end ${stock.change >= 0 ? 'text-[#00F5A0]' : 'text-[#EF4444]'}`}>
                      {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {selectedStock && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 px-3 py-2 rounded-lg bg-[#00F5A0]/10 border border-[#00F5A0]/20 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-[#00F5A0] font-bold text-sm font-mono">{selectedStock.symbol}</span>
            <span className="text-[#94A3B8] text-xs">{selectedStock.name}</span>
          </div>
          <div className={`text-xs font-mono flex items-center gap-1 ${selectedStock.change >= 0 ? 'text-[#00F5A0]' : 'text-[#EF4444]'}`}>
            {selectedStock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            ${selectedStock.price.toFixed(2)}
            <span className="ml-1">{selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
