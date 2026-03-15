import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useCycle } from "../../src/context/CycleContext";
import { CycleHistoryItem } from "../../src/components/CycleHistoryItem";
import { getMoodTrend } from "../../src/services/predictionEngine";
import { COLORS, FONT_SIZES, SPACING } from "../../src/constants/theme";

export default function HistoryScreen() {
  const { cycles, moodLogs } = useCycle();

  if (cycles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No cycle history yet. Log a period to get started.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={cycles}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => {
        const trend = getMoodTrend(moodLogs, item);
        return <CycleHistoryItem cycle={item} moodTrend={trend} />;
      }}
      ListHeaderComponent={
        <Text style={styles.header}>
          {cycles.length} cycle{cycles.length !== 1 ? "s" : ""} recorded
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  header: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
});
