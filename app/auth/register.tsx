import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { registerUser, createUserProfile } from "../../services/firebase";
import { colors, spacing, fontSizes, radius } from "../../constants/theme";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      const { user } = await registerUser(email.trim(), password);
      await createUserProfile(user.uid, { name, email: user.email });
      router.replace("/(tabs)/dashboard");
    } catch (e: any) {
      setError(e.message ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Text style={styles.logo}>CardioBound</Text>
      <Text style={styles.tagline}>Create your account</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password (min 6 characters)" placeholderTextColor={colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.background} /> : <Text style={styles.buttonText}>Create Account</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl, justifyContent: "center", gap: spacing.md },
  logo: { fontSize: fontSizes.display, fontWeight: "800", color: colors.primary, textAlign: "center" },
  tagline: { fontSize: fontSizes.md, color: colors.textSecondary, textAlign: "center", marginBottom: spacing.lg },
  error: { color: colors.danger, fontSize: fontSizes.sm, textAlign: "center" },
  input: { backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, color: colors.textPrimary, fontSize: fontSizes.md },
  button: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.md, alignItems: "center", marginTop: spacing.sm },
  buttonText: { color: colors.background, fontWeight: "700", fontSize: fontSizes.md },
  link: { color: colors.primary, textAlign: "center", fontSize: fontSizes.sm, marginTop: spacing.sm },
});
