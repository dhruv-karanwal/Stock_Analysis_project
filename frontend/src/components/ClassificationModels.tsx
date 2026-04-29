'use client';

import { useState, useEffect } from 'react';
import {
  logisticRegression,
  svm,
  knn,
  decisionTree,
  randomForest,
  naiveBayes,
  ensembleVoting,
  analyzeOverfitting,
  ClassificationResult,
  EnsembleVote,
  OverfittingAnalysis,
} from '@/utils/classificationModels';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ClassificationModelsProps {
  ticker: string;
  rsi: number;
  macd: number;
  momentum: number;
}

export function ClassificationModels({ ticker, rsi, macd, momentum }: ClassificationModelsProps) {
  const [predictions, setPredictions] = useState<Record<string, ClassificationResult> | null>(null);
  const [ensembleResult, setEnsembleResult] = useState<EnsembleVote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generatePredictions = () => {
      // Individual model predictions
      const logistic = logisticRegression(rsi, macd, momentum, 0.55);
      const svmLinear = svm(rsi, macd, momentum, 'linear');
      const svmRbf = svm(rsi, macd, momentum, 'rbf');
      const knnResult = knn(rsi, macd, momentum, 5);
      const dtree = decisionTree(rsi, macd, momentum);
      const rf = randomForest(rsi, macd, momentum, 5);
      const nb = naiveBayes(rsi, macd, momentum, 0.6);

      setPredictions({
        'Logistic Regression': logistic,
        'SVM (Linear)': svmLinear,
        'SVM (RBF)': svmRbf,
        'KNN (k=5)': knnResult,
        'Decision Tree': dtree,
        'Random Forest': rf,
        'Naive Bayes': nb,
      });

      // Ensemble voting
      const ensemble = ensembleVoting(rsi, macd, momentum);
      setEnsembleResult(ensemble);

      setLoading(false);
    };

    setLoading(true);
    const timer = setTimeout(generatePredictions, 600);
    return () => clearTimeout(timer);
  }, [rsi, macd, momentum]);

  if (loading || !predictions || !ensembleResult) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const signalColor = ensembleResult.finalSignal === 'BUY' ? 'text-green-400' : ensembleResult.finalSignal === 'SELL' ? 'text-red-400' : 'text-yellow-400';
  const signalBgColor = ensembleResult.finalSignal === 'BUY' ? 'bg-green-500/10' : ensembleResult.finalSignal === 'SELL' ? 'bg-red-500/10' : 'bg-yellow-500/10';
  const signalBorderColor = ensembleResult.finalSignal === 'BUY' ? 'border-green-500/30' : ensembleResult.finalSignal === 'SELL' ? 'border-red-500/30' : 'border-yellow-500/30';

  const chartData = Object.entries(predictions).map(([name, result]) => ({
    name: name.replace('Logistic Regression', 'Logistic').replace('SVM (Linear)', 'SVM-L').replace('SVM (RBF)', 'SVM-R').replace('Decision Tree', 'DTree').replace('Random Forest', 'RF').replace('Naive Bayes', 'NB').replace('KNN (k=5)', 'KNN'),
    confidence: parseFloat((result.confidence * 100).toFixed(1)),
    signal: result.prediction === 1 ? 'Buy' : 'Sell',
  }));

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          Classification Models - Trading Signals
        </h3>
        <p className="text-sm text-slate-400">7 classification models with ensemble voting for Buy/Sell signals</p>
      </div>

      {/* Ensemble Signal - Large Card */}
      <div className={`${signalBgColor} border ${signalBorderColor} rounded-lg p-6 text-center`}>
        <p className="text-xs font-bold text-slate-400 mb-2">ENSEMBLE VOTING DECISION</p>
        <p className={`text-4xl font-bold mb-2 ${signalColor}`}>{ensembleResult.finalSignal}</p>
        <p className="text-sm text-slate-300 mb-3">
          Confidence: <span className={`font-bold ${signalColor}`}>{(ensembleResult.confidence * 100).toFixed(1)}%</span>
        </p>
        <div className="text-xs text-slate-400 space-y-1">
          <p>{ensembleResult.buyVotes} models voted BUY | {ensembleResult.sellVotes} models voted SELL</p>
        </div>
      </div>

      {/* Individual Model Predictions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Classification Model</th>
              <th className="text-center py-3 px-4 text-slate-300 font-semibold">Prediction</th>
              <th className="text-right py-3 px-4 text-slate-300 font-semibold">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(predictions).map(([name, result]) => (
              <tr key={name} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="py-3 px-4 text-slate-200 font-medium">{name}</td>
                <td className={`text-center py-3 px-4 font-bold ${result.prediction === 1 ? 'text-green-400' : 'text-red-400'}`}>
                  {result.prediction === 1 ? 'BUY' : 'SELL'}
                </td>
                <td className="text-right py-3 px-4 text-blue-400">{(result.confidence * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Model Voting Distribution */}
      <div className="bg-slate-700/50 rounded-lg p-4">
        <p className="text-xs font-bold text-slate-300 mb-3">VOTING DISTRIBUTION</p>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-end gap-2 mb-2">
              <div className="text-2xl font-bold text-green-400">{ensembleResult.buyVotes}</div>
              <div className="text-xs text-slate-400">models vote BUY</div>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(ensembleResult.buyVotes / 7) * 100}%` }}></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-end gap-2 mb-2">
              <div className="text-2xl font-bold text-red-400">{ensembleResult.sellVotes}</div>
              <div className="text-xs text-slate-400">models vote SELL</div>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(ensembleResult.sellVotes / 7) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence Comparison Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '11px' }} />
            <YAxis stroke="#94a3b8" label={{ value: 'Confidence (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0' }}
              formatter={(value: any) => `${value.toFixed(1)}%`}
            />
            <Bar dataKey="confidence" fill="#06b6d4" name="Confidence" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Model Explanations */}
      <div className="bg-slate-700/50 rounded-lg p-4 space-y-3 text-xs text-slate-400">
        <div>
          <p className="font-bold text-slate-300 mb-1">Classification Models Used:</p>
          <p><strong>Logistic Regression:</strong> Linear boundary with sigmoid probability. Simple but effective.</p>
          <p><strong>SVM (Linear/RBF):</strong> Finds optimal hyperplane (linear) or handles non-linear patterns (RBF kernel).</p>
          <p><strong>KNN:</strong> Classifies based on k=5 nearest neighbors in feature space.</p>
          <p><strong>Decision Tree:</strong> Hierarchical if-then rules for classification.</p>
          <p><strong>Random Forest:</strong> Ensemble of 5 decision trees with majority voting.</p>
          <p><strong>Naive Bayes:</strong> Probabilistic classifier using Bayes theorem with feature independence.</p>
        </div>
        <div>
          <p className="font-bold text-slate-300 mb-1">Ensemble Voting:</p>
          <p>Final signal determined by majority voting across all models. Confidence = proportion of agreeing models.</p>
        </div>
      </div>

      {/* Technical Indicators Used */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 text-xs">
        <p className="font-bold text-cyan-400 mb-2">TECHNICAL FEATURES</p>
        <div className="grid grid-cols-3 gap-3 text-slate-300">
          <div>
            <p className="text-slate-400 text-xs">RSI</p>
            <p className="font-bold">{rsi.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">MACD</p>
            <p className="font-bold">{macd.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs">Momentum</p>
            <p className="font-bold">{momentum.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
