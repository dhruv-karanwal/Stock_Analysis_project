"""
ML-Driven Stock Analysis & Visualization
Applies ML concepts to extract stock insights and create interactive dashboards
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import confusion_matrix, roc_curve, auc, f1_score, r2_score, mean_squared_error
from sklearn.model_selection import train_test_split
from scipy.cluster.hierarchy import dendrogram, linkage
import warnings
warnings.filterwarnings('ignore')


class StockInsightAnalyzer:
    """
    Comprehensive stock analysis using ML concepts
    """
    
    def __init__(self, df, symbol="STOCK"):
        """
        df: DataFrame with stock data (Date, Close, Volume, and technical indicators)
        symbol: Stock symbol for labeling
        """
        self.df = df.copy()
        self.symbol = symbol
        self.scaler = StandardScaler()
        self.reports = {}
        
    # ============================================================================
    # 1. REGRESSION - PREDICT STOCK PRICE (Unit IV)
    # ============================================================================
    
    def predict_stock_price(self, test_size=0.2, plot=True):
        """
        Use Regression to predict next stock price
        ML Concept: Linear Regression, Ridge Regression, Model Performance (R², MSE)
        Stock Insight: "What will the stock price be tomorrow?"
        """
        print("\n" + "="*60)
        print("📈 STOCK PRICE PREDICTION (Regression)")
        print("="*60)
        
        # Prepare features
        feature_cols = [col for col in self.df.columns 
                       if col not in ['Close', 'Date', 'Target']]
        X = self.df[feature_cols].fillna(0).replace([np.inf, -np.inf], 0)
        y = self.df['Close']
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train multiple regression models
        models = {
            'Linear Regression': LinearRegression(),
            'Ridge Regression (L2)': Ridge(alpha=1.0),
            'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42)
        }
        
        results = {}
        predictions = {}
        
        for name, model in models.items():
            model.fit(X_train_scaled, y_train)
            y_pred = model.predict(X_test_scaled)
            
            r2 = r2_score(y_test, y_pred)
            rmse = np.sqrt(mean_squared_error(y_test, y_pred))
            
            results[name] = {'r2': r2, 'rmse': rmse}
            predictions[name] = y_pred
            
            print(f"\n{name}:")
            print(f"  R² Score: {r2:.4f}")
            print(f"  RMSE: ${rmse:.2f}")
        
        if plot:
            self._plot_price_predictions(y_test, predictions)
        
        self.reports['price_predictions'] = {
            'results': results,
            'y_test': y_test,
            'predictions': predictions
        }
        
        return results
    
    def _plot_price_predictions(self, y_test, predictions):
        """Visualize price predictions"""
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        fig.suptitle(f'{self.symbol} - Stock Price Predictions', fontsize=16, fontweight='bold')
        
        axes = axes.flatten()
        
        for idx, (model_name, y_pred) in enumerate(predictions.items()):
            ax = axes[idx]
            
            ax.plot(range(len(y_test)), y_test.values, 'o-', label='Actual', linewidth=2, markersize=4)
            ax.plot(range(len(y_test)), y_pred, 's--', label='Predicted', linewidth=2, markersize=4, alpha=0.7)
            
            r2 = r2_score(y_test, y_pred)
            ax.set_title(f'{model_name}\n(R² = {r2:.4f})', fontweight='bold')
            ax.set_xlabel('Time Period')
            ax.set_ylabel('Stock Price ($)')
            ax.legend()
            ax.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('reports/price_predictions.png', dpi=300, bbox_inches='tight')
        plt.show()
        print("✅ Saved: reports/price_predictions.png")
    
    # ============================================================================
    # 2. CLASSIFICATION - PREDICT STOCK DIRECTION (Unit III + V)
    # ============================================================================
    
    def predict_stock_direction(self, plot=True):
        """
        Use Classification to predict if stock will go UP or DOWN
        ML Concepts: Classification, Confusion Matrix, ROC/AUC, F1-Score, Precision-Recall
        Stock Insight: "Will this stock price increase tomorrow?"
        """
        print("\n" + "="*60)
        print("🎯 STOCK DIRECTION PREDICTION (Classification)")
        print("="*60)
        
        # Prepare features and target
        feature_cols = [col for col in self.df.columns 
                       if col not in ['Close', 'Date', 'Target']]
        X = self.df[feature_cols].fillna(0).replace([np.inf, -np.inf], 0)
        y = self.df['Target']
        
        if len(y.unique()) < 2:
            print("⚠️ Not enough classes for classification")
            return None
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train classifier
        clf = RandomForestClassifier(n_estimators=100, random_state=42)
        clf.fit(X_train_scaled, y_train)
        
        y_pred = clf.predict(X_test_scaled)
        y_pred_proba = clf.predict_proba(X_test_scaled)
        
        # Calculate metrics
        cm = confusion_matrix(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        
        print(f"\nConfusion Matrix:\n{cm}")
        print(f"F1-Score: {f1:.4f}")
        
        if plot:
            self._plot_direction_analysis(y_test, y_pred, y_pred_proba, cm, clf, X_test_scaled)
        
        self.reports['direction'] = {
            'cm': cm,
            'f1': f1,
            'y_test': y_test,
            'y_pred': y_pred,
            'y_pred_proba': y_pred_proba,
            'model': clf
        }
        
        return {'cm': cm, 'f1': f1}
    
    def _plot_direction_analysis(self, y_test, y_pred, y_pred_proba, cm, model, X_test):
        """Visualize classification metrics"""
        fig = plt.figure(figsize=(16, 12))
        fig.suptitle(f'{self.symbol} - Direction Prediction Analysis', fontsize=16, fontweight='bold')
        
        gs = fig.add_gridspec(2, 3, hspace=0.3, wspace=0.3)
        
        # 1. Confusion Matrix
        ax1 = fig.add_subplot(gs[0, 0])
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax1, cbar=False,
                   xticklabels=['Down', 'Up'], yticklabels=['Down', 'Up'])
        ax1.set_title('Confusion Matrix\n(Model Accuracy)', fontweight='bold')
        ax1.set_ylabel('True Label')
        ax1.set_xlabel('Predicted Label')
        
        # 2. ROC Curve
        ax2 = fig.add_subplot(gs[0, 1])
        fpr, tpr, _ = roc_curve(y_test, y_pred_proba[:, 1])
        roc_auc = auc(fpr, tpr)
        ax2.plot(fpr, tpr, 'b-', linewidth=2, label=f'ROC (AUC={roc_auc:.3f})')
        ax2.plot([0, 1], [0, 1], 'r--', linewidth=1)
        ax2.set_title('ROC Curve\n(Model Discrimination)', fontweight='bold')
        ax2.set_xlabel('False Positive Rate')
        ax2.set_ylabel('True Positive Rate')
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        # 3. Prediction Confidence
        ax3 = fig.add_subplot(gs[0, 2])
        confidence_up = y_pred_proba[:, 1]
        ax3.hist(confidence_up[y_test == 1], bins=20, alpha=0.6, label='Actual Up', color='green')
        ax3.hist(confidence_up[y_test == 0], bins=20, alpha=0.6, label='Actual Down', color='red')
        ax3.set_title('Prediction Confidence\n(Model Certainty)', fontweight='bold')
        ax3.set_xlabel('Probability of UP')
        ax3.set_ylabel('Count')
        ax3.legend()
        ax3.grid(True, alpha=0.3)
        
        # 4. Feature Importance
        ax4 = fig.add_subplot(gs[1, :2])
        feature_cols = [col for col in self.df.columns 
                       if col not in ['Close', 'Date', 'Target']]
        importance = model.feature_importances_
        indices = np.argsort(importance)[-10:]
        
        ax4.barh(range(len(indices)), importance[indices], color='steelblue')
        ax4.set_yticks(range(len(indices)))
        ax4.set_yticklabels([feature_cols[i] for i in indices])
        ax4.set_title('Top 10 Features for Direction Prediction\n(Which indicators matter most?)', fontweight='bold')
        ax4.set_xlabel('Importance Score')
        ax4.grid(True, alpha=0.3, axis='x')
        
        # 5. Prediction Timeline
        ax5 = fig.add_subplot(gs[1, 2])
        correct = (y_pred == y_test.values).astype(int)
        ax5.plot(correct, 'o-', markersize=3, linewidth=1, alpha=0.7)
        ax5.axhline(y=np.mean(correct), color='r', linestyle='--', label=f'Accuracy: {np.mean(correct):.2%}')
        ax5.set_title('Prediction Accuracy Over Time\n(How consistent?)', fontweight='bold')
        ax5.set_xlabel('Prediction #')
        ax5.set_ylabel('Correct (1) / Wrong (0)')
        ax5.set_ylim(-0.1, 1.1)
        ax5.legend()
        ax5.grid(True, alpha=0.3)
        
        plt.savefig('reports/direction_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()
        print("✅ Saved: reports/direction_analysis.png")
    
    # ============================================================================
    # 3. CLUSTERING - FIND STOCK PATTERNS (Unit VI)
    # ============================================================================
    
    def analyze_stock_patterns(self, plot=True):
        """
        Use Clustering to find patterns in stock price behavior
        ML Concepts: K-Means, Silhouette Analysis, Hierarchical Clustering
        Stock Insight: "What are the different price movement patterns?"
        """
        print("\n" + "="*60)
        print("🔍 STOCK PATTERN DISCOVERY (Clustering)")
        print("="*60)
        
        # Prepare features
        feature_cols = [col for col in self.df.columns 
                       if col not in ['Close', 'Date', 'Target']]
        X = self.df[feature_cols].fillna(0).replace([np.inf, -np.inf], 0)
        X_scaled = self.scaler.fit_transform(X)
        
        # Find optimal clusters using Elbow method
        inertias = []
        silhouette_scores = []
        K_range = range(2, 8)
        
        from sklearn.metrics import silhouette_score
        
        for k in K_range:
            kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
            labels = kmeans.fit_predict(X_scaled)
            inertias.append(kmeans.inertia_)
            silhouette_scores.append(silhouette_score(X_scaled, labels))
        
        optimal_k = K_range[np.argmax(silhouette_scores)]
        
        # Final clustering with optimal k
        kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
        labels = kmeans.fit_predict(X_scaled)
        
        print(f"\nOptimal number of patterns: {optimal_k}")
        print(f"Silhouette Score: {silhouette_scores[optimal_k-2]:.4f}")
        
        # Analyze each cluster
        self.df['Cluster'] = labels
        for cluster_id in range(optimal_k):
            cluster_data = self.df[self.df['Cluster'] == cluster_id]
            print(f"\nPattern {cluster_id}: {len(cluster_data)} periods")
            print(f"  Avg Price: ${cluster_data['Close'].mean():.2f}")
            print(f"  Volatility: {cluster_data['Close'].std():.2f}")
        
        if plot:
            self._plot_clustering_analysis(X_scaled, labels, K_range, inertias, 
                                          silhouette_scores, kmeans)
        
        self.reports['clustering'] = {
            'labels': labels,
            'optimal_k': optimal_k,
            'silhouette_scores': silhouette_scores
        }
        
        return {'optimal_k': optimal_k, 'silhouette': silhouette_scores[optimal_k-2]}
    
    def _plot_clustering_analysis(self, X_scaled, labels, K_range, inertias, 
                                 silhouette_scores, kmeans):
        """Visualize clustering results"""
        fig = plt.figure(figsize=(16, 10))
        fig.suptitle(f'{self.symbol} - Stock Pattern Discovery', fontsize=16, fontweight='bold')
        
        gs = fig.add_gridspec(2, 3, hspace=0.3, wspace=0.3)
        
        # 1. Elbow Curve
        ax1 = fig.add_subplot(gs[0, 0])
        ax1.plot(K_range, inertias, 'bo-', linewidth=2, markersize=8)
        ax1.set_xlabel('Number of Patterns (k)')
        ax1.set_ylabel('Inertia (Within-cluster sum)')
        ax1.set_title('Elbow Method\n(Where does slope flatten?)', fontweight='bold')
        ax1.grid(True, alpha=0.3)
        
        # 2. Silhouette Score
        ax2 = fig.add_subplot(gs[0, 1])
        ax2.plot(K_range, silhouette_scores, 'go-', linewidth=2, markersize=8)
        optimal_k = K_range[np.argmax(silhouette_scores)]
        ax2.axvline(x=optimal_k, color='r', linestyle='--', label=f'Optimal k={optimal_k}')
        ax2.set_xlabel('Number of Patterns (k)')
        ax2.set_ylabel('Silhouette Score')
        ax2.set_title('Silhouette Analysis\n(Which clustering is best?)', fontweight='bold')
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        # 3. PCA Visualization of Clusters
        ax3 = fig.add_subplot(gs[0, 2])
        from sklearn.decomposition import PCA
        pca = PCA(n_components=2)
        X_pca = pca.fit_transform(X_scaled)
        
        scatter = ax3.scatter(X_pca[:, 0], X_pca[:, 1], c=labels, cmap='viridis', 
                             s=50, alpha=0.6, edgecolors='black')
        ax3.scatter(pca.transform(kmeans.cluster_centers_)[:, 0],
                   pca.transform(kmeans.cluster_centers_)[:, 1],
                   marker='X', s=300, c='red', edgecolors='black', linewidth=2,
                   label='Cluster Centers')
        ax3.set_xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%} variance)')
        ax3.set_ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%} variance)')
        ax3.set_title('Clusters in 2D Space\n(Price patterns visualization)', fontweight='bold')
        plt.colorbar(scatter, ax=ax3, label='Pattern ID')
        ax3.legend()
        ax3.grid(True, alpha=0.3)
        
        # 4. Cluster Size Distribution
        ax4 = fig.add_subplot(gs[1, 0])
        unique, counts = np.unique(labels, return_counts=True)
        colors = plt.cm.viridis(np.linspace(0, 1, len(unique)))
        ax4.bar(unique, counts, color=colors, edgecolor='black')
        ax4.set_xlabel('Pattern ID')
        ax4.set_ylabel('Number of Occurrences')
        ax4.set_title('Frequency of Each Pattern\n(How often does each occur?)', fontweight='bold')
        ax4.grid(True, alpha=0.3, axis='y')
        
        # 5. Cluster Characteristics
        ax5 = fig.add_subplot(gs[1, 1:])
        cluster_stats = []
        for cluster_id in np.unique(labels):
            cluster_prices = self.df[self.df['Cluster'] == cluster_id]['Close']
            cluster_stats.append({
                'Pattern': cluster_id,
                'Avg Price': cluster_prices.mean(),
                'Volatility': cluster_prices.std(),
                'Count': len(cluster_prices)
            })
        
        cluster_df = pd.DataFrame(cluster_stats)
        x_pos = np.arange(len(cluster_df))
        width = 0.35
        
        ax5_twin = ax5.twinx()
        
        bars1 = ax5.bar(x_pos - width/2, cluster_df['Avg Price'], width, label='Avg Price', 
                       color='steelblue', alpha=0.8)
        bars2 = ax5_twin.bar(x_pos + width/2, cluster_df['Volatility'], width, label='Volatility', 
                            color='coral', alpha=0.8)
        
        ax5.set_xlabel('Pattern ID')
        ax5.set_ylabel('Average Price ($)', color='steelblue')
        ax5_twin.set_ylabel('Volatility (Std Dev)', color='coral')
        ax5.set_title('Pattern Characteristics\n(Price level and risk per pattern)', fontweight='bold')
        ax5.set_xticks(x_pos)
        ax5.set_xticklabels(cluster_df['Pattern'])
        
        ax5.tick_params(axis='y', labelcolor='steelblue')
        ax5_twin.tick_params(axis='y', labelcolor='coral')
        ax5.grid(True, alpha=0.3, axis='y')
        
        # Add legends
        lines1, labels1 = ax5.get_legend_handles_labels()
        lines2, labels2 = ax5_twin.get_legend_handles_labels()
        ax5.legend(lines1 + lines2, labels1 + labels2, loc='upper left')
        
        plt.savefig('reports/clustering_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()
        print("✅ Saved: reports/clustering_analysis.png")
    
    # ============================================================================
    # 4. FEATURE ANALYSIS - DIMENSIONALITY REDUCTION (Unit II)
    # ============================================================================
    
    def analyze_feature_relationships(self, plot=True):
        """
        Use PCA to understand feature relationships
        ML Concepts: PCA, Dimensionality Reduction, Feature Correlation
        Stock Insight: "Which indicators are most important? Are they correlated?"
        """
        print("\n" + "="*60)
        print("🔗 FEATURE IMPORTANCE & RELATIONSHIPS (PCA)")
        print("="*60)
        
        # Prepare features
        feature_cols = [col for col in self.df.columns 
                       if col not in ['Close', 'Date', 'Target', 'Cluster']]
        X = self.df[feature_cols].fillna(0).replace([np.inf, -np.inf], 0)
        X_scaled = self.scaler.fit_transform(X)
        
        # PCA analysis
        pca = PCA()
        pca.fit(X_scaled)
        
        # Explained variance
        explained_variance = np.cumsum(pca.explained_variance_ratio_)
        n_components_95 = np.argmax(explained_variance >= 0.95) + 1
        
        print(f"\nPCA Results:")
        print(f"  Total features: {X_scaled.shape[1]}")
        print(f"  Features needed for 95% variance: {n_components_95}")
        print(f"  Variance reduction: {(1 - n_components_95/X_scaled.shape[1])*100:.1f}%")
        
        # Top 5 important components
        print(f"\nTop 5 Principal Components:")
        for i in range(min(5, len(pca.explained_variance_ratio_))):
            print(f"  PC{i+1}: {pca.explained_variance_ratio_[i]:.2%} variance")
        
        # Feature correlations
        corr_matrix = pd.DataFrame(X_scaled, columns=feature_cols).corr()
        
        if plot:
            self._plot_feature_analysis(explained_variance, pca, feature_cols, 
                                       X_scaled, corr_matrix)
        
        self.reports['features'] = {
            'pca': pca,
            'n_components_95': n_components_95,
            'explained_variance': explained_variance,
            'correlations': corr_matrix
        }
        
        return {'n_components': n_components_95, 'variance_reduction': 
                (1 - n_components_95/X_scaled.shape[1])*100}
    
    def _plot_feature_analysis(self, explained_variance, pca, feature_cols, 
                              X_scaled, corr_matrix):
        """Visualize feature analysis"""
        fig = plt.figure(figsize=(16, 10))
        fig.suptitle(f'{self.symbol} - Feature Analysis & PCA', fontsize=16, fontweight='bold')
        
        gs = fig.add_gridspec(2, 2, hspace=0.35, wspace=0.35)
        
        # 1. Explained Variance
        ax1 = fig.add_subplot(gs[0, 0])
        ax1.plot(range(1, len(explained_variance) + 1), explained_variance, 'bo-', linewidth=2)
        ax1.axhline(y=0.95, color='r', linestyle='--', label='95% threshold')
        n_95 = np.argmax(explained_variance >= 0.95) + 1
        ax1.axvline(x=n_95, color='g', linestyle='--', label=f'Need {n_95} features')
        ax1.set_xlabel('Number of Components')
        ax1.set_ylabel('Cumulative Explained Variance')
        ax1.set_title('PCA: Variance Explained\n(How many features do we really need?)', fontweight='bold')
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # 2. Individual Variance
        ax2 = fig.add_subplot(gs[0, 1])
        ax2.bar(range(1, min(11, len(pca.explained_variance_ratio_) + 1)), 
               pca.explained_variance_ratio_[:10], color='steelblue', alpha=0.8)
        ax2.set_xlabel('Principal Component')
        ax2.set_ylabel('Variance Explained')
        ax2.set_title('Individual PC Contribution\n(Which components matter?)', fontweight='bold')
        ax2.grid(True, alpha=0.3, axis='y')
        
        # 3. Feature Loadings
        ax3 = fig.add_subplot(gs[1, 0])
        loadings = pca.components_[:2].T * np.sqrt(pca.explained_variance_[:2])
        
        for i, feature in enumerate(feature_cols):
            ax3.arrow(0, 0, loadings[i, 0], loadings[i, 1], 
                     head_width=0.05, head_length=0.05, fc='steelblue', ec='steelblue', alpha=0.7)
            ax3.text(loadings[i, 0]*1.15, loadings[i, 1]*1.15, feature, 
                    fontsize=8, ha='center', va='center')
        
        ax3.set_xlim(-1, 1)
        ax3.set_ylim(-1, 1)
        ax3.set_xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%})')
        ax3.set_ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%})')
        ax3.set_title('Feature Loading Space\n(Which features contribute to PCs?)', fontweight='bold')
        ax3.grid(True, alpha=0.3)
        ax3.axhline(y=0, color='k', linewidth=0.5)
        ax3.axvline(x=0, color='k', linewidth=0.5)
        
        # 4. Correlation Matrix
        ax4 = fig.add_subplot(gs[1, 1])
        im = ax4.imshow(corr_matrix, cmap='coolwarm', aspect='auto', vmin=-1, vmax=1)
        ax4.set_xticks(range(len(feature_cols)))
        ax4.set_yticks(range(len(feature_cols)))
        ax4.set_xticklabels(feature_cols, rotation=45, ha='right', fontsize=8)
        ax4.set_yticklabels(feature_cols, fontsize=8)
        ax4.set_title('Feature Correlation Matrix\n(Which indicators move together?)', fontweight='bold')
        plt.colorbar(im, ax=ax4, label='Correlation')
        
        plt.savefig('reports/feature_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()
        print("✅ Saved: reports/feature_analysis.png")
    
    # ============================================================================
    # 5. DECISION TREE INTERPRETATION (Unit V)
    # ============================================================================
    
    def explain_trading_rules(self, plot=True):
        """
        Use Decision Tree to extract interpretable trading rules
        ML Concept: Decision Trees, Feature Importance, Decision Rules
        Stock Insight: "What are the simple rules for predicting stock movement?"
        """
        print("\n" + "="*60)
        print("📋 INTERPRETABLE TRADING RULES (Decision Tree)")
        print("="*60)
        
        from sklearn.tree import DecisionTreeClassifier, plot_tree
        
        # Prepare data
        feature_cols = [col for col in self.df.columns 
                       if col not in ['Close', 'Date', 'Target', 'Cluster']]
        X = self.df[feature_cols].fillna(0).replace([np.inf, -np.inf], 0)
        y = self.df['Target']
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train shallow decision tree for interpretability
        dt = DecisionTreeClassifier(max_depth=4, random_state=42)
        dt.fit(X_train_scaled, y_train)
        
        accuracy = dt.score(X_test_scaled, y_test)
        
        print(f"\nDecision Tree Accuracy: {accuracy:.2%}")
        print("\nTop Decision Rules (from feature importance):")
        
        importances = dt.feature_importances_
        indices = np.argsort(importances)[-5:]
        
        for i, idx in enumerate(reversed(indices)):
            feature = feature_cols[idx]
            importance = importances[idx]
            print(f"  {i+1}. {feature}: {importance:.4f}")
        
        if plot:
            self._plot_decision_tree(dt, feature_cols, importances)
        
        self.reports['decision_tree'] = {
            'model': dt,
            'accuracy': accuracy,
            'feature_importance': importances
        }
        
        return {'accuracy': accuracy, 'interpretable': True}
    
    def _plot_decision_tree(self, dt, feature_cols, importances):
        """Visualize decision tree"""
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 8))
        fig.suptitle(f'{self.symbol} - Interpretable Trading Rules', fontsize=16, fontweight='bold')
        
        # Tree visualization
        plot_tree(dt, feature_names=feature_cols, 
                 class_names=['DOWN', 'UP'],
                 filled=True, ax=ax1, fontsize=8)
        ax1.set_title('Decision Tree\n(If-Then rules for trading)', fontweight='bold')
        
        # Feature importance
        indices = np.argsort(importances)[-10:]
        ax2.barh(range(len(indices)), importances[indices], color='steelblue', alpha=0.8)
        ax2.set_yticks(range(len(indices)))
        ax2.set_yticklabels([feature_cols[i] for i in indices])
        ax2.set_xlabel('Importance Score')
        ax2.set_title('Feature Importance for Trading Rules\n(Which conditions matter?)', fontweight='bold')
        ax2.grid(True, alpha=0.3, axis='x')
        
        plt.savefig('reports/decision_tree.png', dpi=300, bbox_inches='tight')
        plt.show()
        print("✅ Saved: reports/decision_tree.png")
    
    # ============================================================================
    # 6. COMPREHENSIVE DASHBOARD
    # ============================================================================
    
    def generate_full_report(self):
        """Generate comprehensive ML-driven stock analysis report"""
        print("\n" + "="*60)
        print("📊 GENERATING COMPREHENSIVE STOCK ANALYSIS REPORT")
        print("="*60)
        
        # Run all analyses
        self.predict_stock_price()
        self.predict_stock_direction()
        self.analyze_stock_patterns()
        self.analyze_feature_relationships()
        self.explain_trading_rules()
        
        # Create summary report
        self._create_summary_report()
    
    def _create_summary_report(self):
        """Create text summary of all findings"""
        print("\n" + "="*60)
        print("📋 STOCK ANALYSIS SUMMARY")
        print("="*60)
        
        print("\n✅ Price Prediction (Regression):")
        if 'price_predictions' in self.reports:
            results = self.reports['price_predictions']['results']
            for model, metrics in results.items():
                print(f"   {model}: R²={metrics['r2']:.4f}")
        
        print("\n✅ Direction Prediction (Classification):")
        if 'direction' in self.reports:
            print(f"   F1-Score: {self.reports['direction']['f1']:.4f}")
        
        print("\n✅ Pattern Discovery (Clustering):")
        if 'clustering' in self.reports:
            print(f"   Optimal patterns found: {self.reports['clustering']['optimal_k']}")
        
        print("\n✅ Feature Analysis (PCA):")
        if 'features' in self.reports:
            n_comp = self.reports['features']['n_components_95']
            print(f"   Features reduced from {self.reports['features']['explained_variance'].shape[0]} to {n_comp}")
        
        print("\n✅ Trading Rules (Decision Tree):")
        if 'decision_tree' in self.reports:
            acc = self.reports['decision_tree']['accuracy']
            print(f"   Rule accuracy: {acc:.2%}")
        
        print("\n" + "="*60)
        print("📁 All visualizations saved to: reports/")
        print("="*60)


# =============================================================================
# USAGE EXAMPLE
# =============================================================================

if __name__ == "__main__":
    # This would be used after loading stock data
    print("StockInsightAnalyzer ready to use")
    print("\nUsage example:")
    print("  analyzer = StockInsightAnalyzer(df, symbol='AAPL')")
    print("  analyzer.generate_full_report()")
