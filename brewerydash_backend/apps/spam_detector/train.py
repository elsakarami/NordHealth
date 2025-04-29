import os
import logging
from typing import Tuple
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics import accuracy_score
import joblib


BASE_DIR = 'apps/spam_detector'
MODEL_PATH = os.path.join(BASE_DIR, 'spam_model.pkl')
VECTORIZER_PATH = os.path.join(BASE_DIR, 'vectorizer.pkl')
DATA_PATH = os.path.join(BASE_DIR, 'spam_data.csv')


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_data(path: str) -> Tuple[pd.Series, pd.Series]:
    df = pd.read_csv(path)
    return df['email'], df['label']

def train_spam_model() -> None:
    X, y = load_data(DATA_PATH)
    vectorizer = CountVectorizer(max_features=1000)
    X_vect = vectorizer.fit_transform(X)
    X_train, X_test, y_train, y_test = train_test_split(X_vect, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier()
    model.fit(X_train, y_train)

    acc = accuracy_score(y_test, model.predict(X_test))
    joblib.dump(model, MODEL_PATH)
    joblib.dump(vectorizer, VECTORIZER_PATH)

    logger.info(f"Model trained! Accuracy: {acc:.2f}")

if __name__ == '__main__':
    train_spam_model()
