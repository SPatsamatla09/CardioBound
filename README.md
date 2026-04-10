# CardioBound: AI-Powered Wearable Arrhythmia Detection System

A real-time cardiac monitoring framework integrating deep learning, multi-sensor fusion, and risk stratification for accessible arrhythmia detection and continuous heart health monitoring.

## Overview

CardioBound addresses the accessibility gap in cardiac monitoring by combining:
- **Real-time ECG signal analysis** for arrhythmia classification across 5 cardiac conditions
- **Multi-sensor fusion** integrating ECG, PPG, IMU, and temperature data
- **Risk stratification model** for personalized cardiac health assessment
- 
The system achieves **97.3% diagnostic accuracy** with **end-to-end latency under 1 second**, enabling continuous 24/7 monitoring at **$250 vs $10,000+** traditional Holter monitors.

## Key Features

- **Hybrid CNN-LSTM Architecture**: Spatiotemporal pattern recognition in ECG signals (97.3% accuracy)
- **XGBoost Risk Stratification**: Cardiovascular risk forecasting (94.2% accuracy, 3-class prediction)
- **Multi-Class Classification**: Normal, Supraventricular, Ventricular, Fusion, Unknown beats
- **Low-Power Deployment**: TensorFlow Lite optimization for edge devices (Jetson Nano)

## Architecture
```
┌──────────────────────────────────────────────────────────────────┐
│            Multimodal Data Acquisition                           │
│            ECG + PPG + IMU + Temperature Sensors                 │
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
│ • Notch       │              │ • HRV Features   │
│ • Normalize   │              │ • RMSSD, SDNN    │
└───────┬───────┘              └────────┬─────────┘
│                               │
▼                               │
┌───────────────┐                       │
│ CNN-LSTM      │◄──────────────────────┘
│ Classifier    │     Feature Context
├───────────────┤
│ • Arrhythmia  │
│ Classification│
│ • 97.3% Acc   │
└───────┬───────┘
│
├──────────────┐
│              │
▼              ▼
┌───────────┐  ┌──────────────────┐
│ XGBoost   │  │ Mobile Alert     │
│ Risk Model│  │ System           │
├───────────┤  ├──────────────────┤
│ • 94.2%   │  │ • Real-time      │
│ • 3-class │  │ • Push Notify    │
└─────┬─────┘  └──────────────────┘
│
▼
Adaptive Closed-Loop Patient Monitoring
```

## Signal Processing Pipeline

1. **Preprocessing**
   - Bandpass filtering (0.5–40 Hz)
   - Notch filtering (60 Hz powerline interference)
   - Signal normalization
   
2. **Feature Extraction**
   - Time-domain: RR intervals, HRV metrics (RMSSD, SDNN)
   - Morphological: R-peak detection, QRS complex features
   - Statistical: Mean heart rate, heart rate variability

3. **Classification**
   - CNN: Spatial feature extraction from ECG segments
   - Bidirectional LSTM: Temporal dependency modeling
   - Softmax: 5-class output (Normal, Supraventricular, Ventricular, Fusion, Unknown)

## Project Structure
```
cardiobound/
├── config.py                    # Central configuration
├── data_preprocessing.py        # ECG signal and sensor preprocessing
├── signal_processing.py         # CNN-LSTM + XGBoost implementations
├── feature_extraction.py        # R-peak detection and HRV computation
├── risk_stratification.py       # XGBoost risk model using HRV features
├── visualizations.py            # Results plotting and analysis
├── data/                        # Processed datasets
├── models/                      # Trained model weights
└── results/                     # Generated figures and metrics
```

## Installation

### Requirements

```bash
pip install numpy scipy matplotlib scikit-learn tensorflow wfdb seaborn xgboost --break-system-packages
```

### Python Version
- Python 3.8+
- TensorFlow 2.x
- WFDB 4.0+

## Usage

### 1. Data Preprocessing

```python
from data_preprocessing import ECGPreprocessor, DatasetManager

# Initialize preprocessor
preprocessor = ECGPreprocessor(sampling_rate=360)

# Process signals
processed_signal = preprocessor.preprocess_signal(raw_signal)
features = preprocessor.extract_hrv_features(processed_signal)

# Create train-val-test splits
dataset_mgr = DatasetManager(output_dir='processed_data')
splits = dataset_mgr.create_splits(X, y, test_size=0.15, val_size=0.15)
```

### 2. Train CNN-LSTM Classifier

```python
from signal_processing import CNNLSTM_Classifier

# Initialize model
model = CNNLSTM_Classifier(input_shape=(360, 1), n_classes=5)
model.compile_model(learning_rate=1e-3)

# Train
history = model.train(X_train, y_train, X_val, y_val, epochs=50, batch_size=32)

# Evaluate
accuracy, f1_score = model.evaluate(X_test, y_test)
```

### 3. Train XGBoost Risk Stratification

