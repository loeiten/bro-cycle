import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CyclePhase } from "../types";
import {
  PHASE_COLORS,
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  GRADIENTS,
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
    <LinearGradient
      colors={[...GRADIENTS.warmCard]}
      style={[styles.card, { borderLeftColor: colors.primary }]}
    >
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
        <LinearGradient
          colors={[...colors.gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.progressFill,
            {
              width: `${Math.min(progress * 100, 100)}%`,
            },
          ]}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderLeftWidth: 5,
    ...SHADOWS.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  phaseName: {
    fontSize: FONT_SIZES.xl,
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
    height: 10,
    backgroundColor: COLORS.borderLight,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
});
