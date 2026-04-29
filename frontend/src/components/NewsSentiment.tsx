'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number; // 0-100
  url: string;
  publishedAt: string;
}

interface NewsSentimentProps {
  ticker: string;
}

export function NewsSentiment({ ticker }: NewsSentimentProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgSentiment, setAvgSentiment] = useState(0);

  useEffect(() => {
    const generateMockNews = () => {
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: `${ticker} reports strong Q3 earnings, exceeds analyst expectations`,
          source: 'Reuters',
          sentiment: 'positive',
          score: 78,
          url: '#',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleDateString(),
        },
        {
          id: '2',
          title: `Market analysts maintain bullish outlook for ${ticker} stock`,
          source: 'CNBC',
          sentiment: 'positive',
          score: 72,
          url: '#',
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleDateString(),
        },
        {
          id: '3',
          title: `${ticker} faces supply chain challenges in latest update`,
          source: 'Bloomberg',
          sentiment: 'negative',
          score: 35,
          url: '#',
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toLocaleDateString(),
        },
        {
          id: '4',
          title: `Industry trends suggest mixed signals for ${ticker} sector`,
          source: 'Financial Times',
          sentiment: 'neutral',
          score: 50,
          url: '#',
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toLocaleDateString(),
        },
        {
          id: '5',
          title: `${ticker} launches new product line targeting emerging markets`,
          source: 'MarketWatch',
          sentiment: 'positive',
          score: 75,
          url: '#',
          publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toLocaleDateString(),
        },
      ];

      setNews(mockNews);
      const avg = mockNews.reduce((sum, item) => sum + item.score, 0) / mockNews.length;
      setAvgSentiment(avg);
      setLoading(false);
    };

    setLoading(true);
    const timer = setTimeout(generateMockNews, 700);
    return () => clearTimeout(timer);
  }, [ticker]);

  if (loading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const positiveSentiments = news.filter((n) => n.sentiment === 'positive').length;
  const negativeSentiments = news.filter((n) => n.sentiment === 'negative').length;
  const neutralSentiments = news.filter((n) => n.sentiment === 'neutral').length;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500/10 border-green-500/30';
      case 'negative':
        return 'bg-red-500/10 border-red-500/30';
      default:
        return 'bg-slate-700/50 border-slate-600';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold mb-1">News Sentiment Analysis</h3>
        <p className="text-sm text-slate-400">Latest news and sentiment indicators</p>
      </div>

      {/* Sentiment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-2">Positive</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-green-400">{positiveSentiments}</p>
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
        </div>
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-2">Neutral</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-slate-300">{neutralSentiments}</p>
            <Minus className="w-6 h-6 text-slate-400" />
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-2">Negative</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-red-400">{negativeSentiments}</p>
            <TrendingDown className="w-6 h-6 text-red-400" />
          </div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-2">Avg Sentiment</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-400">{avgSentiment.toFixed(0)}</p>
              <p className="text-xs text-slate-400">/100</p>
            </div>
            <div className="text-right">
              <p className={`text-xs font-bold ${avgSentiment > 60 ? 'text-green-400' : avgSentiment < 40 ? 'text-red-400' : 'text-yellow-400'}`}>
                {avgSentiment > 60 ? 'Bullish' : avgSentiment < 40 ? 'Bearish' : 'Mixed'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* News List */}
      <div className="space-y-3">
        {news.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block border rounded-lg p-4 transition hover:shadow-lg ${getSentimentColor(article.sentiment)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                {getSentimentIcon(article.sentiment)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-200 mb-1 text-sm leading-tight">{article.title}</h4>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>{article.publishedAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-12 h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            article.sentiment === 'positive'
                              ? 'bg-green-500'
                              : article.sentiment === 'negative'
                              ? 'bg-red-500'
                              : 'bg-yellow-500'
                          }`}
                          style={{ width: `${article.score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold w-6 text-right">{article.score}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-teal-400" />
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
