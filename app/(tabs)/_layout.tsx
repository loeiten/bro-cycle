import React from "react";
import { Text } from "react-native";
import { Drawer } from "expo-router/drawer";
import { useCycle } from "../../src/context/CycleContext";
import { PHASE_COLORS, COLORS } from "../../src/constants/theme";

function DrawerIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 22 }}>{emoji}</Text>;
}

export default function DrawerLayout() {
  const { currentPhase } = useCycle();
  const accentColor = currentPhase
    ? PHASE_COLORS[currentPhase.phase].primary
    : "#22C55E";

  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: accentColor,
        drawerInactiveTintColor: COLORS.textSecondary,
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.text,
        drawerStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Home",
          drawerIcon: () => <DrawerIcon emoji={"\uD83C\uDFE0"} />,
        }}
      />
      <Drawer.Screen
        name="log"
        options={{
          title: "Log",
          drawerIcon: () => <DrawerIcon emoji={"\u270D\uFE0F"} />,
        }}
      />
      <Drawer.Screen
        name="history"
        options={{
          title: "History",
          drawerIcon: () => <DrawerIcon emoji={"\uD83D\uDCC5"} />,
        }}
      />
      <Drawer.Screen
        name="insights"
        options={{
          title: "Insights",
          drawerIcon: () => <DrawerIcon emoji={"\uD83D\uDCA1"} />,
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: "Settings",
          drawerIcon: () => <DrawerIcon emoji={"\u2699\uFE0F"} />,
        }}
      />
    </Drawer>
  );
}
