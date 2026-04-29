import pandas as pd
from ta.momentum import RSIIndicator
from ta.trend import MACD, EMAIndicator
from ta.volatility import BollingerBands


def add_features(df):
    df = df.copy()

    df["RSI"] = RSIIndicator(close=df["Close"]).rsi()

    macd = MACD(close=df["Close"])
    df["MACD"] = macd.macd()
    df["MACD_signal"] = macd.macd_signal()

    df["EMA"] = EMAIndicator(close=df["Close"], window=20).ema_indicator()

    bb = BollingerBands(close=df["Close"])
    df["BB_high"] = bb.bollinger_hband()
    df["BB_low"] = bb.bollinger_lband()

    df["SMA_10"] = df["Close"].rolling(10).mean()
    df["SMA_50"] = df["Close"].rolling(50).mean()
    df["Momentum"] = df["Close"] - df["Close"].shift(5)
    df["Volatility"] = df["Close"].rolling(10).std()
    df["Volume_Change"] = df["Volume"].pct_change()

    df.dropna(inplace=True)
    return df


def create_target(df):
    df = df.copy()

    df["Future_Close"] = df["Close"].shift(-1)
    df["Return"] = (df["Future_Close"] - df["Close"]) / df["Close"]

    threshold = 0.005

    df["Target"] = 0
    df.loc[df["Return"] > threshold, "Target"] = 1

    df = df[abs(df["Return"]) > 0.003]

    df.dropna(inplace=True)
    return df