import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ECGChart } from "../../components/ECGChart";
import { RiskBadge } from "../../components/RiskBadge";
import { useECGStore } from "../../store/ecgStore";
import { colors, spacing, fontSizes } from "../../constants/theme";

export default function ECGScreen() {
  const { samples, riskLevel, detectedLabel, confidence, isStreaming } = useECGStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live ECG</Text>
        <View style={[styles.dot, { backgroundColor: isStreaming ? colors.success : colors.textMuted }]} />
      </View>
      <RiskBadge level={riskLevel} label={detectedLabel ?? undefined} confidence={confidence} />
      <View style={styles.chartWrapper}>
        <ECGChart samples={samples} riskLevel={riskLevel} />
      </View>
      <View style={styles.stats}>
        <Text style={styles.statLabel}>Samples buffered</Text>
        <Text style={styles.statValue}>{samples.length}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md, gap: spacing.md },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  title: { fontSize: fontSizes.xl, fontWeight: "700", color: colors.textPrimary, flex: 1 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  chartWrapper: { marginVertical: spacing.sm },
  stats: { flexDirection: "row", justifyContent: "space-between" },
  statLabel: { fontSize: fontSizes.sm, color: colors.textSecondary },
  statValue: { fontSize: fontSizes.sm, color: colors.primary, fontWeight: "600" },
});
