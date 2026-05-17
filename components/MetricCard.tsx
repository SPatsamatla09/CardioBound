import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fontSizes, spacing, radius } from "../constants/theme";

interface Props {
  title: string;
  value: string | number;
  unit?: string;
  color?: string;
  subtitle?: string;
}

export function MetricCard({ title, value, unit, color = colors.primary, subtitle }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border, flex: 1 },
  title: { fontSize: fontSizes.xs, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: 1, marginBottom: spacing.xs },
  valueRow: { flexDirection: "row", alignItems: "flex-end", gap: 4 },
  value: { fontSize: fontSizes.xxl, fontWeight: "700" },
  unit: { fontSize: fontSizes.sm, color: colors.textSecondary, marginBottom: 4 },
  subtitle: { fontSize: fontSizes.xs, color: colors.textMuted, marginTop: spacing.xs },
});
