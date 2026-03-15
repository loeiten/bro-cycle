import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { InsightItem } from "../types";
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from "../constants/theme";

interface Props {
  item: InsightItem;
}

export function InsightCard({ item }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={item.title}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.chevron}>{expanded ? "\u25B2" : "\u25BC"}</Text>
      </View>
      {expanded && <Text style={styles.content}>{item.content}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  chevron: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  content: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
    marginTop: SPACING.sm,
  },
});
