import os
import joblib
from typing import Tuple

MODEL_PATH = 'apps/spam_detector/spam_model.pkl'
VECTORIZER_PATH = 'apps/spam_detector/vectorizer.pkl'

_model, _vectorizer = None, None

def load_assets() -> Tuple[object, object]:
    global _model, _vectorizer
    if _model is None or _vectorizer is None:
        if not (os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH)):
            raise FileNotFoundError("Model or vectorizer not found.")
        _model = joblib.load(MODEL_PATH)
        _vectorizer = joblib.load(VECTORIZER_PATH)
    return _model, _vectorizer

def predict_spam(email: str) -> bool:
    model, vectorizer = load_assets()
    return model.predict(vectorizer.transform([email]))[0] == 1
