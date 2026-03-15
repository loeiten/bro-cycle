import React from "react";
import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCycle } from "../../src/context/CycleContext";
import { PHASE_COLORS, COLORS, GRADIENTS } from "../../src/constants/theme";

function TabIcon({
  emoji,
  focused,
  color,
}: {
  emoji: string;
  focused: boolean;
  color: string;
}) {
  return (
    <View
      style={[
        {
          borderRadius: 14,
          paddingHorizontal: 12,
          paddingVertical: 4,
          alignItems: "center",
          justifyContent: "center",
        },
        focused && { backgroundColor: color + "20" },
      ]}
    >
      <Text style={{ fontSize: 24 }}>{emoji}</Text>
    </View>
  );
}

export default function TabLayout() {
  const { currentPhase } = useCycle();
  const accentColor = currentPhase
    ? PHASE_COLORS[currentPhase.phase].primary
    : "#22C55E";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: accentColor,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarBackground: () => (
          <LinearGradient colors={[...GRADIENTS.tabBar]} style={{ flex: 1 }} />
        ),
        tabBarStyle: {
          borderTopWidth: 0,
        },
        headerStyle: {
          backgroundColor: COLORS.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: COLORS.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji={"\uD83C\uDFE0"} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: "Log",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji={"\u270D\uFE0F"} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji={"\uD83D\uDCC5"} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji={"\uD83D\uDCA1"} focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon emoji={"\u2699\uFE0F"} focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