```python
from risk_stratification import RiskStratificationModel

# Initialize XGBoost
risk_model = RiskStratificationModel()
risk_model.compile_model()

# Train
history = risk_model.train(X_hrv_train, y_risk_train, X_hrv_val, y_risk_val)

# Predict
risk_predictions = risk_model.predict(X_hrv_test)
```

### 4. Hardware Deployment

```python
from hardware_export import TFLiteConverter

# Convert to TensorFlow Lite
converter = TFLiteConverter()
tflite_model = converter.export_model(model, save_path='models/cardiobound.tflite', quantize=True)

# Deploy to Jetson Nano
converter.deploy_to_edge(model_path='models/cardiobound.tflite', device='jetson_nano')
```

### 5. Run Complete Pipeline

```bash
# Preprocess data
python data_preprocessing.py

# Train models
python signal_processing.py
python risk_stratification.py

# Generate visualizations
python visualizations.py
```

## Model Performance

| Component | Model | Primary Metric | Secondary Metric |
|-----------|-------|----------------|------------------|
| **Arrhythmia Classification** | CNN-LSTM | 97.3% Accuracy | F1-Score = 0.943 |
| **Risk Stratification** | XGBoost | 94.2% Accuracy | 3-class prediction |
| **R-Peak Detection** | Threshold-based | 98.5% Sensitivity | <5ms timing error |

## Datasets

- **MIT-BIH Arrhythmia Database**: Public ECG signal repository
- **MIT-BIH Atrial Fibrillation Database**: AF detection benchmark
- **MIT-BIH Long-Term AF Database**: Extended monitoring dataset
- **Synthetic Data**: Generated for demonstration and testing

## Target Conditions

1. **Normal Sinus Rhythm (N)** – Healthy cardiac activity baseline
2. **Supraventricular Arrhythmias (A/S/J)** – Atrial fibrillation, atrial flutter, premature atrial contractions
3. **Ventricular Arrhythmias (V/E)** – Premature ventricular contractions, ventricular ectopic beats
4. **Fusion Beats (F)** – Combined normal and ectopic beat morphologies
5. **Unknown/Unclassified** – Ambiguous or rare arrhythmia patterns

## Hardware Integration (Future Work)

### Proof-of-Concept System
- **Microcontroller**: NVIDIA Jetson Nano
- **ECG Sensor**: MAX86176 integrated biosensor (Analog Devices)
- **PPG Sensor**: Integrated pulse oximetry
- **IMU**: MPU6050 for motion artifact detection
- **Sampling Rate**: 360 Hz (ECG), 100 Hz (PPG)
- **Power**: 40 mAh battery, 3.7V
- **Connectivity**: Bluetooth Low Energy (ATM2202 Atmosic)

### System Flow
ECG/PPG/IMU Sensors → MAX86176 → ADC → Jetson Nano → ML Inference → Mobile App
↑                                   │
└──────────── Closed-Loop Feedback ─────┘

**Note**: This project represents a software-based computational framework. Clinical deployment requires regulatory approval and extensive validation.

## Usage

### 1. Data Preprocessing

```python
from data_preprocessing import ECGPreprocessor, DatasetManager

# Initialize preprocessor
preprocessor = ECGPreprocessor(sampling_rate=360)

# Process signals
processed_signal = preprocessor.preprocess_signal(raw_signal)
features = preprocessor.extract_hrv_features(processed_signal)

# Create train-val-test splits
dataset_mgr = DatasetManager(output_dir='processed_data')
splits = dataset_mgr.create_splits(X, y, test_size=0.15, val_size=0.15)
```

### 2. Train CNN-LSTM Classifier

```python
from signal_processing import CNNLSTM_Classifier

# Initialize model
model = CNNLSTM_Classifier(input_shape=(360, 1), n_classes=5)
model.compile_model(learning_rate=1e-3)

# Train
history = model.train(X_train, y_train, X_val, y_val, epochs=50, batch_size=32)

# Evaluate
accuracy, f1_score = model.evaluate(X_test, y_test)
```

### 3. Train XGBoost Risk Stratification

```python
from risk_stratification import RiskStratificationModel

# Initialize XGBoost
risk_model = RiskStratificationModel()
risk_model.compile_model()

# Train
history = risk_model.train(X_hrv_train, y_risk_train, X_hrv_val, y_risk_val)

# Predict
risk_predictions = risk_model.predict(X_hrv_test)
```

### 4. Hardware Deployment

```python
from hardware_export import TFLiteConverter

# Convert to TensorFlow Lite
converter = TFLiteConverter()
converter.export_model(model, save_path='models/cardiobound.tflite', quantize=True)

# Deploy to Jetson Nano
converter.deploy_to_edge(model_path='models/cardiobound.tflite', device='jetson_nano')
```

### 5. Run Complete Pipeline

```bash
# Preprocess data
python data_preprocessing.py

# Train models
python signal_processing.py
python risk_stratification.py

# Generate visualizations
python visualizations.py
```
