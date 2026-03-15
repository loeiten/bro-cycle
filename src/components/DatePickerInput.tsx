import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { formatDate } from "../utils/dateUtils";
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "../constants/theme";

interface Props {
  value: Date;
  onChange: (date: Date) => void;
  label: string;
  maximumDate?: Date;
}

export function DatePickerInput({
  value,
  onChange,
  label,
  maximumDate,
}: Props) {
  const [showPicker, setShowPicker] = useState(false);

  // Simple date input — on mobile, uses a text-based approach
  // since DateTimePicker requires a native module
  const handleDayChange = (delta: number) => {
    const newDate = new Date(value);
    newDate.setDate(newDate.getDate() + delta);
    if (maximumDate && newDate > maximumDate) return;
    onChange(newDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerRow}>
        <TouchableOpacity
          style={[styles.arrowButton, SHADOWS.sm]}
          onPress={() => handleDayChange(-1)}
          accessibilityLabel="Previous day"
        >
          <Text style={styles.arrow}>{"\u25C0"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dateDisplay}
          onPress={() => setShowPicker(!showPicker)}
          accessibilityLabel={`Selected date: ${formatDate(value)}`}
        >
          <Text style={styles.dateText}>{formatDate(value)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.arrowButton, SHADOWS.sm]}
          onPress={() => handleDayChange(1)}
          accessibilityLabel="Next day"
        >
          <Text style={styles.arrow}>{"\u25B6"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.accent,
  },
  dateDisplay: {
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    minWidth: 160,
    alignItems: "center",
    marginHorizontal: SPACING.sm,
  },
  dateText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    fontWeight: "500",
  },
});
