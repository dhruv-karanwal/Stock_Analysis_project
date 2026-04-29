import joblib
from app.data_fetcher import fetch_stock_data
from app.features import add_features, create_target

from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC

import os

os.makedirs("models", exist_ok=True)

ticker = "AAPL"

df = fetch_stock_data(ticker)
df = add_features(df)
df = create_target(df)

features = [
    "RSI", "MACD", "MACD_signal", "EMA",
    "BB_high", "BB_low",
    "SMA_10", "SMA_50",
    "Momentum", "Volatility", "Volume_Change"
]

X = df[features]
y = df["Target"]

# clean
X = X.replace([float("inf"), -float("inf")], 0).fillna(0)

# scale
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# models
rf = RandomForestClassifier(n_estimators=200, max_depth=8)
lr = LogisticRegression(max_iter=1000)
svm = SVC(probability=True)

rf.fit(X_scaled, y)
lr.fit(X_scaled, y)
svm.fit(X_scaled, y)

# save everything
joblib.dump(rf, "models/rf.pkl")
joblib.dump(lr, "models/lr.pkl")
joblib.dump(svm, "models/svm.pkl")
joblib.dump(scaler, "models/scaler.pkl")

print("✅ Models saved in /models folder")