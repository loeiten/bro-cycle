import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "../constants/theme";

interface Props {
  value: number | null;
  onSelect: (score: number) => void;
}

interface MoodOption {
  emoji: string;
  label: string;
}

interface MoodTier {
  score: number;
  label: string;
  options: MoodOption[];
}

const MOOD_TIERS: MoodTier[] = [
  {
    score: 1,
    label: "Awful",
    options: [
      { emoji: "\uD83D\uDE29", label: "Exhausted" },
      { emoji: "\uD83D\uDE22", label: "Tearful" },
      { emoji: "\uD83D\uDE24", label: "Frustrated" },
      { emoji: "\uD83E\uDD22", label: "Nauseous" },
      { emoji: "\uD83D\uDE30", label: "Anxious" },
      { emoji: "\uD83D\uDE21", label: "Angry" },
      { emoji: "\uD83E\uDD2C", label: "Furious" },
    ],
  },
  {
    score: 2,
    label: "Bad",
    options: [
      { emoji: "\uD83D\uDE14", label: "Sad" },
      { emoji: "\uD83D\uDE23", label: "Stressed" },
      { emoji: "\uD83D\uDE34", label: "Drained" },
      { emoji: "\uD83E\uDD7A", label: "Fragile" },
      { emoji: "\uD83D\uDE11", label: "Numb" },
      { emoji: "\uD83D\uDCA2", label: "Irritated" },
      { emoji: "\uD83D\uDE20", label: "Annoyed" },
    ],
  },
  {
    score: 3,
    label: "Okay",
    options: [
      { emoji: "\uD83D\uDE10", label: "Meh" },
      { emoji: "\uD83D\uDE42", label: "Alright" },
      { emoji: "\uD83D\uDE0C", label: "Calm" },
      { emoji: "\uD83E\uDD14", label: "Thoughtful" },
      { emoji: "\uD83D\uDE36", label: "Quiet" },
    ],
  },
  {
    score: 4,
    label: "Good",
    options: [
      { emoji: "\uD83D\uDE0A", label: "Happy" },
      { emoji: "\uD83D\uDE04", label: "Cheerful" },
      { emoji: "\uD83D\uDCAA", label: "Strong" },
      { emoji: "\uD83E\uDD70", label: "Loved" },
      { emoji: "\uD83D\uDE0E", label: "Confident" },
    ],
  },
  {
    score: 5,
    label: "Great",
    options: [
      { emoji: "\uD83E\uDD29", label: "Amazing" },
      { emoji: "\uD83E\uDD73", label: "Ecstatic" },
      { emoji: "\u2728", label: "Radiant" },
      { emoji: "\uD83E\uDEC6", label: "Grateful" },
      { emoji: "\uD83D\uDE01", label: "Thrilled" },
    ],
  },
];

export function MoodInput({ value, onSelect }: Props) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    if (value && !selectedKey) {
      const tier = MOOD_TIERS.find((t) => t.score === value);
      if (tier) {
        setSelectedKey(`${tier.score}-0`);
      }
    }
  }, [value, selectedKey]);

  const handlePress = (score: number, index: number) => {
    setSelectedKey(`${score}-${index}`);
    onSelect(score);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How is she feeling today?</Text>
      {MOOD_TIERS.map((tier) => (
        <View key={tier.score} style={styles.tierRow}>
          <Text style={styles.tierLabel}>
            {tier.score} {"\u2014"} {tier.label}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.emojiRow}
          >
            {tier.options.map((option, idx) => {
              const key = `${tier.score}-${idx}`;
              const isSelected = selectedKey === key;
              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.option, isSelected && styles.selectedOption]}
                  onPress={() => handlePress(tier.score, idx)}
                  accessibilityLabel={`Mood: ${option.label}`}
                  accessibilityRole="button"
                >
                  <Text style={styles.emoji}>{option.emoji}</Text>
                  <Text
                    style={[styles.label, isSelected && styles.selectedLabel]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.md,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  tierRow: {
    marginBottom: SPACING.sm,
  },
  tierLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  emojiRow: {
    flexDirection: "row",
    gap: SPACING.xs,
  },
  option: {
    alignItems: "center",
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    minWidth: 56,
  },
  selectedOption: {
    backgroundColor: COLORS.accent + "1A",
    borderWidth: 1.5,
    borderColor: COLORS.accent,
  },
  emoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  selectedLabel: {
    color: COLORS.text,
    fontWeight: "600",
  },
});
