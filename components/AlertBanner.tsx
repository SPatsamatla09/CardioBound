import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, fontSizes, spacing, radius } from "../constants/theme";

interface Props {
  visible: boolean;
  message: string;
  severity: "warning" | "danger";
  onDismiss: () => void;
}

export function AlertBanner({ visible, message, severity, onDismiss }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: visible ? 1 : 0, duration: visible ? 300 : 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: visible ? 0 : -20, duration: visible ? 300 : 200, useNativeDriver: true }),
    ]).start();
  }, [visible]);

  const bgColor = severity === "danger" ? colors.danger + "22" : colors.warning + "22";
  const borderColor = severity === "danger" ? colors.danger : colors.warning;
  const textColor = severity === "danger" ? colors.danger : colors.warning;

  return (
    <Animated.View style={[styles.banner, { opacity, transform: [{ translateY }], backgroundColor: bgColor, borderColor }]} pointerEvents={visible ? "auto" : "none"}>
      <Text style={[styles.text, { color: textColor }]}>{message}</Text>
      <TouchableOpacity onPress={onDismiss}>
        <Text style={[styles.dismiss, { color: textColor }]}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.md, borderRadius: radius.md, borderWidth: 1, marginBottom: spacing.md },
  text: { fontSize: fontSizes.sm, fontWeight: "600", flex: 1 },
  dismiss: { fontSize: fontSizes.md, paddingLeft: spacing.md, fontWeight: "700" },
});
