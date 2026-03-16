import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CyclePhase, PhaseInfo } from "../types";
import {
  PHASE_COLORS,
  COLORS,
  FONT_SIZES,
  SPACING,
  SHADOWS,
} from "../constants/theme";
import { PHASE_DEFINITIONS, PHASE_ORDER } from "../constants/phases";
import { getPhaseBoundaries } from "../services/cycleCalculator";

const PHASE_EMOJI: Record<CyclePhase, string> = {
  [CyclePhase.Menstrual]: "\uD83E\uDE78",
  [CyclePhase.Follicular]: "\uD83D\uDE0A",
  [CyclePhase.Luteal]: "\uD83D\uDE22",
  [CyclePhase.PMS]: "\u26C8\uFE0F",
};

interface Props {
  phaseInfo: PhaseInfo;
}

export function CycleTimeline({ phaseInfo }: Props) {
  const boundaries = getPhaseBoundaries(phaseInfo.totalCycleDays);
  const overallProgress = Math.min(
    phaseInfo.dayInCycle / phaseInfo.totalCycleDays,
    1,
  );
  const filledDays = overallProgress * phaseInfo.totalCycleDays;

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {PHASE_ORDER.map((phase) => {
          const bound = boundaries[phase];
          const phaseDays = bound.end - bound.start + 1;
          const colors = PHASE_COLORS[phase];

          // How much of this segment is filled
          const phaseFilledDays = Math.max(
            0,
            Math.min(filledDays - bound.start + 1, phaseDays),
          );
          const fillRatio = phaseDays > 0 ? phaseFilledDays / phaseDays : 0;
          const isActive = phase === phaseInfo.phase;

          return (
            <View key={phase} style={{ flex: phaseDays, flexDirection: "row" }}>
              {fillRatio > 0 && (
                <LinearGradient
                  colors={[...colors.gradient]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.segmentFilled, { flex: fillRatio }]}
                >
                  {isActive && fillRatio > 0 && (
                    <View
                      style={[
                        styles.marker,
                        { borderColor: colors.primary },
                        SHADOWS.sm,
                      ]}
                    />
                  )}
                </LinearGradient>
              )}
              {fillRatio < 1 && (
                <View
                  style={[
                    styles.segmentUnfilled,
                    {
                      flex: 1 - fillRatio,
                      backgroundColor: colors.light,
                    },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
      <View style={styles.labels}>
        {PHASE_ORDER.map((phase) => {
          const bound = boundaries[phase];
          const phaseDays = bound.end - bound.start + 1;
          return (
            <Text
              key={phase}
              style={[
                styles.label,
                { flex: phaseDays },
                phase === phaseInfo.phase && styles.activeLabel,
                phase === phaseInfo.phase && {
                  color: PHASE_COLORS[phase].primary,
                },
              ]}
            >
              {PHASE_EMOJI[phase]} {PHASE_DEFINITIONS[phase].name}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
    width: "100%",
  },
  bar: {
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  segmentFilled: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  segmentUnfilled: {
    // backgroundColor set inline
  },
  marker: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    marginRight: -1,
  },
  labels: {
    flexDirection: "row",
    marginTop: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  activeLabel: {
    fontWeight: "bold",
  },
});
