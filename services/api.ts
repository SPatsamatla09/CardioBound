import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5000";

const client = axios.create({ baseURL: BASE_URL, timeout: 10_000, headers: { "Content-Type": "application/json" } });

export const predictArrhythmia = async (ecgSignal: number[]) => {
  const { data } = await client.post("/api/predict/arrhythmia", { ecg_signal: ecgSignal });
  return data;
};

export const getRiskScore = async (uid: string) => {
  const { data } = await client.get(`/api/predict/risk/${uid}`);
  return data;
};
