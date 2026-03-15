import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, Redirect } from "expo-router";
import { CycleProvider, useCycle } from "../src/context/CycleContext";

function RootNavigator() {
  const { isLoading, hasOnboarded } = useCycle();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  if (!hasOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <CycleProvider>
      <RootNavigator />
    </CycleProvider>
  );
}
