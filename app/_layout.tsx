import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFirebaseAuth } from "../hooks/useFirebase";
import { colors } from "../constants/theme";

export default function RootLayout() {
  useFirebaseAuth();

  return (
    <>
      <StatusBar style="light" backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ title: "Sign In", headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ title: "Create Account", headerShown: false }} />
      </Stack>
    </>
  );
}
