from app.data_fetcher import fetch_stock_data
from app.features import add_features

from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split


def predict_price(ticker="AAPL"):
    try:
        df = fetch_stock_data(ticker)

        if df.empty:
            return {"error": "Invalid ticker"}

        df = add_features(df)

        # 🔥 target = next day price
        df["Future_Close"] = df["Close"].shift(-1)
        df.dropna(inplace=True)

        features = [
            "RSI", "MACD", "MACD_signal", "EMA",
            "BB_high", "BB_low",
            "SMA_10", "SMA_50",
            "Momentum", "Volatility", "Volume_Change"
        ]

        X = df[features]
        y = df["Future_Close"]

        # clean
        X = X.replace([float("inf"), -float("inf")], 0)
        X = X.fillna(0)

        # split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, shuffle=False
        )

        # scale
        scaler = StandardScaler()
        X_train = scaler.fit_transform(X_train)

        # model
        model = RandomForestRegressor(n_estimators=200, max_depth=10)
        model.fit(X_train, y_train)

        # latest data
        latest = scaler.transform(X.iloc[-1:])
        predicted_price = model.predict(latest)[0]

        current_price = df["Close"].iloc[-1]

        change = ((predicted_price - current_price) / current_price) * 100

        return {
    "Current_Price": float(round(current_price, 2)),
    "Predicted_Price": float(round(predicted_price, 2)),
    "Expected_Change": float(round(change, 2))   # ✅ NO %
}

    except Exception as e:
        return {"error": str(e)}