// components/ThresholdSlider.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, PanResponder, LayoutChangeEvent } from 'react-native';

interface ThresholdSliderProps {
  value: number; // 0-100
  min: number;
  max: number;
  onChange: (value: number) => void;
  scaleLabels: number[]; // e.g. [50, 65, 75, 90]
}

export default function ThresholdSlider({
  value,
  min,
  max,
  onChange,
  scaleLabels,
}: ThresholdSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const valueFromX = (x: number) => {
    if (trackWidth <= 0) return value;
    const ratio = clamp((x / trackWidth) * (max - min) + min);
    return Math.round(ratio);
  };

  // Rebuilt when inputs change so the handlers never see a stale trackWidth.
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => onChange(valueFromX(e.nativeEvent.locationX)),
        onPanResponderMove: (e) => onChange(valueFromX(e.nativeEvent.locationX)),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trackWidth, min, max, value, onChange]
  );

  const onTrackLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const percent = (value - min) / (max - min);
  const fillWidth = trackWidth * percent;
  const thumbLeft = Math.max(0, Math.min(trackWidth - 24, fillWidth - 12));

  return (
    <View className="mt-1">
      {/* Track */}
      <View
        onLayout={onTrackLayout}
        {...panResponder.panHandlers}
        className="h-8 justify-center"
      >
        <View
          className="h-2 rounded-full w-full overflow-hidden flex-row"
          style={{ backgroundColor: '#E4E6F2' }}
        >
          <View style={{ width: fillWidth, backgroundColor: '#111318', borderRadius: 999 }} />
        </View>

        {/* Diamond thumb + value label */}
        {trackWidth > 0 && (
          <View
            pointerEvents="none"
            style={{ position: 'absolute', left: thumbLeft, top: -26, alignItems: 'center' }}
          >
            <View
              style={{
                backgroundColor: '#111318',
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 8,
                marginBottom: 4,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                {value}%
              </Text>
            </View>
            <View
              style={{
                width: 22,
                height: 22,
                backgroundColor: '#111318',
                borderRadius: 5,
                transform: [{ rotate: '45deg' }],
                borderWidth: 3,
                borderColor: '#FFFFFF',
              }}
            />
          </View>
        )}
      </View>

      {/* Scale labels */}
      <View className="flex-row justify-between mt-3">
        {scaleLabels.map((label) => (
          <Text
            key={label}
            className="text-[11px]"
            style={{
              color: label === value ? '#111318' : '#B7BAC6',
              fontWeight: label === value ? '700' : '400',
            }}
          >
            {label}%
          </Text>
        ))}
      </View>
    </View>
  );
}