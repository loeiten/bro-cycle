import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FONT_SIZES, SPACING, BORDER_RADIUS } from "../constants/theme";

interface Props {
  message: string;
  type: "warning" | "info" | "overdue";
}

const BANNER_COLORS = {
  warning: { bg: "#FFF3CD", text: "#856404", border: "#F39C12" },
  info: { bg: "#D1ECF1", text: "#0C5460", border: "#17A2B8" },
  overdue: { bg: "#F8D7DA", text: "#721C24", border: "#E74C3C" },
};

export function WarningBanner({ message, type }: Props) {
  const colors = BANNER_COLORS[type];

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: colors.bg, borderLeftColor: colors.border },
      ]}
    >
      <Text style={[styles.text, { color: colors.text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: BORDER_RADIUS.sm,
    borderLeftWidth: 4,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  text: {
    fontSize: FONT_SIZES.md,
    lineHeight: 20,
  },
});
