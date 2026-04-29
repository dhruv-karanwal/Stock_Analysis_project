'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  onLoading?: (loading: boolean) => void;
}

export function SearchBar({ onLoading }: SearchBarProps) {
  const router = useRouter();
  const [ticker, setTicker] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ticker.trim()) {
      setError('Please enter a ticker symbol');
      return;
    }

    if (ticker.length > 5) {
      setError('Ticker must be 5 characters or less');
      return;
    }

    setIsLoading(true);
    onLoading?.(true);

    try {
      router.push(`/dashboard?ticker=${ticker.toUpperCase()}`);
    } catch (err) {
      setError('Failed to navigate');
    } finally {
      setIsLoading(false);
      onLoading?.(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Enter ticker (e.g., AAPL)"
            value={ticker}
            onChange={(e) => {
              setTicker(e.target.value.toUpperCase());
              setError('');
            }}
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-slate-900 font-semibold rounded-lg transition flex items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Analyze'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}
