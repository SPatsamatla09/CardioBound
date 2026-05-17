import { useEffect, useRef } from "react";
import { useECGStore } from "../store/ecgStore";
import { logArrhythmiaEvent } from "../services/firebase";
import { useUserStore } from "../store/userStore";

const WS_URL = process.env.EXPO_PUBLIC_WS_URL ?? "ws://localhost:5000/ecg-stream";

export function useECGStream() {
  const ws = useRef<WebSocket | null>(null);
  const { appendBatch, setRiskLevel, setStreaming } = useECGStore();
  const { user } = useUserStore();

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);
    ws.current.onopen = () => setStreaming(true);
    ws.current.onmessage = (event: MessageEvent) => {
      const payload = JSON.parse(event.data as string);
      appendBatch(payload.samples);
      if (payload.risk && payload.risk !== "low" && payload.label) {
        setRiskLevel(payload.risk, payload.label, payload.confidence);
        if (user && payload.ecg_snapshot) {
          logArrhythmiaEvent(user.uid, {
            label: payload.label,
            confidence: payload.confidence ?? 0,
            risk: payload.risk,
            ecgSnapshot: payload.ecg_snapshot,
          }).catch(console.error);
        }
      }
    };
    ws.current.onclose = () => setStreaming(false);
    ws.current.onerror = () => setStreaming(false);
    return () => ws.current?.close();
  }, []);
}
