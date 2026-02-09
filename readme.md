# FraudShield

FraudShield is a learning project focused on detecting fraudulent SMS messages
using a hybrid rule-based and machine learning approach.

The system exposes a FastAPI backend that classifies messages into
SAFE, SUSPICIOUS, or FRAUD categories. The backend is consumed by an Android
application and a lightweight web demo.

## Architecture Overview

- **Backend**: FastAPI service with a hybrid detection pipeline
  - Rule-based checks (URLs, suspicious patterns, homoglyph indicators)
  - Machine learning model (Logistic Regression)
- **Clients**:
  - Android app using NotificationListenerService
  - Web demo built with plain HTML, CSS, and JavaScript
- **API**:
  - `POST /predict` → returns a plain-text label (SAFE / SUSPICIOUS / FRAUD)

## Web Demo

A minimal web interface is included to demonstrate the end-to-end flow.
Users can paste an SMS message and view the prediction result by calling
the same public backend API used by the Android app.

The web demo is simple and framework-free to keep the focus
on backend integration and system flow.

## Notes

- This project is intended as a learning and demonstration exercise.
- The backend API is public for demo purposes and does not handle sensitive data.
- The system is not production-hardened.
