import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
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
  const { cycles, moodLogs, updateCycle, deleteCycle, addCycle, settings } =
    useCycle();
  const [editingCycle, setEditingCycle] = useState<Cycle | null>(null);
  const [editStartDate, setEditStartDate] = useState("");
  const [editCycleLength, setEditCycleLength] = useState(28);
  const [editNotes, setEditNotes] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStartDate, setNewStartDate] = useState(new Date());
  const [newCycleLength, setNewCycleLength] = useState(
    settings.default_cycle_length,
  );
  const [newNotes, setNewNotes] = useState("");
  const [addConfirmation, setAddConfirmation] = useState(false);

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
    setDeletingId(id);
  };

  const handleConfirmDelete = async (id: number) => {
    await deleteCycle(id);
    setDeletingId(null);
  };

  const handleAddCycle = async () => {
    await addCycle(
      toISODate(newStartDate),
      newCycleLength,
      newNotes || undefined,
    );
    setNewNotes("");
    setAddConfirmation(true);
    setTimeout(() => setAddConfirmation(false), 2000);
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
                        setEditCycleLength(Math.max(1, editCycleLength - 1))
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
            <View>
              <CycleHistoryItem
                cycle={item}
                moodTrend={trend}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              {deletingId === item.id && (
                <View style={styles.deleteConfirm}>
                  <Text style={styles.deleteConfirmText}>
                    Delete this cycle?
                  </Text>
                  <View style={styles.deleteConfirmActions}>
                    <TouchableOpacity
                      onPress={() => setDeletingId(null)}
                      style={styles.cancelButton}
                    >
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleConfirmDelete(item.id)}
                    >
                      <LinearGradient
                        colors={[...GRADIENTS.buttonDanger]}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        }}
        ListHeaderComponent={
          <View>
            <Text style={styles.header}>
              {cycles.length} cycle{cycles.length !== 1 ? "s" : ""} recorded
            </Text>
            <TouchableOpacity
              onPress={() => setShowAddForm(!showAddForm)}
              style={{ marginBottom: SPACING.md }}
            >
              <LinearGradient
                colors={[...GRADIENTS.buttonPrimary]}
                style={styles.addToggleButton}
              >
                <Text style={styles.addToggleText}>
                  {showAddForm ? "Cancel" : "Add New Cycle"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            {showAddForm && (
              <View
                style={[
                  styles.editCard,
                  SHADOWS.md,
                  { marginBottom: SPACING.md },
                ]}
              >
                <Text style={styles.editTitle}>New Cycle</Text>
                <DatePickerInput
                  value={newStartDate}
                  onChange={setNewStartDate}
                  label="Start Date"
                  maximumDate={new Date()}
                />
                <View style={styles.editRow}>
                  <Text style={styles.editLabel}>Cycle length</Text>
                  <View style={styles.stepper}>
                    <TouchableOpacity
                      style={[styles.stepperButton, SHADOWS.sm]}
                      onPress={() =>
                        setNewCycleLength(Math.max(1, newCycleLength - 1))
                      }
                    >
                      <Text style={styles.stepperText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepperValue}>{newCycleLength}</Text>
                    <TouchableOpacity
                      style={[styles.stepperButton, SHADOWS.sm]}
                      onPress={() =>
                        setNewCycleLength(Math.min(45, newCycleLength + 1))
                      }
                    >
                      <Text style={styles.stepperText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TextInput
                  style={styles.notesInput}
                  value={newNotes}
                  onChangeText={setNewNotes}
                  placeholder="Notes (optional)"
                  placeholderTextColor={COLORS.textSecondary}
                  multiline
                />
                <View style={styles.editActions}>
                  <TouchableOpacity
                    onPress={() => setShowAddForm(false)}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleAddCycle}>
                    <LinearGradient
                      colors={[...GRADIENTS.buttonPrimary]}
                      style={styles.saveButton}
                    >
                      <Text style={styles.saveText}>Submit</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                {addConfirmation && (
                  <Text style={styles.confirmText}>Logged!</Text>
                )}
              </View>
            )}
          </View>
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
  deleteConfirm: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteConfirmText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: "600",
  },
  deleteConfirmActions: {
    flexDirection: "row",
    gap: SPACING.sm,
    alignItems: "center",
  },
  deleteButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZES.sm,
    fontWeight: "bold",
  },
  addToggleButton: {
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
  },
  addToggleText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZES.md,
    fontWeight: "bold",
  },
  confirmText: {
    textAlign: "center",
    color: COLORS.success,
    fontWeight: "bold",
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.md,
  },
});
