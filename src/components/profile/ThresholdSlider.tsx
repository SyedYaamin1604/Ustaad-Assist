import React, { useCallback, useMemo, useRef, useState } from "react";
import { PanResponder, View, Text, LayoutChangeEvent } from "react-native";

type Tick = { value: number; label: string };

type ThresholdSliderProps = {
  min: number;
  max: number;
  value: number;
  onChange: (next: number) => void;
  ticks: Tick[];
  /** e.g. (v) => `${v}%` */
  formatBubble?: (value: number) => string;
};

const THUMB_SIZE = 44;
const TRACK_HEIGHT = 6;

/**
 * A single-handle slider styled after the mockup: a black filled
 * track, a black circular thumb carrying the live value, and evenly
 * spaced tick labels underneath. Built on PanResponder only, so it
 * has no extra native dependency.
 */
export function ThresholdSlider({
  min,
  max,
  value,
  onChange,
  ticks,
  formatBubble = (v) => `${v}%`,
}: ThresholdSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  // Track the track's absolute X origin so PanResponder's screen
  // coordinates (moveX) can be converted into local track coordinates.
  const [trackPageX, setTrackPageX] = useState(0);
  const trackRef = useRef<View>(null);

  const clamp = useCallback(
    (v: number) => Math.min(max, Math.max(min, v)),
    [min, max]
  );

  const valueToX = useCallback(
    (v: number) => {
      const ratio = (v - min) / (max - min);
      return ratio * trackWidth;
    },
    [min, max, trackWidth]
  );

  const xToValue = useCallback(
    (x: number) => {
      const ratio = clamp0to1(x / trackWidth);
      const raw = min + ratio * (max - min);
      return clamp(Math.round(raw));
    },
    [min, max, clamp, trackWidth]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_evt, gesture) => {
          // moveX is in screen coordinates; convert via measured track.
          onChange(xToValue(gesture.moveX - trackPageX));
        },
        onPanResponderGrant: (evt) => {
          onChange(xToValue(evt.nativeEvent.locationX));
        },
      }),
    [xToValue, onChange, trackPageX]
  );

  const onTrackLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
    trackRef.current?.measure((_x, _y, _w, _h, pageX) => setTrackPageX(pageX));
  };

  const thumbX = trackWidth ? valueToX(value) : 0;
  const fillWidth = trackWidth ? valueToX(value) : 0;

  return (
    <View>
      <View className="pt-6" style={{ height: THUMB_SIZE }}>
        <View
          onLayout={onTrackLayout}
          onStartShouldSetResponder={() => true}
          ref={trackRef}
          className="justify-center"
          style={{ height: TRACK_HEIGHT }}
        >
          <View
            className="w-full rounded-full bg-gray-200"
            style={{ height: TRACK_HEIGHT }}
          />
          <View
            className="absolute left-0 rounded-full bg-black"
            style={{ height: TRACK_HEIGHT, width: fillWidth }}
          />
        </View>

        <View
          {...panResponder.panHandlers}
          className="absolute items-center justify-center rounded-full bg-black"
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            left: thumbX - THUMB_SIZE / 2,
            top: 0,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
          }}
        >
          <Text className="text-white text-xs font-bold">
            {formatBubble(value)}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between mt-2">
        {ticks.map((tick) => (
          <Text
            key={tick.value}
            className={
              tick.value === value
                ? "text-black text-xs font-semibold"
                : "text-gray-400 text-xs"
            }
          >
            {tick.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

function clamp0to1(n: number) {
  return Math.min(1, Math.max(0, n));
}