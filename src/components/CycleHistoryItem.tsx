import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Cycle, MoodTrend } from "../types";
import { formatDate } from "../utils/dateUtils";
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  GRADIENTS,
} from "../constants/theme";

interface Props {
  cycle: Cycle;
  moodTrend?: MoodTrend[];
  onEdit?: (cycle: Cycle) => void;
  onDelete?: (id: number) => void;
}

export function CycleHistoryItem({
  cycle,
  moodTrend,
  onEdit,
  onDelete,
}: Props) {
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
    <LinearGradient colors={[...GRADIENTS.warmCard]} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(cycle.start_date)}</Text>
        <View style={styles.headerActions}>
          <Text style={styles.length}>{cycle.cycle_length} days</Text>
          {onEdit && (
            <TouchableOpacity
              onPress={() => onEdit(cycle)}
              accessibilityLabel="Edit cycle"
              accessibilityRole="button"
              style={styles.actionButton}
            >
              <Text style={styles.actionText}>{"\u270F\uFE0F"}</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(cycle.id)}
              accessibilityLabel="Delete cycle"
              accessibilityRole="button"
              style={styles.actionButton}
            >
              <Text style={styles.deleteText}>{"\uD83D\uDDD1\uFE0F"}</Text>
            </TouchableOpacity>
          )}
        </View>
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
                    height: (point.moodScore / 5) * 28,
                    backgroundColor:
                      point.moodScore >= 4
                        ? "#22C55E"
                        : point.moodScore >= 3
                          ? "#F97316"
                          : "#EF4444",
                  },
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {cycle.notes && <Text style={styles.notes}>{cycle.notes}</Text>}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.borderLight,
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  length: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  actionButton: {
    padding: SPACING.xs,
  },
  actionText: {
    fontSize: 16,
  },
  deleteText: {
    fontSize: 16,
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
    height: 28,
  },
  sparkBar: {
    width: 5,
    borderRadius: 2,
  },
  notes: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    fontStyle: "italic",
  },
});
