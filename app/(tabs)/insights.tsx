import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useCycle } from "../../src/context/CycleContext";
import { InsightCard } from "../../src/components/InsightCard";
import { INSIGHTS, getInsightsForPhase } from "../../src/services/insightsData";
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  PHASE_COLORS,
  BORDER_RADIUS,
} from "../../src/constants/theme";
import { PHASE_DEFINITIONS } from "../../src/constants/phases";

export default function InsightsScreen() {
  const { currentPhase } = useCycle();

  // Show phase-relevant insights first, then all
  const phaseInsights = currentPhase
    ? getInsightsForPhase(currentPhase.phase)
    : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {currentPhase && phaseInsights && (
        <View style={styles.phaseSection}>
          <View
            style={[
              styles.phaseBanner,
              {
                backgroundColor: PHASE_COLORS[currentPhase.phase].light,
              },
            ]}
          >
            <Text
              style={[
                styles.phaseTitle,
                {
                  color: PHASE_COLORS[currentPhase.phase].primary,
                },
              ]}
            >
              Tips for the {PHASE_DEFINITIONS[currentPhase.phase].name} Phase
            </Text>
          </View>
          {phaseInsights.map((category) =>
            category.items.map((item) => (
              <InsightCard key={item.id} item={item} />
            )),
          )}
        </View>
      )}

      {INSIGHTS.map((category) => (
        <View key={category.id} style={styles.category}>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          {category.items.map((item) => (
            <InsightCard key={item.id} item={item} />
          ))}
        </View>
      ))}
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
  },
  phaseSection: {
    marginBottom: SPACING.lg,
  },
  phaseBanner: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  phaseTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
  },
  category: {
    marginBottom: SPACING.lg,
  },
  categoryTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
});
