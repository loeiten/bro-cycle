import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Tabs, usePathname, useRouter } from "expo-router";
import { useCycle } from "../../src/context/CycleContext";
import { CustomDrawer } from "../../src/components/CustomDrawer";
import { PHASE_COLORS, COLORS, SPACING } from "../../src/constants/theme";

const DRAWER_ITEMS = [
  { name: "index", title: "Home", emoji: "\uD83C\uDFE0" },
  { name: "log", title: "Log", emoji: "\u270D\uFE0F" },
  { name: "history", title: "History", emoji: "\uD83D\uDCC5" },
  { name: "insights", title: "Insights", emoji: "\uD83D\uDCA1" },
  { name: "settings", title: "Settings", emoji: "\u2699\uFE0F" },
];

function HamburgerButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.hamburger}>
      <View style={styles.hamburgerLine} />
      <View style={styles.hamburgerLine} />
      <View style={styles.hamburgerLine} />
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const { currentPhase } = useCycle();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const accentColor = currentPhase
    ? PHASE_COLORS[currentPhase.phase].primary
    : "#22C55E";

  // Derive active route name from pathname
  const segments = pathname.split("/").filter(Boolean);
  const activeRoute = segments.length === 0 ? "index" : segments[segments.length - 1];

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const handleNavigate = useCallback(
    (name: string) => {
      const path = name === "index" ? "/(tabs)" : `/(tabs)/${name}`;
      router.navigate(path);
    },
    [router],
  );

  const headerLeft = () => <HamburgerButton onPress={openDrawer} />;

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerLeft,
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.text,
          tabBarStyle: { display: "none" },
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="log" options={{ title: "Log" }} />
        <Tabs.Screen name="history" options={{ title: "History" }} />
        <Tabs.Screen name="insights" options={{ title: "Insights" }} />
        <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      </Tabs>
      <CustomDrawer
        items={DRAWER_ITEMS}
        activeRoute={activeRoute}
        accentColor={accentColor}
        isOpen={drawerOpen}
        onClose={closeDrawer}
        onNavigate={handleNavigate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hamburger: {
    marginLeft: SPACING.md,
    padding: SPACING.sm,
    justifyContent: "center",
    gap: 4,
  },
  hamburgerLine: {
    width: 20,
    height: 2,
    backgroundColor: COLORS.text,
    borderRadius: 1,
  },
});
