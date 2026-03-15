import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCycle } from "../src/context/CycleContext";
import { DatePickerInput } from "../src/components/DatePickerInput";
import { toISODate } from "../src/utils/dateUtils";
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  GRADIENTS,
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
    <LinearGradient
      colors={[...GRADIENTS.onboardingHero]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.title}>Welcome to BroCycle</Text>
          <Text style={styles.subtitle}>
            Track and understand your partner's cycle to be more supportive. All
            data stays on this device.
          </Text>
        </View>

        <LinearGradient
          colors={[...GRADIENTS.warmCard]}
          style={[styles.form, SHADOWS.lg]}
        >
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
                style={[styles.sliderButton, SHADOWS.sm]}
                onPress={() => setCycleLength((prev) => Math.max(21, prev - 1))}
                accessibilityLabel="Decrease cycle length"
              >
                <Text style={styles.sliderButtonText}>-</Text>
              </TouchableOpacity>
              <View style={styles.sliderTrack}>
                <LinearGradient
                  colors={[...GRADIENTS.buttonPrimary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.sliderFill,
                    {
                      width: `${((cycleLength - 21) / (35 - 21)) * 100}%`,
                    },
                  ]}
                />
              </View>
              <TouchableOpacity
                style={[styles.sliderButton, SHADOWS.sm]}
                onPress={() => setCycleLength((prev) => Math.min(35, prev + 1))}
                accessibilityLabel="Increase cycle length"
              >
                <Text style={styles.sliderButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.hint}>Normal range: 21-35 days</Text>
          </View>
        </LinearGradient>

        <TouchableOpacity
          onPress={handleGetStarted}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel="Get Started"
          style={isSubmitting ? styles.buttonDisabled : undefined}
        >
          <LinearGradient
            colors={[...GRADIENTS.buttonPrimary]}
            style={[styles.button, SHADOWS.glow("#27AE60")]}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? "Setting up..." : "Get Started"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
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
    paddingTop: SPACING.xxl * 2,
  },
  hero: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.hero,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.sm,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    marginBottom: SPACING.xl,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.lg,
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
    backgroundColor: COLORS.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  sliderButtonText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.accent,
    fontWeight: "bold",
  },
  sliderTrack: {
    flex: 1,
    height: 12,
    backgroundColor: COLORS.borderLight,
    borderRadius: 6,
    overflow: "hidden",
  },
  sliderFill: {
    height: "100%",
    borderRadius: 6,
  },
  hint: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: "center",
  },
  button: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
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
