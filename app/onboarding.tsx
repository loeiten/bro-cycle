import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useCycle } from "../src/context/CycleContext";
import { DatePickerInput } from "../src/components/DatePickerInput";
import { toISODate } from "../src/utils/dateUtils";
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
} from "../src/constants/theme";

export default function OnboardingScreen() {
  const { addCycle } = useCycle();
  const [startDate, setStartDate] = useState(new Date());
  const [cycleLength, setCycleLength] = useState(28);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetStarted = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await addCycle(toISODate(startDate), cycleLength);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Failed to create first cycle:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.title}>Welcome to BroCycle</Text>
        <Text style={styles.subtitle}>
          Track and understand your partner's cycle to be more supportive. All
          data stays on this device.
        </Text>
      </View>

      <View style={styles.form}>
        <DatePickerInput
          label="When did your partner's most recent period start?"
          value={startDate}
          onChange={setStartDate}
          maximumDate={new Date()}
        />

        <View style={styles.cycleLengthSection}>
          <Text style={styles.label}>
            Typical cycle length: {cycleLength} days
          </Text>
          <View style={styles.sliderRow}>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => setCycleLength((prev) => Math.max(21, prev - 1))}
              accessibilityLabel="Decrease cycle length"
            >
              <Text style={styles.sliderButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.sliderTrack}>
              <View
                style={[
                  styles.sliderFill,
                  {
                    width: `${((cycleLength - 21) / (35 - 21)) * 100}%`,
                  },
                ]}
              />
            </View>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => setCycleLength((prev) => Math.min(35, prev + 1))}
              accessibilityLabel="Increase cycle length"
            >
              <Text style={styles.sliderButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.hint}>Normal range: 21-35 days</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleGetStarted}
        disabled={isSubmitting}
        accessibilityRole="button"
        accessibilityLabel="Get Started"
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "Setting up..." : "Get Started"}
        </Text>
      </TouchableOpacity>
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
    paddingTop: SPACING.xxl * 2,
  },
  hero: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  cycleLengthSection: {
    marginTop: SPACING.md,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  sliderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sliderButtonText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
    fontWeight: "bold",
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: "#2ECC71",
    borderRadius: 4,
  },
  hint: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2ECC71",
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
  },
});
