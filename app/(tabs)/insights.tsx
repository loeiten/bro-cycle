import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCycle } from "../../src/context/CycleContext";
import { InsightCard } from "../../src/components/InsightCard";
import { INSIGHTS, getInsightsForPhase } from "../../src/services/insightsData";
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  PHASE_COLORS,
  BORDER_RADIUS,
  SHADOWS,
  GRADIENTS,
} from "../../src/constants/theme";
import { PHASE_DEFINITIONS } from "../../src/constants/phases";

const CATEGORY_EMOJI: Record<string, string> = {
  understanding: "\uD83D\uDCD6",
  supportive: "\u2764\uFE0F",
  myths: "\u26A1",
  medical: "\uD83C\uDFE5",
};

export default function InsightsScreen() {
  const { currentPhase } = useCycle();

  const phaseInsights = currentPhase
    ? getInsightsForPhase(currentPhase.phase)
    : null;

  const phaseItems = phaseInsights ? phaseInsights.flatMap((c) => c.items) : [];

  return (
    <LinearGradient
      colors={[...GRADIENTS.screenBackground]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Horizontal tip carousel */}
        {currentPhase && phaseItems.length > 0 && (
          <View style={styles.carouselSection}>
            <Text style={styles.carouselTitle}>
              Tips for the {PHASE_DEFINITIONS[currentPhase.phase].name} Phase
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
            >
              {phaseItems.map((item) => {
                const bg = item.phase
                  ? PHASE_COLORS[item.phase].light
                  : COLORS.surfaceElevated;
                const border = item.phase
                  ? PHASE_COLORS[item.phase].primary
                  : COLORS.accent;
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.tipCard,
                      SHADOWS.sm,
                      { backgroundColor: bg, borderBottomColor: border },
                    ]}
                  >
                    {item.emoji && (
                      <Text style={styles.tipEmoji}>{item.emoji}</Text>
                    )}
                    <Text style={styles.tipText} numberOfLines={3}>
                      {item.shortTip || item.content.slice(0, 60)}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Category sections */}
        {INSIGHTS.map((category) => (
          <View key={category.id} style={styles.category}>
            <Text style={styles.categoryTitle}>
              {CATEGORY_EMOJI[category.id] || ""} {category.title}
            </Text>
            {category.items.map((item) => (
              <InsightCard key={item.id} item={item} />
            ))}
          </View>
        ))}
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
  },
  carouselSection: {
    marginBottom: SPACING.lg,
  },
  carouselTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  carouselContent: {
    gap: SPACING.sm,
  },
  tipCard: {
    width: 200,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderBottomWidth: 3,
  },
  tipEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  tipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    lineHeight: 18,
  },
  category: {
    marginBottom: SPACING.lg,
  },
  categoryTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
});
