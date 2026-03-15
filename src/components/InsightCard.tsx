import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { InsightItem } from "../types";
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  PHASE_COLORS,
} from "../constants/theme";

interface Props {
  item: InsightItem;
}

export function InsightCard({ item }: Props) {
  const [expanded, setExpanded] = useState(false);

  const borderColor = item.phase
    ? PHASE_COLORS[item.phase].primary
    : COLORS.accent;
  const bgColor = item.phase
    ? PHASE_COLORS[item.phase].light
    : COLORS.surfaceElevated;
  const preview =
    item.shortTip ||
    item.content.slice(0, 80) + (item.content.length > 80 ? "\u2026" : "");

  return (
    <TouchableOpacity
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={item.title}
    >
      <View
        style={[
          styles.card,
          { borderLeftColor: borderColor, backgroundColor: bgColor },
        ]}
      >
        <View style={styles.header}>
          {item.emoji && <Text style={styles.emoji}>{item.emoji}</Text>}
          <View style={styles.headerText}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.preview} numberOfLines={2}>
              {preview}
            </Text>
          </View>
          <Text style={styles.chevron}>{expanded ? "\u25B2" : "\u25BC"}</Text>
        </View>
        {expanded && (
          <>
            <View style={styles.separator} />
            <Text style={styles.content}>{item.content}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    fontSize: 32,
    marginRight: SPACING.sm,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.text,
  },
  preview: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: SPACING.sm,
  },
  content: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
    marginTop: SPACING.sm,
  },
});
