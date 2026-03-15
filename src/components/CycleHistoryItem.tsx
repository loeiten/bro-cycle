import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Cycle, MoodTrend } from "../types";
import { formatDate } from "../utils/dateUtils";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../constants/theme";

interface Props {
  cycle: Cycle;
  moodTrend?: MoodTrend[];
}

export function CycleHistoryItem({ cycle, moodTrend }: Props) {
  const avgMood =
    moodTrend && moodTrend.length > 0
      ? moodTrend.reduce((sum, m) => sum + m.moodScore, 0) / moodTrend.length
      : null;

  const moodEmoji = avgMood
    ? avgMood >= 4
      ? "\uD83D\uDE0A"
      : avgMood >= 3
        ? "\uD83D\uDE10"
        : "\uD83D\uDE1F"
    : null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(cycle.start_date)}</Text>
        <Text style={styles.length}>{cycle.cycle_length} days</Text>
      </View>

      {moodTrend && moodTrend.length > 0 && (
        <View style={styles.moodRow}>
          <Text style={styles.moodLabel}>
            Avg mood: {avgMood!.toFixed(1)} {moodEmoji}
          </Text>
          <View style={styles.sparkline}>
            {moodTrend.map((point, i) => (
              <View
                key={i}
                style={[
                  styles.sparkBar,
                  {
                    height: (point.moodScore / 5) * 24,
                    backgroundColor:
                      point.moodScore >= 4
                        ? "#2ECC71"
                        : point.moodScore >= 3
                          ? "#F39C12"
                          : "#E74C3C",
                  },
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {cycle.notes && <Text style={styles.notes}>{cycle.notes}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.text,
  },
  length: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  moodRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.sm,
    justifyContent: "space-between",
  },
  moodLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  sparkline: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
    height: 24,
  },
  sparkBar: {
    width: 4,
    borderRadius: 2,
  },
  notes: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    fontStyle: "italic",
  },
});
