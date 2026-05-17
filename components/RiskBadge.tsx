import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, risk, fontSizes, spacing, radius } from "../constants/theme";

interface Props {
  level: "low" | "medium" | "high" | null;
  label?: string;
  confidence?: number | null;
}

const riskLabels = { low: "Normal Sinus", medium: "Abnormality Detected", high: "Critical Alert" };

export function RiskBadge({ level, label, confidence }: Props) {
  if (!level) {
    return (
      <View style={[styles.badge, styles.idle]}>
        <Text style={[styles.levelText, { color: colors.textMuted }]}>Awaiting Data</Text>
      </View>
    );
  }
  const color = risk[level];
  return (
    <View style={[styles.badge, { borderColor: color, backgroundColor: color + "18" }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View>
        <Text style={[styles.levelText, { color }]}>{riskLabels[level]}</Text>
        {label && <Text style={styles.labelText}>{label}{confidence != null ? `  ${Math.round(confidence * 100)}%` : ""}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, borderWidth: 1, alignSelf: "flex-start" },
  idle: { borderColor: colors.border, backgroundColor: colors.surface },
  dot: { width: 8, height: 8, borderRadius: 4 },
  levelText: { fontSize: fontSizes.sm, fontWeight: "700", letterSpacing: 0.5 },
  labelText: { fontSize: fontSizes.xs, color: colors.textSecondary, marginTop: 2 },
});
