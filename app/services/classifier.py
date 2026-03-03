import joblib
import json
from pathlib import Path
from app.services.rules import rule_engine

MODEL = None
VECTORIZER = None
LABEL_MAP = None

BASE_DIR = Path(__file__).resolve().parent.parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"

CONF_THRESHOLD = 0.60


def load_artifacts():
    global MODEL, VECTORIZER, LABEL_MAP

    MODEL = joblib.load(ARTIFACTS_DIR / "model.joblib")
    VECTORIZER = joblib.load(ARTIFACTS_DIR / "vectorizer.joblib")

    with open(ARTIFACTS_DIR / "label_map.json", "r") as f:
        LABEL_MAP = json.load(f)


def predict_text(text: str):
    if MODEL is None:
        raise RuntimeError("Artifacts not loaded.")

    
    rule_result = rule_engine(text)
    if rule_result is not None:
        return rule_result

    
    vector = VECTORIZER.transform([text])
    probs = MODEL.predict_proba(vector)[0]

    max_prob = max(probs)
    pred_index = probs.argmax()

    if max_prob < CONF_THRESHOLD:
        return "SUSPICIOUS"

    return LABEL_MAP.get(str(pred_index), "SUSPICIOUS")