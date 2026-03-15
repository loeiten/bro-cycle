import React from "react";
import { Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "../constants/theme";

interface Props {
  message: string;
  type: "warning" | "info" | "overdue";
}

const BANNER_COLORS = {
  warning: {
    gradient: ["#FFF7ED", "#FFEDD5"] as const,
    text: "#9A3412",
    border: "#F97316",
  },
  info: {
    gradient: ["#E0F2FE", "#BAE6FD"] as const,
    text: "#075985",
    border: "#38BDF8",
  },
  overdue: {
    gradient: ["#FEE2E2", "#FECACA"] as const,
    text: "#991B1B",
    border: "#EF4444",
  },
};

export function WarningBanner({ message, type }: Props) {
  const colors = BANNER_COLORS[type];

  return (
    <LinearGradient
      colors={[...colors.gradient]}
      style={[styles.banner, { borderLeftColor: colors.border }, SHADOWS.sm]}
    >
      <Text style={[styles.text, { color: colors.text }]}>{message}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 5,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  text: {
    fontSize: FONT_SIZES.md,
    lineHeight: 20,
  },
});
