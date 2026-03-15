import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { COLORS, FONT_SIZES, SPACING } from "../src/constants/theme";

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Page Not Found</Text>
      <Link href="/" style={styles.link}>
        Go to Home
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  link: {
    fontSize: FONT_SIZES.md,
    color: "#3498DB",
  },
});
