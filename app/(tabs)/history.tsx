import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCycle } from "../../src/context/CycleContext";
import { CycleHistoryItem } from "../../src/components/CycleHistoryItem";
import { DatePickerInput } from "../../src/components/DatePickerInput";
import { getMoodTrend } from "../../src/services/predictionEngine";
import { Cycle } from "../../src/types";
import { toISODate } from "../../src/utils/dateUtils";
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  GRADIENTS,
} from "../../src/constants/theme";

export default function HistoryScreen() {
  const { cycles, moodLogs, updateCycle, deleteCycle } = useCycle();
  const [editingCycle, setEditingCycle] = useState<Cycle | null>(null);
  const [editStartDate, setEditStartDate] = useState("");
  const [editCycleLength, setEditCycleLength] = useState(28);
  const [editNotes, setEditNotes] = useState("");

  const handleEdit = (cycle: Cycle) => {
    setEditingCycle(cycle);
    setEditStartDate(cycle.start_date);
    setEditCycleLength(cycle.cycle_length);
    setEditNotes(cycle.notes || "");
  };

  const handleSaveEdit = async () => {
    if (!editingCycle) return;
    await updateCycle(
      editingCycle.id,
      editStartDate,
      editCycleLength,
      editNotes || undefined,
    );
    setEditingCycle(null);
  };

  const handleCancelEdit = () => {
    setEditingCycle(null);
  };

  const handleDelete = (id: number) => {
    Alert.alert("Delete Cycle", "Are you sure you want to delete this cycle?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteCycle(id),
      },
    ]);
  };

  if (cycles.length === 0) {
    return (
      <LinearGradient
        colors={[...GRADIENTS.screenBackground]}
        style={styles.emptyContainer}
      >
        <Text style={styles.emptyEmoji}>{"\uD83D\uDCC5"}</Text>
        <Text style={styles.emptyText}>
          No cycle history yet. Log a period to get started.
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[...GRADIENTS.screenBackground]}
      style={styles.container}
    >
      <FlatList
        contentContainerStyle={styles.content}
        data={cycles}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const trend = getMoodTrend(moodLogs, item);

          if (editingCycle && editingCycle.id === item.id) {
            return (
              <View style={[styles.editCard, SHADOWS.md]}>
                <Text style={styles.editTitle}>Edit Cycle</Text>
                <DatePickerInput
                  value={new Date(editStartDate)}
                  onChange={(date: Date) => setEditStartDate(toISODate(date))}
                  label="Start Date"
                />
                <View style={styles.editRow}>
                  <Text style={styles.editLabel}>Cycle length</Text>
                  <View style={styles.stepper}>
                    <TouchableOpacity
                      style={[styles.stepperButton, SHADOWS.sm]}
                      onPress={() =>
                        setEditCycleLength(Math.max(21, editCycleLength - 1))
                      }
                    >
                      <Text style={styles.stepperText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepperValue}>{editCycleLength}</Text>
                    <TouchableOpacity
                      style={[styles.stepperButton, SHADOWS.sm]}
                      onPress={() =>
                        setEditCycleLength(Math.min(45, editCycleLength + 1))
                      }
                    >
                      <Text style={styles.stepperText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TextInput
                  style={styles.notesInput}
                  value={editNotes}
                  onChangeText={setEditNotes}
                  placeholder="Notes (optional)"
                  placeholderTextColor={COLORS.textSecondary}
                  multiline
                />
                <View style={styles.editActions}>
                  <TouchableOpacity
                    onPress={handleCancelEdit}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSaveEdit}>
                    <LinearGradient
                      colors={[...GRADIENTS.buttonPrimary]}
                      style={styles.saveButton}
                    >
                      <Text style={styles.saveText}>Save</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }

          return (
            <CycleHistoryItem
              cycle={item}
              moodTrend={trend}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          );
        }}
        ListHeaderComponent={
          <Text style={styles.header}>
            {cycles.length} cycle{cycles.length !== 1 ? "s" : ""} recorded
          </Text>
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  header: {
    fontSize: FONT_SIZES.sm,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  editCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  editTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  editRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  editLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.accent,
  },
  stepperValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.text,
    minWidth: 28,
    textAlign: "center",
  },
  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    minHeight: 60,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  cancelButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  cancelText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  saveButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.sm,
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZES.md,
    fontWeight: "bold",
  },
});
