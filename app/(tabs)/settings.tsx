import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useCycle } from "../../src/context/CycleContext";
import { AppSettings } from "../../src/types";
import {
  requestPermissions,
  cancelAllNotifications,
} from "../../src/services/notificationService";
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
} from "../../src/constants/theme";

export default function SettingsScreen() {
  const { settings, updateSettings } = useCycle();
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  const handleSave = async () => {
    if (
      localSettings.notifications_enabled &&
      !settings.notifications_enabled
    ) {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert(
          "Permission Denied",
          "Enable notifications in your device settings to receive phase warnings.",
        );
        setLocalSettings((s) => ({ ...s, notifications_enabled: false }));
        return;
      }
    }
    if (!localSettings.notifications_enabled) {
      await cancelAllNotifications();
    }
    await updateSettings(localSettings);
    Alert.alert("Saved", "Settings updated.");
  };

  const updateLocal = (key: keyof AppSettings, value: number | boolean) => {
    setLocalSettings((s) => ({ ...s, [key]: value }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cycle Defaults</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Default cycle length</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() =>
                updateLocal(
                  "default_cycle_length",
                  Math.max(21, localSettings.default_cycle_length - 1),
                )
              }
            >
              <Text style={styles.stepperText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.stepperValue}>
              {localSettings.default_cycle_length}
            </Text>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() =>
                updateLocal(
                  "default_cycle_length",
                  Math.min(45, localSettings.default_cycle_length + 1),
                )
              }
            >
              <Text style={styles.stepperText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notifications</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Enable phase warnings</Text>
          <Switch
            value={localSettings.notifications_enabled}
            onValueChange={(v) => updateLocal("notifications_enabled", v)}
            trackColor={{ false: "#E0E0E0", true: "#2ECC71" }}
          />
        </View>

        {localSettings.notifications_enabled && (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>Warn before Luteal (days)</Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={styles.stepperButton}
                  onPress={() =>
                    updateLocal(
                      "luteal_warning_days_before",
                      Math.max(1, localSettings.luteal_warning_days_before - 1),
                    )
                  }
                >
                  <Text style={styles.stepperText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>
                  {localSettings.luteal_warning_days_before}
                </Text>
                <TouchableOpacity
                  style={styles.stepperButton}
                  onPress={() =>
                    updateLocal(
                      "luteal_warning_days_before",
                      Math.min(7, localSettings.luteal_warning_days_before + 1),
                    )
                  }
                >
                  <Text style={styles.stepperText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Warn before PMS (days)</Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={styles.stepperButton}
                  onPress={() =>
                    updateLocal(
                      "pms_warning_days_before",
                      Math.max(1, localSettings.pms_warning_days_before - 1),
                    )
                  }
                >
                  <Text style={styles.stepperText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>
                  {localSettings.pms_warning_days_before}
                </Text>
                <TouchableOpacity
                  style={styles.stepperButton}
                  onPress={() =>
                    updateLocal(
                      "pms_warning_days_before",
                      Math.min(7, localSettings.pms_warning_days_before + 1),
                    )
                  }
                >
                  <Text style={styles.stepperText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        accessibilityRole="button"
        accessibilityLabel="Save settings"
      >
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>

      <View style={styles.about}>
        <Text style={styles.aboutTitle}>About BroCycle</Text>
        <Text style={styles.aboutText}>
          All data is stored locally on your device and never sent anywhere.
          This app is designed to help partners be more understanding and
          supportive.
        </Text>
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
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    flex: 1,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepperText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.text,
  },
  stepperValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.text,
    minWidth: 28,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#2ECC71",
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  saveButtonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
  },
  about: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  aboutTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  aboutText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
