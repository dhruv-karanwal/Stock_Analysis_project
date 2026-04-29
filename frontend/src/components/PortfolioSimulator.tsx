'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface PortfolioData {
  currentPrice: number;
  predictedPrice: number;
  expectedChange: number;
}

interface PortfolioSimulatorProps {
  ticker: string;
  currentPrice?: number;
  predictedPrice?: number;
}

export function PortfolioSimulator({ ticker, currentPrice = 150, predictedPrice = 165 }: PortfolioSimulatorProps) {
  const [investmentAmount, setInvestmentAmount] = useState(5000);
  const [shares, setShares] = useState(0);
  const [expectedReturn, setExpectedReturn] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);
  const [profitLossPercent, setProfitLossPercent] = useState(0);

  useEffect(() => {
    const calculatedShares = investmentAmount / currentPrice;
    setShares(calculatedShares);

    const futureValue = calculatedShares * predictedPrice;
    const pl = futureValue - investmentAmount;
    const plPercent = (pl / investmentAmount) * 100;

    setExpectedReturn(futureValue);
    setProfitLoss(pl);
    setProfitLossPercent(plPercent);
  }, [investmentAmount, currentPrice, predictedPrice]);

  const isPositive = profitLoss >= 0;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-1">Portfolio Simulator</h3>
        <p className="text-sm text-slate-400">Calculate potential returns on your investment</p>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Investment Amount
          </label>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-teal-400" />
            <input
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              min="0"
              step="100"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Minimum: $0 | Step: $100</p>
        </div>

        {/* Quick Amount Buttons */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2">Quick Set</label>
          <div className="grid grid-cols-4 gap-2">
            {[1000, 5000, 10000, 25000].map((amount) => (
              <button
                key={amount}
                onClick={() => setInvestmentAmount(amount)}
                className={`px-3 py-2 rounded text-sm font-medium transition ${
                  investmentAmount === amount
                    ? 'bg-teal-500 text-slate-900'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                ${(amount / 1000).toFixed(0)}K
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Price Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-700">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-2">Current Price</p>
          <p className="text-2xl font-bold text-blue-400">${currentPrice.toFixed(2)}</p>
          <p className="text-xs text-slate-400 mt-2">Market price now</p>
        </div>
        <div className={`rounded-lg p-4 ${predictedPrice > currentPrice ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
          <p className="text-xs text-slate-400 mb-2">Predicted Price</p>
          <div className="flex items-center gap-2">
            <p className={`text-2xl font-bold ${predictedPrice > currentPrice ? 'text-green-400' : 'text-red-400'}`}>
              ${predictedPrice.toFixed(2)}
            </p>
            {predictedPrice > currentPrice ? (
              <TrendingUp className="w-6 h-6 text-green-400" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-400" />
            )}
          </div>
          <p className={`text-xs mt-2 ${predictedPrice > currentPrice ? 'text-green-400' : 'text-red-400'}`}>
            {predictedPrice > currentPrice ? '+' : ''}{((predictedPrice - currentPrice) / currentPrice * 100).toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Calculation Results */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-300 mb-2 block">Investment Breakdown</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Shares You'll Own</p>
              <p className="text-xl font-bold text-teal-400">{shares.toFixed(2)}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Total Investment</p>
              <p className="text-xl font-bold text-slate-200">${investmentAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Expected Return */}
        <div className={`rounded-lg p-4 border ${isPositive ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
          <p className="text-xs text-slate-400 mb-2">Expected Portfolio Value</p>
          <p className={`text-3xl font-bold mb-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            ${expectedReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 mb-1">Profit / Loss</p>
              <div className="flex items-center gap-2">
                <p className={`text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : ''}${profitLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {isPositive ? (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 mb-1">Return %</p>
              <p className={`text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{profitLossPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-xs text-slate-300 space-y-1">
        <p className="font-semibold text-blue-400">Disclaimer</p>
        <p>This calculator is for educational purposes only. Actual returns may vary based on market conditions, execution price, and timing. Past performance does not guarantee future results.</p>
      </div>
    </div>
  );
}
