"""
Main Stock Analysis Pipeline
Integrates all ML concepts into a comprehensive analysis
"""

from app.data_fetcher import fetch_stock_data
from app.features import add_features, create_target
from app.stock_insights import StockInsightAnalyzer
import pandas as pd
import numpy as np
import os

# Create reports directory
os.makedirs('reports', exist_ok=True)

def run_complete_stock_analysis(symbol="AAPL", period="1y"):
    """
    Complete ML-driven stock analysis pipeline
    
    Shows practical applications of ML concepts:
    - REGRESSION: Predict next day price
    - CLASSIFICATION: Predict if price goes up/down  
    - CLUSTERING: Find price movement patterns
    - DIMENSIONALITY REDUCTION: Understand which indicators matter
    - DECISION TREES: Extract simple trading rules
    
    Args:
        symbol: Stock ticker (e.g. 'AAPL')
        period: Time period ('1y', '2y', '3mo', '6mo', '5y', etc.)
    """
    
    print("\n" + "="*70)
    print(f"🚀 COMPLETE ML STOCK ANALYSIS: {symbol}")
    print("="*70)
    
    # Step 1: Fetch and prepare data
    print("\n📥 STEP 1: Loading stock data...")
    df = fetch_stock_data(symbol, period=period)
    
    print(f"   Loaded {len(df)} trading days")
    print(f"   Date range: {df.index[0].date()} to {df.index[-1].date()}")
    
    # Step 2: Create features (technical indicators)
    print("\n🔧 STEP 2: Creating technical indicators...")
    df = add_features(df)
    df = create_target(df)
    
    print(f"   Created {df.shape[1]} features")
    print(f"   Features: {', '.join([col for col in df.columns if col not in ['Close', 'Date', 'Target']][:5])}...")
    
    # Step 3: Run comprehensive ML analysis
    print("\n📊 STEP 3: Running comprehensive ML analysis...")
    analyzer = StockInsightAnalyzer(df, symbol=symbol)
    
    # Generate all reports with visualizations
    analyzer.generate_full_report()
    
    print("\n" + "="*70)
    print("✅ ANALYSIS COMPLETE!")
    print("="*70)
    print("\n📁 Check the 'reports/' folder for all visualizations:")
    print("   - price_predictions.png: Stock price forecasts (Regression)")
    print("   - direction_analysis.png: Up/Down predictions + confidence (Classification)")
    print("   - clustering_analysis.png: Price movement patterns (Clustering)")
    print("   - feature_analysis.png: Important indicators (PCA)")
    print("   - decision_tree.png: Simple trading rules (Decision Trees)")
    
    return analyzer


def analyze_multiple_stocks(symbols=["AAPL", "GOOGL", "MSFT"]):
    """
    Analyze multiple stocks and compare patterns
    Useful for portfolio analysis
    """
    print("\n" + "="*70)
    print(f"📈 ANALYZING MULTIPLE STOCKS: {', '.join(symbols)}")
    print("="*70)
    
    analyzers = {}
    
    for symbol in symbols:
        try:
            print(f"\n Processing {symbol}...")
            analyzer = run_complete_stock_analysis(symbol)
            analyzers[symbol] = analyzer
        except Exception as e:
            print(f"   ⚠️ Error processing {symbol}: {e}")
    
    return analyzers


if __name__ == "__main__":
    # Option 1: Analyze a single stock
    print("\n" + "="*70)
    print("ML STOCK PREDICTION PROJECT")
    print("="*70)
    print("\nThis analysis demonstrates practical applications of ML concepts:")
    print("\n1️⃣  REGRESSION (Unit IV)")
    print("   → Predict next stock price using Linear Regression, Ridge, Random Forest")
    print("\n2️⃣  CLASSIFICATION (Unit III, V)")
    print("   → Predict if stock will go UP or DOWN with confidence scores")
    print("   → Confusion matrix, ROC curves, F1-scores")
    print("\n3️⃣  CLUSTERING (Unit VI)")
    print("   → Find recurring price movement patterns")
    print("   → K-Means, silhouette analysis, pattern characteristics")
    print("\n4️⃣  DIMENSIONALITY REDUCTION (Unit II)")
    print("   → Understand which technical indicators matter most")
    print("   → PCA, feature importance, correlation analysis")
    print("\n5️⃣  DECISION TREES (Unit V)")
    print("   → Extract simple 'IF-THEN' trading rules")
    print("   → Interpretable predictions")
    
    # Run single stock analysis
    analyzer = run_complete_stock_analysis(symbol="AAPL", period="1y")
    
    # Uncomment to analyze multiple stocks
    # analyzers = analyze_multiple_stocks(["AAPL", "MSFT", "GOOGL"])
