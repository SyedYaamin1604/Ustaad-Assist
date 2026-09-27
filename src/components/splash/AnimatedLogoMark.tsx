// components/AnimatedLogoMark.tsx
import React, { useEffect, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { splashColors, timings } from '../../types/splash-theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Approximate length of the checkmark path below — used to drive the
// stroke "drawing" animation via strokeDasharray/strokeDashoffset.
const CHECK_PATH_LENGTH = 70;
const CHECK_PATH_D = 'M20 34 L31 45 L52 20';

interface AnimatedLogoMarkProps {
  size?: number;
  onEntranceComplete?: () => void;
}

export default function AnimatedLogoMark({
  size = 132,
  onEntranceComplete,
}: AnimatedLogoMarkProps) {
  const [purple] = useState(() => new Animated.Value(0));
  const [pink] = useState(() => new Animated.Value(0));
  const [teal] = useState(() => new Animated.Value(0));
  const [card] = useState(() => new Animated.Value(0));
  const [checkProgress] = useState(() => new Animated.Value(0));
  const [float] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.stagger(timings.shapesStagger, [
      Animated.spring(purple, { toValue: 1, useNativeDriver: true, friction: 7, tension: 60 }),
      Animated.spring(pink, { toValue: 1, useNativeDriver: true, friction: 7, tension: 60 }),
      Animated.spring(teal, { toValue: 1, useNativeDriver: true, friction: 7, tension: 60 }),
      Animated.spring(card, { toValue: 1, useNativeDriver: true, friction: 6, tension: 70 }),
    ]).start();

    Animated.sequence([
      Animated.delay(timings.checkDelay),
      Animated.timing(checkProgress, {
        toValue: 1,
        duration: timings.checkDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false, // strokeDashoffset isn't supported by the native driver
      }),
    ]).start(() => onEntranceComplete?.());

    Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const shapeTransform = (anim: Animated.Value, fromScale: number, rotateDeg: string) => ({
    opacity: anim,
    transform: [
      { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [fromScale, 1] }) },
      { rotate: rotateDeg },
    ],
  });

  const floatTranslate = float.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  const strokeDashoffset = checkProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [CHECK_PATH_LENGTH, 0],
  });

  return (
    <View style={{ width: size * 1.55, height: size * 1.55, alignItems: 'center', justifyContent: 'center' }}>
      {/* Back shape — purple */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size * 0.32,
            backgroundColor: splashColors.purpleShape,
            left: size * 0.02,
            top: size * 0.18,
          },
          shapeTransform(purple, 0.6, '-18deg'),
        ]}
      />
      {/* Mid shape — pink */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size * 0.32,
            backgroundColor: splashColors.pinkShape,
            left: size * 0.1,
            top: size * 0.02,
          },
          shapeTransform(pink, 0.6, '14deg'),
        ]}
      />
      {/* Mid shape — teal */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size * 0.32,
            backgroundColor: splashColors.tealShape,
            left: size * 0.34,
            top: size * 0.1,
          },
          shapeTransform(teal, 0.6, '10deg'),
        ]}
      />

      {/* Front card — checkmark */}
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size * 0.3,
            backgroundColor: splashColors.cardBottom,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#7A5A00',
            shadowOpacity: 0.25,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 10 },
            elevation: 10,
          },
          shapeTransform(card, 0.5, '0deg'),
          { transform: [{ translateY: floatTranslate }] },
        ]}
      >
        <Svg width={size * 0.55} height={size * 0.55} viewBox="0 0 70 60">
          <AnimatedPath
            d={CHECK_PATH_D}
            stroke={splashColors.ink}
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray={CHECK_PATH_LENGTH}
            strokeDashoffset={strokeDashoffset}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}