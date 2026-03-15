import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { CycleProvider, useCycle } from "../src/context/CycleContext";

function RootNavigator() {
  const { isLoading, hasOnboarded } = useCycle();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !hasOnboarded) {
      router.replace("/onboarding");
    }
  }, [isLoading, hasOnboarded, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
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
