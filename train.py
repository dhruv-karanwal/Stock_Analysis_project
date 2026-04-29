from app.data_fetcher import fetch_stock_data
from app.features import add_features, create_target

from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report
from sklearn.model_selection import TimeSeriesSplit

from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC


# 1. Load data
df = fetch_stock_data("AAPL")
df = add_features(df)
df = create_target(df)

# 2. Features
features = [
    "RSI", "MACD", "MACD_signal", "EMA",
    "BB_high", "BB_low",
    "SMA_10", "SMA_50",
    "Volume_Change",
    "Momentum",        # ✅ Fixed name
    "Volatility"
]

X = df[features]
y = df["Target"]

# Check class balance
print(f"Class balance → 0: {(y==0).sum()}  1: {(y==1).sum()}")

# Clean data
X = X.replace([float("inf"), -float("inf")], 0)
X = X.fillna(0)

# 3. Models
models = {
    "Random Forest": RandomForestClassifier(
        n_estimators=300,
        max_depth=8,
        class_weight="balanced",
        random_state=42
    ),
    "Logistic Regression": LogisticRegression(
        class_weight="balanced",
        max_iter=1000,
        random_state=42
    ),
    "SVM": SVC(
        class_weight="balanced",
        kernel="rbf",
        probability=True,
        random_state=42
    )
}

# 4. TimeSeriesSplit
tscv = TimeSeriesSplit(n_splits=5)

for fold, (train_idx, test_idx) in enumerate(tscv.split(X)):
    print(f"\n====== FOLD {fold+1} ======")

    X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
    y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]

    # Scale
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test  = scaler.transform(X_test)

    for name, model in models.items():
        print(f"\n{name}")
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        print(classification_report(y_test, preds, zero_division=0))