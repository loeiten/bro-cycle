import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../constants/theme";

interface Props {
  value: number | null;
  onSelect: (score: number) => void;
}

const MOOD_OPTIONS = [
  { score: 1, emoji: "\uD83D\uDE29", label: "Awful" },
  { score: 2, emoji: "\uD83D\uDE1F", label: "Bad" },
  { score: 3, emoji: "\uD83D\uDE10", label: "Okay" },
  { score: 4, emoji: "\uD83D\uDE0A", label: "Good" },
  { score: 5, emoji: "\uD83D\uDE01", label: "Great" },
];

export function MoodInput({ value, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How is she feeling today?</Text>
      <View style={styles.options}>
        {MOOD_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.score}
            style={[
              styles.option,
              value === option.score && styles.selectedOption,
            ]}
            onPress={() => onSelect(option.score)}
            accessibilityLabel={`Mood: ${option.label}`}
            accessibilityRole="button"
          >
            <Text style={styles.emoji}>{option.emoji}</Text>
            <Text
              style={[
                styles.label,
                value === option.score && styles.selectedLabel,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  option: {
    alignItems: "center",
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    minWidth: 56,
  },
  selectedOption: {
    backgroundColor: "#E8F4FD",
  },
  emoji: {
    fontSize: 28,
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
