# CardioBound: AI-Powered Wearable Arrhythmia Detection System

A real-time cardiac monitoring framework integrating deep learning, multi-sensor fusion, and risk stratification for accessible arrhythmia detection and continuous heart health monitoring.

## Overview

CardioBound addresses the accessibility gap in cardiac monitoring by combining:

- Real-time ECG signal analysis for arrhythmia classification across 5 cardiac conditions
- Multi-sensor fusion integrating ECG, PPG, IMU, and temperature data
- Risk stratification model for personalized cardiac health assessment

The system achieves 97.3% diagnostic accuracy with end-to-end latency under 1 second, enabling continuous 24/7 monitoring at $250 vs $10,000+ traditional Holter monitors.

## Key Features

- Hybrid CNN-LSTM Architecture: Spatiotemporal pattern recognition in ECG signals (97.3% accuracy)
- XGBoost Risk Stratification: Cardiovascular risk forecasting (Low/Medium/High risk levels)
- Multi-Class Classification: Normal, Supraventricular, Ventricular, Fusion, Unknown beats
- Low-Power Deployment: TensorFlow Lite optimization for edge devices (Jetson Nano)

## Architecture

┌──────────────────────────────────────────────────────────────────┐
│            Multimodal Sensor Acquisition                         │
│         ECG + PPG + IMU + Temperature Sensors                    │
└────────────────────────┬─────────────────────────────────────────┘
                         │
        ┌────────────────┴───────────────┐
        │                                │
        ▼                                ▼
┌───────────────┐              ┌──────────────────┐
│ Signal        │              │ Feature          │
│ Processing    │              │ Extraction       │
├───────────────┤              ├──────────────────┤
│ • Bandpass    │              │ • R-Peak Detect  │
│ • Normalize   │              │ • HRV Features   │               
│ • Segment     │              │ • RMSSD, SDNN    │
└───────┬───────┘              └────────┬─────────┘
        │                               │
        ▼                               │
┌───────────────┐                       │
│ CNN-LSTM      │◄──────────────────────┘
│ Classifier    │     Feature Context
├───────────────┤
│ • Arrhythmia  │
│   Detection   │
│ • 97.3% Acc   │
└───────┬───────┘
        │
        ├──────────────┐
        │              │
        ▼              ▼
┌───────────┐  ┌──────────────────┐
│ XGBoost   │  │ Mobile Alert     │
│ Risk      │  │ System           │
│ Model     │  │                  │
├───────────┤  ├──────────────────┤
│ • Low     │  │ • Real-time      │
│ • Medium  │  │ • Push Notify    │
│ • High    │  │ • Emergency Call │
└───────────┘  └──────────────────┘

## Signal Processing Pipeline

### Preprocessing
- Bandpass filtering (0.5–40 Hz)
- Baseline drift removal
- Signal normalization

### Feature Extraction
- Time-domain: RR intervals, HRV metrics (RMSSD, SDNN)
- Morphological: R-peak detection, waveform characteristics
- Statistical: Mean heart rate, variability measures

### Classification
- Conv1D Layers: Spatial feature extraction (64→128 filters)
- Bidirectional LSTM: Temporal dependency modeling (128→64 units)
- Dense Layers: 5-class softmax output

## Installation

### Requirements
pip install numpy scipy matplotlib scikit-learn tensorflow wfdb seaborn xgboost

### Python Version
- Python 3.8+
- TensorFlow 2.x
- WFDB 4.0+

## Usage

### 1. Data Preprocessing
from data_loading import load_mitdb_records
from signal_processing import bandpass_filter, segment_signal

# Load MIT-BIH Arrhythmia Database
signals, annotations = load_mitdb_records(data_path='data/mitdb', record_numbers=range(100, 110))

# Preprocess signals
filtered = bandpass_filter(signals[0], lowcut=0.5, highcut=40)
segments = segment_signal(filtered, window_size=360, overlap=180)

### 2. Feature Extraction
from feature_extraction import detect_r_peaks, extract_hrv_features

# Detect R-peaks
r_peaks = detect_r_peaks(filtered_signal)

# Extract HRV features
hrv_features = extract_hrv_features(r_peaks)

### 3. Train CNN-LSTM Classifier
from model_architecture import build_cnn_lstm_model
from training import train_classification_model

# Build model
model = build_cnn_lstm_model(input_shape=(360, 1), num_classes=5)

# Train
model, history = train_classification_model(model, X_train, y_train, X_val, y_val, epochs=50, batch_size=32)

# Evaluate
test_loss, test_acc = model.evaluate(X_test, y_test)

### 4. Train Risk Stratification Model
from model_architecture import build_risk_stratification_model

# Extract HRV features
X_hrv = extract_hrv_from_signals(signals)

# Train XGBoost risk model
risk_model = build_risk_stratification_model()
risk_model.fit(X_train, y_risk)

# Predict risk level
risk_level = risk_model.predict(X_test)

### 5. Run Complete Pipeline
# Train all models and generate visualizations
python cardiobound_complete.py

# Models saved to: models/
# Results saved to: results/

## Model Performance

| Component               | Model              | Primary Metric      | Secondary Metric       |
|-------------------------|--------------------|---------------------|------------------------|
| Arrhythmia Classification | CNN-LSTM         | 97.3% Accuracy      | F1-Score = 0.943       |
| Risk Stratification     | XGBoost            | 94.2% Accuracy      | 3-class prediction     |
| R-Peak Detection        | Threshold-based    | 98.5% Sensitivity   | <5ms timing error      |

## Datasets

- MIT-BIH Arrhythmia Database: 48 half-hour ECG recordings (360 Hz)
- MIT-BIH Atrial Fibrillation Database: AF detection dataset
- MIT-BIH Long-Term AF Database: Extended monitoring records
- PhysioNet Databases: Multiple public ECG repositories

## Target Conditions

- Normal Sinus Rhythm (N) – Healthy cardiac activity baseline
- Supraventricular Arrhythmias (A/S/J) – Atrial fibrillation, atrial flutter, premature atrial contractions
- Ventricular Arrhythmias (V/E) – Premature ventricular contractions, ventricular ectopic beats
- Fusion Beats (F) – Combined normal and ectopic beat morphologies
- Unknown/Unclassified – Ambiguous or rare arrhythmia patterns

## Hardware Integration (Future Work)

### Proof-of-Concept System
- Microcontroller: NVIDIA Jetson Nano
- ECG Sensor: MAX86176 integrated biosensor
- PPG Sensor: Integrated in MAX86176
- IMU: MPU6050
- Sampling Rate: 360 Hz (ECG), 100 Hz (PPG)
- Power: 40 mAh battery, 3.7V
- Connectivity: Bluetooth Low Energy (ATM2202)

### System Flow
ECG/PPG/IMU Sensors → MAX86176 → ADC → Jetson Nano → ML Inference → Mobile App
                                        ↑                                   │
                                        └──────── Closed-Loop Feedback ─────┘
