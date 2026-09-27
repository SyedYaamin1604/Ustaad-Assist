// SplashScreen.tsx
import React, { useEffect, useState } from 'react';
import { Animated, View, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import AnimatedLogoMark from "../splash/AnimatedLogoMark";
import BrandWordmark from '../splash/BrandwordMark';
import LoadingDots from '../splash/LoadingDots';
import { splashColors, SPLASH_MIN_DURATION_MS, timings } from '../../types/splash-theme';

interface SplashScreenProps {
  /** Called once the minimum duration has elapsed and the fade-out finishes. */
  onFinish: () => void;
  /** Override the minimum hold time (ms). Defaults to SPLASH_MIN_DURATION_MS (5000). */
  minDurationMs?: number;
}

export default function SplashScreen({
  onFinish,
  minDurationMs = SPLASH_MIN_DURATION_MS,
}: SplashScreenProps) {
  const [fade] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: timings.fadeOutDuration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onFinish();
      });
    }, minDurationMs);

    return () => clearTimeout(timer);
  }, [minDurationMs]);

  return (
    <Animated.View style={{ flex: 1, opacity: fade }}>
      <StatusBar barStyle="dark-content" backgroundColor={splashColors.bgTop} />
      <LinearGradient
        colors={[splashColors.bgTop, splashColors.bgBottom]}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <AnimatedLogoMark />
        <BrandWordmark title="UstaadAssist" tagline="Your semester, on track." />
        <LoadingDots />

        <View style={{ position: 'absolute', bottom: 44 }}>
          <View
            style={{
              width: 90,
              height: 4,
              borderRadius: 2,
              backgroundColor: splashColors.ink,
              opacity: 0.9,
            }}
          />
        </View>
      </LinearGradient>
    </Animated.View>
  );
}