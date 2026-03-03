from fastapi import APIRouter, HTTPException
from app.schemas.request_schema import PredictRequest
from app.services.classifier import predict_text

router = APIRouter()

@router.post("/predict")
def predict(req: PredictRequest):
    text = req.text.strip()

    if not text:
        raise HTTPException(status_code=400, detail="Empty text")

    label = predict_text(text)

    return {"label": label}