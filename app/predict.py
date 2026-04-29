import joblib
import os
from app.data_fetcher import fetch_stock_data
from app.features import add_features, create_target

# 🔥 LOAD MODELS (only once when file is imported)
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
rf = joblib.load(os.path.join(MODEL_DIR, "rf.pkl"))
lr = joblib.load(os.path.join(MODEL_DIR, "lr.pkl"))
svm = joblib.load(os.path.join(MODEL_DIR, "svm.pkl"))
scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))


def predict_stock(ticker="AAPL"):
    try:
        # 🔹 fetch data
        df = fetch_stock_data(ticker)

        if df.empty:
            return {"error": "Invalid ticker or no data"}

        # 🔹 add features
        df = add_features(df)
        df = create_target(df)

        if df.empty:
            return {"error": "Not enough data"}

        # 🔹 features used during training
        features = [
            "RSI", "MACD", "MACD_signal", "EMA",
            "BB_high", "BB_low",
            "SMA_10", "SMA_50",
            "Momentum", "Volatility", "Volume_Change"
        ]

        X = df[features]

        # clean
        X = X.replace([float("inf"), -float("inf")], 0)
        X = X.fillna(0)

        # 🔥 ONLY TAKE LATEST DATA (NO TRAINING)
        latest = scaler.transform(X.iloc[-1:])

        # 🔹 predictions
        rf_prob = rf.predict_proba(latest)[0][1]
        lr_prob = lr.predict_proba(latest)[0][1]
        svm_prob = svm.predict_proba(latest)[0][1]

        # 🔹 ensemble
        avg_prob = (rf_prob + lr_prob + svm_prob) / 3
        final = 1 if avg_prob > 0.55 else 0

        return {
            "RF_prob": float(round(rf_prob, 3)),
            "LR_prob": float(round(lr_prob, 3)),
            "SVM_prob": float(round(svm_prob, 3)),
            "Confidence": float(round(avg_prob * 100, 2)),
            "Prediction": "UP 📈" if final == 1 else "DOWN 📉"
        }

    except Exception as e:
        return {"error": str(e)}