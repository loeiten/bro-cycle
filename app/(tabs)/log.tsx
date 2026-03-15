import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useCycle } from "../../src/context/CycleContext";
import { MoodInput } from "../../src/components/MoodInput";
import { DatePickerInput } from "../../src/components/DatePickerInput";
import { toISODate, todayISO } from "../../src/utils/dateUtils";
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
} from "../../src/constants/theme";

export default function LogScreen() {
  const { addCycle, logMood, settings, moodLogs } = useCycle();

  // Bleeding log state
  const [bleedingDate, setBleedingDate] = useState(new Date());
  const [bleedingNotes, setBleedingNotes] = useState("");

  // Mood log state
  const [moodDate] = useState(new Date());
  const [moodScore, setMoodScore] = useState<number | null>(null);
  const [moodNotes, setMoodNotes] = useState("");

  // Check if today's mood is already logged
  const todayMood = moodLogs.find((m) => m.date === todayISO());

  useEffect(() => {
    if (todayMood) {
      setMoodScore(todayMood.mood_score);
      setMoodNotes(todayMood.notes ?? "");
    }
  }, [todayMood]);

  const handleLogBleeding = async () => {
    try {
      await addCycle(
        toISODate(bleedingDate),
        settings.default_cycle_length,
        bleedingNotes || undefined,
      );
      setBleedingNotes("");
      Alert.alert("Logged!", "New period start date recorded.");
    } catch {
      Alert.alert("Error", "Could not log bleeding. Date may already exist.");
    }
  };

  const handleLogMood = async () => {
    if (moodScore === null) {
      Alert.alert("Select a mood", "Please select a mood score first.");
      return;
    }
    try {
      await logMood(toISODate(moodDate), moodScore, moodNotes || undefined);
      Alert.alert("Saved!", "Mood logged for today.");
    } catch {
      Alert.alert("Error", "Could not save mood.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Bleeding Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Log New Period</Text>
        <Text style={styles.sectionSubtitle}>Record when bleeding started</Text>

        <DatePickerInput
          label="Period start date"
          value={bleedingDate}
          onChange={setBleedingDate}
          maximumDate={new Date()}
        />

        <TextInput
          style={styles.notesInput}
          placeholder="Notes (optional)"
          value={bleedingNotes}
          onChangeText={setBleedingNotes}
          multiline
          maxLength={500}
          placeholderTextColor={COLORS.textSecondary}
        />

        <TouchableOpacity
          style={styles.logButton}
          onPress={handleLogBleeding}
          accessibilityRole="button"
          accessibilityLabel="Log period start"
        >
          <Text style={styles.logButtonText}>Log Period Start</Text>
        </TouchableOpacity>
      </View>

      {/* Mood Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Log Today's Mood {todayMood ? "(Update)" : ""}
        </Text>

        <MoodInput value={moodScore} onSelect={setMoodScore} />

        <TextInput
          style={[styles.notesInput, { marginTop: SPACING.md }]}
          placeholder="Notes about today (optional)"
          value={moodNotes}
          onChangeText={setMoodNotes}
          multiline
          maxLength={500}
          placeholderTextColor={COLORS.textSecondary}
        />

        <TouchableOpacity
          style={[
            styles.logButton,
            styles.moodButton,
            moodScore === null && styles.buttonDisabled,
          ]}
          onPress={handleLogMood}
          disabled={moodScore === null}
          accessibilityRole="button"
          accessibilityLabel="Save mood"
        >
          <Text style={styles.logButtonText}>
            {todayMood ? "Update Mood" : "Save Mood"}
          </Text>
        </TouchableOpacity>
      </View>
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
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    minHeight: 60,
    textAlignVertical: "top",
  },
  logButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    marginTop: SPACING.md,
  },
  moodButton: {
    backgroundColor: "#3498DB",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  logButtonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.md,
    fontWeight: "bold",
  },
});
