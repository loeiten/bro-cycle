import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CyclePhase } from "../types";
import {
  PHASE_COLORS,
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
} from "../constants/theme";
import { PHASE_DEFINITIONS } from "../constants/phases";

interface Props {
  phase: CyclePhase;
  dayInPhase: number;
  totalPhaseDays: number;
}

export function PhaseCard({ phase, dayInPhase, totalPhaseDays }: Props) {
  const definition = PHASE_DEFINITIONS[phase];
  const colors = PHASE_COLORS[phase];
  const progress = dayInPhase / totalPhaseDays;

  return (
    <View style={[styles.card, { borderLeftColor: colors.primary }]}>
      <View style={styles.header}>
        <Text style={[styles.phaseName, { color: colors.primary }]}>
          {definition.name} Phase
        </Text>
        <Text style={styles.dayCount}>
          Day {dayInPhase} of {totalPhaseDays}
        </Text>
      </View>
      <Text style={styles.description}>{definition.description}</Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(progress * 100, 100)}%`,
              backgroundColor: colors.primary,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  phaseName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
  },
  dayCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
});
