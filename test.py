from app.data_fetcher import fetch_stock_data
from app.features import add_features, create_target

df = fetch_stock_data("AAPL")
df = add_features(df)
df = create_target(df)

print(df.tail())