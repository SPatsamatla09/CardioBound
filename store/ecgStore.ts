import { create } from "zustand";

const MAX_SAMPLES = 500;

interface ECGState {
  samples: number[];
  riskLevel: "low" | "medium" | "high" | null;
  detectedLabel: string | null;
  confidence: number | null;
  isStreaming: boolean;
  appendSample: (value: number) => void;
  appendBatch: (values: number[]) => void;
  setRiskLevel: (level: "low" | "medium" | "high", label: string, conf?: number) => void;
  setStreaming: (streaming: boolean) => void;
  reset: () => void;
}

export const useECGStore = create<ECGState>((set) => ({
  samples: [],
  riskLevel: null,
  detectedLabel: null,
  confidence: null,
  isStreaming: false,
  appendSample: (value) =>
    set((state) => ({
      samples: state.samples.length >= MAX_SAMPLES
        ? [...state.samples.slice(1), value]
        : [...state.samples, value],
    })),
  appendBatch: (values) =>
    set((state) => {
      const combined = [...state.samples, ...values];
      return { samples: combined.length > MAX_SAMPLES ? combined.slice(combined.length - MAX_SAMPLES) : combined };
    }),
  setRiskLevel: (level, label, conf) =>
    set({ riskLevel: level, detectedLabel: label, confidence: conf ?? null }),
  setStreaming: (streaming) => set({ isStreaming: streaming }),
  reset: () => set({ samples: [], riskLevel: null, detectedLabel: null, confidence: null }),
}));
