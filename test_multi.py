from app.multi_predict import get_all_predictions, get_top_picks

print("\n=== ALL STOCKS ===")
for stock in get_all_predictions():
    print(stock)

print("\n=== TOP PICKS ===")
for stock in get_top_picks():
    print(stock)