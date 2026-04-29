import yfinance as yf
import warnings

warnings.filterwarnings("ignore")

def fetch_stock_data(ticker, period="2y"):
    df = yf.download(ticker, period=period, auto_adjust=True)

    if hasattr(df.columns, "levels"):
        df.columns = df.columns.get_level_values(0)

    df.dropna(inplace=True)
    return df