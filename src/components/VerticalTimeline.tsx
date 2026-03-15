import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PhaseInfo, CyclePhase } from "../types";
import {
  PHASE_COLORS,
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
} from "../constants/theme";
import { PHASE_DEFINITIONS } from "../constants/phases";

interface Props {
  phaseInfo: PhaseInfo;
}

interface TimelineSegment {
  phase: CyclePhase;
  startDay: number;
  endDay: number;
  emoji: string;
  tip: string;
}

function getSegments(totalDays: number): TimelineSegment[] {
  const q1 = Math.floor(totalDays / 4);
  const q2 = Math.floor(totalDays / 2);
  const q3 = Math.floor((3 * totalDays) / 4);

  return [
    {
      phase: CyclePhase.Menstrual,
      startDay: 1,
      endDay: q1,
      emoji: "\uD83E\uDE78",
      tip: "Rest & comfort",
    },
    {
      phase: CyclePhase.Follicular,
      startDay: q1 + 1,
      endDay: q2,
      emoji: "\uD83D\uDE0A",
      tip: "Energy rising!",
    },
    {
      phase: CyclePhase.Luteal,
      startDay: q2 + 1,
      endDay: q3,
      emoji: "\uD83D\uDE14",
      tip: "Be patient & kind",
    },
    {
      phase: CyclePhase.PMS,
      startDay: q3 + 1,
      endDay: totalDays,
      emoji: "\uD83C\uDF27\uFE0F",
      tip: "Extra care needed",
    },
  ];
}

export function VerticalTimeline({ phaseInfo }: Props) {
  const { dayInCycle, totalCycleDays, isOverdue } = phaseInfo;
  const segments = getSegments(totalCycleDays);

  return (
    <View style={styles.container}>
      {/* Left column: day labels */}
      {/* Center: the vertical track */}
      {/* Right column: phase info */}
      <View style={styles.timeline}>
        {segments.map((segment, index) => {
          const segmentDays = segment.endDay - segment.startDay + 1;
          const segmentFlex = segmentDays / totalCycleDays;
          const colors = PHASE_COLORS[segment.phase];
          const isActive = segment.phase === phaseInfo.phase;
          const isPast = dayInCycle > segment.endDay;

          // Is the current-day marker within this segment?
          const markerInSegment =
            dayInCycle >= segment.startDay && dayInCycle <= segment.endDay;
          const markerPosition = markerInSegment
            ? (dayInCycle - segment.startDay) / segmentDays
            : -1;

          return (
            <View
              key={segment.phase}
              style={[styles.segmentRow, { flex: segmentFlex }]}
            >
              {/* Day label column */}
              <View style={styles.dayColumn}>
                <Text
                  style={[
                    styles.dayLabel,
                    isActive && { color: colors.primary, fontWeight: "bold" },
                  ]}
                >
                  Day {segment.startDay}
                </Text>
                {index === segments.length - 1 && (
                  <Text style={[styles.dayLabelBottom]}>
                    Day {segment.endDay}
                  </Text>
                )}
              </View>

              {/* Track column */}
              <View style={styles.trackColumn}>
                <View
                  style={[
                    styles.trackSegment,
                    {
                      backgroundColor: isActive
                        ? colors.primary
                        : isPast
                          ? colors.primary
                          : colors.light,
                      opacity: isActive ? 1 : isPast ? 0.6 : 0.3,
                    },
                    index === 0 && styles.trackTop,
                    index === segments.length - 1 && styles.trackBottom,
                  ]}
                >
                  {/* Current day marker */}
                  {markerInSegment && (
                    <View
                      style={[
                        styles.marker,
                        {
                          top: `${markerPosition * 100}%`,
                          backgroundColor: colors.primary,
                        },
                      ]}
                    >
                      <View style={styles.markerDot} />
                    </View>
                  )}
                </View>
              </View>

              {/* Info column */}
              <View style={styles.infoColumn}>
                <View
                  style={[
                    styles.phaseInfoCard,
                    isActive && {
                      backgroundColor: colors.light,
                      borderColor: colors.primary,
                      borderWidth: 1.5,
                    },
                  ]}
                >
                  <View style={styles.phaseInfoHeader}>
                    <Text style={styles.phaseEmoji}>{segment.emoji}</Text>
                    <Text
                      style={[
                        styles.phaseName,
                        isActive && {
                          color: colors.primary,
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {PHASE_DEFINITIONS[segment.phase].name}
                    </Text>
                  </View>
                  <Text style={styles.phaseTip}>{segment.tip}</Text>
                  {isActive && (
                    <Text style={[styles.activeDay, { color: colors.primary }]}>
                      Day {dayInCycle} of {totalCycleDays}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Overdue indicator */}
      {isOverdue && (
        <View style={styles.overdueBar}>
          <Text style={styles.overdueEmoji}>{"\u26A0\uFE0F"}</Text>
          <Text style={styles.overdueText}>
            Day {dayInCycle} — Cycle may be overdue
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  timeline: {
    minHeight: 360,
  },
  segmentRow: {
    flexDirection: "row",
    minHeight: 80,
  },
  dayColumn: {
    width: 52,
    justifyContent: "space-between",
    paddingRight: SPACING.sm,
  },
  dayLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: "right",
  },
  dayLabelBottom: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: "right",
  },
  trackColumn: {
    width: 20,
    alignItems: "center",
  },
  trackSegment: {
    flex: 1,
    width: 6,
    position: "relative",
  },
  trackTop: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  trackBottom: {
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  marker: {
    position: "absolute",
    left: -9,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  markerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.surface,
  },
  infoColumn: {
    flex: 1,
    paddingLeft: SPACING.md,
    justifyContent: "center",
  },
  phaseInfoCard: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: "transparent",
  },
  phaseInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  phaseEmoji: {
    fontSize: 20,
  },
  phaseName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  phaseTip: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginLeft: 28,
  },
  activeDay: {
    fontSize: FONT_SIZES.xs,
    fontWeight: "bold",
    marginTop: 2,
    marginLeft: 28,
  },
  overdueBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3CD",
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  overdueEmoji: {
    fontSize: 16,
  },
  overdueText: {
    fontSize: FONT_SIZES.sm,
    color: "#856404",
    fontWeight: "600",
  },
});
