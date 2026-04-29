import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { BarChart3, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="py-20 px-6 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Predict Stock <span className="text-teal-400">Volatility</span> with ML
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Professional-grade volatility prediction using machine learning ensemble models and real-time technical analysis
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-4 hover:border-teal-500/50 transition">
              <BarChart3 className="w-8 h-8 text-teal-400" />
              <h3 className="text-xl font-bold">Real-time Predictions</h3>
              <p className="text-slate-400 text-sm">
                Get instant volatility predictions powered by state-of-the-art ML models trained on historical market data
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-4 hover:border-teal-500/50 transition">
              <Zap className="w-8 h-8 text-teal-400" />
              <h3 className="text-xl font-bold">Technical Analysis</h3>
              <p className="text-slate-400 text-sm">
                Advanced indicators including RSI, MACD, Bollinger Bands, and more for comprehensive market analysis
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-4 hover:border-teal-500/50 transition">
              <Shield className="w-8 h-8 text-teal-400" />
              <h3 className="text-xl font-bold">Risk Assessment</h3>
              <p className="text-slate-400 text-sm">
                Comprehensive risk profiles with confidence scores and actionable trading signals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto font-bold text-slate-900 mb-4">
                1
              </div>
              <h3 className="text-lg font-bold mb-2">Enter Ticker</h3>
              <p className="text-slate-400">Type any stock ticker symbol</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto font-bold text-slate-900 mb-4">
                2
              </div>
              <h3 className="text-lg font-bold mb-2">ML Analysis</h3>
              <p className="text-slate-400">Models analyze volatility and price movement</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto font-bold text-slate-900 mb-4">
                3
              </div>
              <h3 className="text-lg font-bold mb-2">Get Results</h3>
              <p className="text-slate-400">View detailed predictions and signals</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-3">Ready to Analyze?</h2>
            <p className="text-slate-400 text-lg">Start your stock volatility analysis today</p>
          </div>
          <Link href="/stocks">
            <button className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-slate-900 font-bold rounded-lg transition">
              View All Stocks
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
