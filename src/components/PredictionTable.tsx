'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search, ArrowUpDown, ArrowUp, ArrowDown,
  ExternalLink, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { PredictionHistoryItem } from '@/types';
import { getRiskColor } from '@/lib/mockData';

type SortField = 'date' | 'predictedVolatility' | 'riskLevel' | 'confidence';
type SortDir = 'asc' | 'desc';

interface PredictionTableProps {
  data: PredictionHistoryItem[];
}

export function PredictionTable({ data }: PredictionTableProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(0);
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const PER_PAGE = 5;

  const filtered = useMemo(() => {
    let result = data.filter((d) =>
      d.stock.toLowerCase().includes(search.toLowerCase()) ||
      d.stockName.toLowerCase().includes(search.toLowerCase())
    );
    if (riskFilter !== 'All') result = result.filter((d) => d.riskLevel === riskFilter);
    result.sort((a, b) => {
      let va: any = a[sortField];
      let vb: any = b[sortField];
      if (typeof va === 'string') {
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === 'asc' ? va - vb : vb - va;
    });
    return result;
  }, [data, search, sortField, sortDir, riskFilter]);

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-[#00F5A0]" /> : <ArrowDown className="w-3 h-3 text-[#00F5A0]" />;
  };

  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search stocks..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-[#111827] border border-white/7 text-[#E2E8F0] placeholder:text-[#475569] outline-none focus:border-[#00F5A0]/40"
          />
        </div>
        <div className="flex gap-1">
          {['All', 'Low', 'Medium', 'High'].map((r) => (
            <button
              key={r}
              onClick={() => { setRiskFilter(r); setPage(0); }}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                riskFilter === r
                  ? 'bg-[#1a2235] text-[#00F5A0] border border-[#00F5A0]/30'
                  : 'text-[#64748B] hover:text-[#94A3B8] border border-white/5'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/7">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/7 bg-[#111827]">
              <th className="text-left px-4 py-3 text-[#64748B] font-medium">Stock</th>
              <th
                className="text-left px-3 py-3 text-[#64748B] font-medium cursor-pointer hover:text-[#94A3B8]"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1">Date <SortIcon field="date" /></div>
              </th>
              <th className="text-left px-3 py-3 text-[#64748B] font-medium">Indicators</th>
              <th
                className="text-left px-3 py-3 text-[#64748B] font-medium cursor-pointer hover:text-[#94A3B8]"
                onClick={() => handleSort('predictedVolatility')}
              >
                <div className="flex items-center gap-1">Volatility <SortIcon field="predictedVolatility" /></div>
              </th>
              <th
                className="text-left px-3 py-3 text-[#64748B] font-medium cursor-pointer hover:text-[#94A3B8]"
                onClick={() => handleSort('riskLevel')}
              >
                <div className="flex items-center gap-1">Risk <SortIcon field="riskLevel" /></div>
              </th>
              <th
                className="text-left px-3 py-3 text-[#64748B] font-medium cursor-pointer hover:text-[#94A3B8]"
                onClick={() => handleSort('confidence')}
              >
                <div className="flex items-center gap-1">Confidence <SortIcon field="confidence" /></div>
              </th>
              <th className="text-left px-3 py-3 text-[#64748B] font-medium">Actual</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => {
              const riskColor = getRiskColor(row.riskLevel);
              return (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#1a2235] flex items-center justify-center text-[10px] font-bold text-[#00F5A0] font-mono">
                        {row.stock.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-[#E2E8F0] font-bold">{row.stock}</div>
                        <div className="text-[#64748B] truncate max-w-20">{row.stockName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[#94A3B8] font-mono">{row.date}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {row.indicators.map((ind) => (
                        <span key={ind} className="px-1.5 py-0.5 rounded bg-[#1a2235] text-[#7F5AF0] font-mono text-[10px]">
                          {ind}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono" style={{ color: riskColor }}>
                        {row.predictedVolatility.toFixed(3)}
                      </span>
                      <div className="flex-1 bg-[#0B0F19] rounded-full h-1.5 w-12">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${row.predictedVolatility * 100}%`, backgroundColor: riskColor }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-semibold border"
                      style={{ color: riskColor, backgroundColor: riskColor + '15', borderColor: riskColor + '40' }}
                    >
                      {row.riskLevel}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[#94A3B8] font-mono">{row.confidence.toFixed(1)}%</td>
                  <td className="px-3 py-3 text-[#64748B] font-mono">
                    {row.actual ? row.actual.toFixed(3) : '—'}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {paged.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-[#64748B]">No predictions found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#64748B]">
            Showing {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-[#94A3B8]" />
            </button>
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-7 h-7 rounded-lg text-xs transition-all ${
                  page === i ? 'bg-[#00F5A0]/20 text-[#00F5A0] font-bold' : 'text-[#64748B] hover:bg-white/5'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(pages - 1, p + 1))}
              disabled={page === pages - 1}
              className="p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
