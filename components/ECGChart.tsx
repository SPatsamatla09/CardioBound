import React, { useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Polyline, Line, Rect } from "react-native-svg";
import { colors } from "../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_HEIGHT = 160;
const CHART_WIDTH = SCREEN_WIDTH - 32;

interface Props {
  samples: number[];
  riskLevel?: "low" | "medium" | "high" | null;
}

export function ECGChart({ samples, riskLevel }: Props) {
  const strokeColor = riskLevel === "high" ? colors.danger : riskLevel === "medium" ? colors.warning : colors.ecgGreen;

  const points = useMemo(() => {
    if (samples.length < 2) return "";
    const step = CHART_WIDTH / (samples.length - 1);
    const min = Math.min(...samples);
    const max = Math.max(...samples);
    const range = max - min || 1;
    return samples.map((v, i) => {
      const x = i * step;
      const y = CHART_HEIGHT - ((v - min) / range) * (CHART_HEIGHT - 20) - 10;
      return `${x},${y}`;
    }).join(" ");
  }, [samples]);

  const gridLines = [0.25, 0.5, 0.75].map((ratio, i) => (
    <Line key={i} x1={0} y1={CHART_HEIGHT * ratio} x2={CHART_WIDTH} y2={CHART_HEIGHT * ratio}
      stroke={colors.border} strokeWidth={0.5} strokeDasharray="4,4" />
  ));

  return (
    <View style={styles.container}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <Rect width={CHART_WIDTH} height={CHART_HEIGHT} fill={colors.surface} rx={8} />
        {gridLines}
        {points ? <Polyline points={points} fill="none" stroke={strokeColor} strokeWidth={1.5} strokeLinejoin="round" /> : null}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({ container: { borderRadius: 8, overflow: "hidden" } });
