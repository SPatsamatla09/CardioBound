import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { MetricCard } from "../../components/MetricCard";
import { RiskBadge } from "../../components/RiskBadge";
import { AlertBanner } from "../../components/AlertBanner";
import { ECGChart } from "../../components/ECGChart";
import { useECGStore } from "../../store/ecgStore";
import { useECGStream } from "../../hooks/useECGStream";
import { colors, spacing, fontSizes } from "../../constants/theme";

export default function DashboardScreen() {
  const { samples, riskLevel, detectedLabel, confidence, isStreaming } = useECGStore();
  const [alertDismissed, setAlertDismissed] = useState(false);

  useECGStream();

  const showAlert = riskLevel === "high" && !alertDismissed;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>CardioBound</Text>
      <Text style={styles.subheading}>
        {isStreaming ? "● Live monitoring active" : "○ Connecting..."}
      </Text>

      <AlertBanner
        visible={showAlert}
        message={`Critical arrhythmia detected: ${detectedLabel ?? "Unknown"}`}
        severity="danger"
        onDismiss={() => setAlertDismissed(true)}
      />

      <RiskBadge level={riskLevel} label={detectedLabel ?? undefined} confidence={confidence} />

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>ECG Waveform</Text>
        <ECGChart samples={samples} riskLevel={riskLevel} />
      </View>

      <Text style={styles.sectionTitle}>Vitals</Text>
      <View style={styles.metricsRow}>
        <MetricCard title="Heart Rate" value={72} unit="bpm" color={colors.primary} />
        <MetricCard title="SpO₂" value={98} unit="%" color={colors.success} />
      </View>
      <View style={styles.metricsRow}>
        <MetricCard title="RR Interval" value="820" unit="ms" color={colors.accent} />
        <MetricCard
          title="Risk Score"
          value={riskLevel === "high" ? 85 : riskLevel === "medium" ? 45 : 12}
          unit="/100"
          color={
            riskLevel === "high"
              ? colors.danger
              : riskLevel === "medium"
              ? colors.warning
              : colors.success
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  heading: { fontSize: fontSizes.display, fontWeight: "800", color: colors.primary },
  subheading: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: -spacing.sm },
  chartSection: { gap: spacing.sm },
  sectionTitle: {
    fontSize: fontSizes.sm, fontWeight: "600", color: colors.textSecondary,
    textTransform: "uppercase", letterSpacing: 1,
  },
  metricsRow: { flexDirection: "row", gap: spacing.sm },
});
