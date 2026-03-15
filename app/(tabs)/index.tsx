import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useCycle } from "../../src/context/CycleContext";
import { VerticalTimeline } from "../../src/components/VerticalTimeline";
import { PhaseCard } from "../../src/components/PhaseCard";
import { WarningBanner } from "../../src/components/WarningBanner";
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  PHASE_COLORS,
  BORDER_RADIUS,
} from "../../src/constants/theme";

export default function HomeScreen() {
  const { currentCycle, currentPhase, prediction } = useCycle();

  if (!currentCycle || !currentPhase) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No cycle data yet.</Text>
      </View>
    );
  }

  const phaseColor = PHASE_COLORS[currentPhase.phase];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {currentPhase.isOverdue && (
        <WarningBanner
          type="overdue"
          message="Cycle may be overdue. Has a new period started? Go to Log to record it."
        />
      )}

      {/* Hero: day number and phase */}
      <View style={styles.heroSection}>
        <Text style={[styles.heroDay, { color: phaseColor.primary }]}>
          Day {currentPhase.dayInCycle}
        </Text>
        <Text style={styles.heroSubtitle}>
          of {currentPhase.totalCycleDays}
        </Text>
      </View>

      {/* Vertical Timeline — the main visual */}
      <View style={styles.timelineCard}>
        <VerticalTimeline phaseInfo={currentPhase} />
      </View>

      {/* Phase details card */}
      <PhaseCard
        phase={currentPhase.phase}
        dayInPhase={currentPhase.dayInPhase}
        totalPhaseDays={currentPhase.totalPhaseDays}
      />

      {/* Prediction chart */}
      {prediction && prediction.distribution.length > 0 && (
        <View style={styles.predictionCard}>
          <Text style={styles.predictionTitle}>Next Period Prediction</Text>
          <Text style={styles.predictionSubtitle}>
            Expected around day {prediction.predicted} ({"\u00B1"}
            {Math.round(prediction.stdDev)} days)
          </Text>
          <View style={styles.distributionChart}>
            {prediction.distribution.map((dp) => {
              const maxProb = Math.max(
                ...prediction.distribution.map((d) => d.probability),
              );
              const heightPercent =
                maxProb > 0 ? (dp.probability / maxProb) * 100 : 0;
              const isHighest = dp.probability === maxProb;
              return (
                <View key={dp.day} style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${Math.max(heightPercent, 2)}%`,
                        backgroundColor: isHighest
                          ? phaseColor.primary
                          : phaseColor.light,
                      },
                    ]}
                  />
                  {dp.day % 2 === 0 && (
                    <Text style={styles.barLabel}>{dp.day}</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  heroDay: {
    fontSize: FONT_SIZES.hero,
    fontWeight: "bold",
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: -4,
  },
  timelineCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  predictionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  predictionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  predictionSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  distributionChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 80,
    gap: 2,
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  bar: {
    width: "80%",
    borderRadius: 2,
    minHeight: 2,
  },
  barLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
