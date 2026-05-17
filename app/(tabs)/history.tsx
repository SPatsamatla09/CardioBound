import React, { useEffect, useState } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { getRecentEvents } from "../../services/firebase";
import { useUserStore } from "../../store/userStore";
import { colors, spacing, fontSizes, radius, risk } from "../../constants/theme";

interface ArrhythmiaEvent {
  id: string;
  label: string;
  confidence: number;
  risk: "low" | "medium" | "high";
  timestamp: { seconds: number };
}

export default function HistoryScreen() {
  const { user } = useUserStore();
  const [events, setEvents] = useState<ArrhythmiaEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getRecentEvents(user.uid)
      .then((data) => setEvents(data as ArrhythmiaEvent[]))
      .finally(() => setLoading(false));
  }, [user]);

  const renderItem = ({ item }: { item: ArrhythmiaEvent }) => {
    const color = risk[item.risk];
    const date = item.timestamp
      ? new Date(item.timestamp.seconds * 1000).toLocaleString()
      : "Unknown";
    return (
      <View style={[styles.item, { borderLeftColor: color }]}>
        <View style={styles.itemHeader}>
          <Text style={[styles.label, { color }]}>{item.label}</Text>
          <Text style={styles.conf}>{Math.round(item.confidence * 100)}%</Text>
        </View>
        <Text style={styles.date}>{date}</Text>
      </View>
    );
  };

  if (loading) {
    return <View style={styles.center}><Text style={styles.empty}>Loading...</Text></View>;
  }

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.empty}>No arrhythmia events recorded yet.</Text>
        </View>
      }
      style={{ backgroundColor: colors.background }}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, gap: spacing.sm },
  item: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderLeftWidth: 3 },
  itemHeader: { flexDirection: "row", justifyContent: "space-between" },
  label: { fontSize: fontSizes.md, fontWeight: "700" },
  conf: { fontSize: fontSizes.sm, color: colors.textSecondary },
  date: { fontSize: fontSizes.xs, color: colors.textMuted, marginTop: spacing.xs },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  empty: { color: colors.textMuted, fontSize: fontSizes.md },
});
