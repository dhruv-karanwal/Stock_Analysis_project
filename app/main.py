from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from app.predict import predict_stock
from app.multi_predict import get_all_predictions, get_top_picks
from app.regression import predict_price

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 🔥 RESPONSE MODELS

class StockPrediction(BaseModel):
    Ticker: str
    Prediction: str
    Confidence: float
    Strength: str


class SinglePrediction(BaseModel):
    RF_prob: float
    LR_prob: float
    SVM_prob: float
    Confidence: float
    Prediction: str


class PricePrediction(BaseModel):
    Current_Price: float
    Predicted_Price: float
    Expected_Change: float   # ✅ FIXED (no %)


# 🔥 HOME

@app.get("/")
def home():
    return {"message": "StockSense API running 🚀"}


# 🔥 SINGLE STOCK (CLASSIFICATION)

@app.get("/predict/{ticker}", response_model=SinglePrediction)
def single_stock(ticker: str):
    result = predict_stock(ticker.upper())

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result


# 🔥 ALL STOCKS

@app.get("/predict_all", response_model=List[StockPrediction])
def all_stocks():
    return get_all_predictions()


# 🔥 TOP PICKS

@app.get("/top_picks", response_model=List[StockPrediction])
def top_stocks():
    return get_top_picks()


# 🔥 REGRESSION (PRICE PREDICTION)

@app.get("/predict_price/{ticker}", response_model=PricePrediction)
def price_prediction(ticker: str):
    result = predict_price(ticker.upper())

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result


# 🔥 FULL COMBINED OUTPUT (BEST FEATURE)

@app.get("/predict_full/{ticker}")
def full_prediction(ticker: str):
    try:
        cls = predict_stock(ticker.upper())
        reg = predict_price(ticker.upper())

        if "error" in cls:
            raise HTTPException(status_code=400, detail=cls["error"])

        if "error" in reg:
            raise HTTPException(status_code=400, detail=reg["error"])

        return {
            "Prediction": cls["Prediction"],
            "Confidence": cls["Confidence"],
            "Current_Price": reg["Current_Price"],
            "Predicted_Price": reg["Predicted_Price"],
            "Expected_Change": reg["Expected_Change"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))