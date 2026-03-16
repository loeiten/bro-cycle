import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCycle } from "../../src/context/CycleContext";
import { CycleTimeline } from "../../src/components/CycleTimeline";
import { WarningBanner } from "../../src/components/WarningBanner";
import { PHASE_DEFINITIONS } from "../../src/constants/phases";
import { todayISO } from "../../src/utils/dateUtils";
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  PHASE_COLORS,
  BORDER_RADIUS,
  SHADOWS,
  GRADIENTS,
} from "../../src/constants/theme";

export default function HomeScreen() {
  const { currentCycle, currentPhase, prediction, addCycle, settings } =
    useCycle();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  if (!currentCycle || !currentPhase) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>{"\uD83C\uDF19"}</Text>
        <Text style={styles.emptyText}>No cycle data yet.</Text>
      </View>
    );
  }

  const phaseColor = PHASE_COLORS[currentPhase.phase];
  const definition = PHASE_DEFINITIONS[currentPhase.phase];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleNewBleeding = async () => {
    await addCycle(todayISO(), settings.default_cycle_length);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  return (
    <LinearGradient
      colors={[...GRADIENTS.screenBackground]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {currentPhase.isOverdue && (
          <WarningBanner
            type="overdue"
            message="Cycle may be overdue. Has a new period started? Go to Log to record it."
          />
        )}

        {/* Hero: day number, phase info, progress bar, timeline */}
        <LinearGradient
          colors={[...GRADIENTS.phaseHero[currentPhase.phase]]}
          style={[styles.heroSection, SHADOWS.md]}
        >
          <Text style={[styles.heroDay, { color: phaseColor.primary }]}>
            Day {currentPhase.dayInCycle}
          </Text>
          <Text style={styles.heroSubtitle}>
            of {currentPhase.totalCycleDays}
          </Text>

          <View style={styles.phaseInfoRow}>
            <Text style={[styles.phaseName, { color: phaseColor.primary }]}>
              {definition.name} Phase
            </Text>
            <Text style={styles.phaseDay}>
              Day {currentPhase.dayInPhase} of {currentPhase.totalPhaseDays}
            </Text>
          </View>
          <Text style={styles.phaseDescription}>{definition.description}</Text>

          <CycleTimeline phaseInfo={currentPhase} />
        </LinearGradient>

        {/* New Bleeding Started button */}
        <Animated.View
          style={{ transform: [{ scale: scaleAnim }], alignSelf: "center" }}
        >
          <TouchableOpacity
            onPress={handleNewBleeding}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            accessibilityRole="button"
            accessibilityLabel="New Bleeding Started"
          >
            <LinearGradient
              colors={["#9F1239", "#881337"] as const}
              style={[styles.bleedingButton, SHADOWS.glow("#9F1239")]}
            >
              <Text style={styles.bleedingEmoji}>{"\uD83E\uDE78"}</Text>
              <Text style={styles.bleedingText}>New Bleeding</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        {showConfirmation && (
          <Text style={styles.confirmText}>Logged! New period recorded.</Text>
        )}

        {/* Prediction chart */}
        {prediction && prediction.distribution.length > 0 && (
          <LinearGradient
            colors={[...GRADIENTS.warmCard]}
            style={[styles.predictionCard, SHADOWS.md]}
          >
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
                          borderRadius: 4,
                        },
                      ]}
                    />
                    {(prediction.distribution.length <= 10 ||
                      dp.day % 2 === 0) && (
                      <Text style={styles.barLabel}>{dp.day}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </LinearGradient>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  heroSection: {
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.xxl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    alignItems: "center",
  },
  heroDay: {
    fontSize: 56,
    fontWeight: "bold",
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: -4,
  },
  phaseInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: SPACING.md,
  },
  phaseName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
  },
  phaseDay: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  phaseDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
    marginTop: SPACING.xs,
    alignSelf: "flex-start",
  },
  bleedingButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: "center",
    justifyContent: "center",
  },
  bleedingEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  bleedingText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZES.sm,
    fontWeight: "bold",
  },
  confirmText: {
    textAlign: "center",
    color: COLORS.success,
    fontWeight: "bold",
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.md,
  },
  predictionCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
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
    height: 100,
    gap: 2,
  },
  barContainer: {
    flex: 1,
    maxWidth: 40,
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  bar: {
    width: "80%",
    minHeight: 2,
  },
  barLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
