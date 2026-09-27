import React, { useEffect, useState } from "react";
import { Animated, Pressable } from "react-native";

type ToggleSwitchProps = {
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

const TRACK_WIDTH = 48;
const TRACK_HEIGHT = 28;
const THUMB_SIZE = 22;
const THUMB_PADDING = (TRACK_HEIGHT - THUMB_SIZE) / 2;

/**
 * Black-track / white-thumb switch, matching the "Auto-sync semester
 * calendar" control in the mockup. Kept dependency-free (Animated
 * only) so it drops into any RN + NativeWind project.
 */
export function ToggleSwitch({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel,
}: ToggleSwitchProps) {
  const [progress] = useState(() => new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [value, progress]);

  const trackColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E2E3E8", "#111114"],
  });

  const thumbTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_PADDING, TRACK_WIDTH - THUMB_SIZE - THUMB_PADDING],
  });

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Animated.View
        style={{
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
          backgroundColor: trackColor,
          justifyContent: "center",
        }}
      >
        <Animated.View
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_SIZE / 2,
            backgroundColor: "#FFFFFF",
            transform: [{ translateX: thumbTranslateX }],
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
            elevation: 2,
          }}
        />
      </Animated.View>
    </Pressable>
  );
}