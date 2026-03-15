import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PhaseInfo, CyclePhase } from "../types";
import {
  PHASE_COLORS,
  COLORS,
  FONT_SIZES,
  SPACING,
  SHADOWS,
} from "../constants/theme";
import { PHASE_DEFINITIONS } from "../constants/phases";

interface Props {
  phaseInfo: PhaseInfo;
  size?: number;
}

export function PhaseIndicator({ phaseInfo, size = 220 }: Props) {
  const strokeWidth = 14;
  const phases = [
    CyclePhase.Menstrual,
    CyclePhase.Follicular,
    CyclePhase.Luteal,
    CyclePhase.PMS,
  ];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background ring segments */}
      <View style={[styles.ringContainer, { width: size, height: size }]}>
        {phases.map((phase, index) => {
          const segmentSize = 1 / phases.length;
          const startAngle = index * segmentSize * 360 - 90;
          const color = PHASE_COLORS[phase].primary;
          const isCurrentPhase = phase === phaseInfo.phase;

          return (
            <View
              key={phase}
              style={[
                styles.segment,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  borderWidth: strokeWidth,
                  borderColor: color,
                  opacity: isCurrentPhase ? 1 : 0.2,
                  transform: [{ rotate: `${startAngle}deg` }],
                },
              ]}
            />
          );
        })}
      </View>

      {/* Center content */}
      <View style={styles.centerContent}>
        <Text
          style={[
            styles.dayNumber,
            { color: PHASE_COLORS[phaseInfo.phase].primary },
          ]}
        >
          {phaseInfo.dayInCycle}
        </Text>
        <Text style={styles.dayLabel}>
          {phaseInfo.isOverdue
            ? "days (overdue)"
            : `of ${phaseInfo.totalCycleDays} days`}
        </Text>
        <View
          style={[
            styles.phaseBadge,
            { backgroundColor: PHASE_COLORS[phaseInfo.phase].light },
            SHADOWS.sm,
          ]}
        >
          <Text
            style={[
              styles.phaseName,
              { color: PHASE_COLORS[phaseInfo.phase].primary },
            ]}
          >
            {PHASE_DEFINITIONS[phaseInfo.phase].name}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  segment: {
    position: "absolute",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  dayNumber: {
    fontSize: FONT_SIZES.hero,
    fontWeight: "bold",
  },
  dayLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: -4,
  },
  phaseBadge: {
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 999,
  },
  phaseName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: "600",
  },
});
