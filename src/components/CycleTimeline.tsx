import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PhaseInfo } from "../types";
import { PHASE_COLORS, COLORS, FONT_SIZES, SPACING } from "../constants/theme";
import { PHASE_DEFINITIONS } from "../constants/phases";
import { PHASE_ORDER } from "../constants/phases";

interface Props {
  phaseInfo: PhaseInfo;
}

export function CycleTimeline({ phaseInfo }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {PHASE_ORDER.map((phase) => {
          const isActive = phase === phaseInfo.phase;
          const colors = PHASE_COLORS[phase];
          return (
            <View
              key={phase}
              style={[
                styles.segment,
                {
                  backgroundColor: isActive ? colors.primary : colors.light,
                  flex: 1,
                },
              ]}
            >
              {isActive && <View style={styles.marker} />}
            </View>
          );
        })}
      </View>
      <View style={styles.labels}>
        {PHASE_ORDER.map((phase) => (
          <Text
            key={phase}
            style={[
              styles.label,
              phase === phaseInfo.phase && styles.activeLabel,
              phase === phaseInfo.phase && {
                color: PHASE_COLORS[phase].primary,
              },
            ]}
          >
            {PHASE_DEFINITIONS[phase].name}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  bar: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    gap: 2,
  },
  segment: {
    justifyContent: "center",
    alignItems: "center",
  },
  marker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.text,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    flex: 1,
    textAlign: "center",
  },
  activeLabel: {
    fontWeight: "bold",
  },
});
