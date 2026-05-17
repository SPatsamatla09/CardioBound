import { Tabs } from "expo-router";
import { colors } from "../../constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard", tabBarLabel: "Home" }} />
      <Tabs.Screen name="ecg" options={{ title: "Live ECG", tabBarLabel: "ECG" }} />
      <Tabs.Screen name="history" options={{ title: "Event History", tabBarLabel: "History" }} />
      <Tabs.Screen name="reports" options={{ title: "Reports", tabBarLabel: "Reports" }} />
    </Tabs>
  );
}
