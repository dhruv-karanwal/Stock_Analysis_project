from app.predict import predict_stock

STOCKS = [
    "AAPL", "TSLA", "GOOGL", "MSFT",
    "RELIANCE.NS", "INFY.NS", "HDFCBANK.NS", "TCS.NS"
]


def get_strength(conf):
    if conf >= 60:
        return "Strong 💪"
    elif conf >= 50:
        return "Moderate ⚖️"
    else:
        return "Weak ⚠️"


def compute_predictions():
    results = []

    for ticker in STOCKS:
        try:
            data = predict_stock(ticker)

            if "error" in data:
                continue

            results.append({
                "Ticker": ticker,
                "Prediction": data["Prediction"],
                "Confidence": data["Confidence"],
                "Strength": get_strength(data["Confidence"])
            })

        except:
            continue

    results = sorted(results, key=lambda x: x["Confidence"], reverse=True)
    return results


def get_all_predictions():
    return compute_predictions()


def get_top_picks():
    return compute_predictions()[:3]