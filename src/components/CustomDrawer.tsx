import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
} from "../constants/theme";

interface DrawerItem {
  name: string;
  title: string;
  emoji: string;
}

interface CustomDrawerProps {
  items: DrawerItem[];
  activeRoute: string;
  accentColor: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (name: string) => void;
}

const DRAWER_WIDTH = Dimensions.get("window").width * 0.75;

export function CustomDrawer({
  items,
  activeRoute,
  accentColor,
  isOpen,
  onClose,
  onNavigate,
}: CustomDrawerProps) {
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, translateX, overlayOpacity]);

  if (!isOpen) {
    // Still render during close animation; hide after
    // We use overlayOpacity to determine visibility
  }

  return (
    <View style={styles.container} pointerEvents={isOpen ? "auto" : "none"}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[styles.drawer, { transform: [{ translateX }] }]}
      >
        <Text style={styles.header}>BroCycle</Text>
        {items.map((item) => {
          const isActive = activeRoute === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.item,
                isActive && { backgroundColor: accentColor + "18" },
              ]}
              onPress={() => {
                onNavigate(item.name);
                onClose();
              }}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text
                style={[
                  styles.itemText,
                  isActive && { color: accentColor, fontWeight: "bold" },
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: DRAWER_WIDTH,
    backgroundColor: COLORS.background,
    paddingTop: SPACING.xxl + SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  header: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.xs,
  },
  emoji: {
    fontSize: 22,
    marginRight: SPACING.md,
  },
  itemText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
});
