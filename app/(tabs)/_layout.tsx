import React from "react";
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useCycle } from "../../src/context/CycleContext";
import { PHASE_COLORS, COLORS } from "../../src/constants/theme";

export default function TabLayout() {
  const { currentPhase } = useCycle();
  const accentColor = currentPhase
    ? PHASE_COLORS[currentPhase.phase].primary
    : "#2ECC71";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: accentColor,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerTintColor: COLORS.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>&#x1F3E0;</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: "Log",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>&#x270D;&#xFE0F;</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>&#x1F4C5;</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>&#x1F4A1;</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>&#x2699;&#xFE0F;</Text>
          ),
        }}
      />
    </Tabs>
  );
}
