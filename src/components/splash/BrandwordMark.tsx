import React, { useEffect, useState } from 'react';
import { Animated, Text } from 'react-native';
import { splashColors, timings } from '../../types/splash-theme';

interface BrandWordmarkProps {
  title: string;
  tagline: string;
}

export default function BrandWordmark({ title, tagline }: BrandWordmarkProps) {
  const [titleAnim] = useState(() => new Animated.Value(0));
  const [taglineAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.delay(timings.wordmarkDelay),
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: timings.wordmarkDuration,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(timings.taglineDelay),
      Animated.timing(taglineAnim, {
        toValue: 1,
        duration: timings.taglineDuration,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const riseStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
    ],
  });

  return (
    <Animated.View style={{ alignItems: 'center', marginTop: 28 }}>
      <Animated.Text
        style={[
          {
            fontSize: 28,
            fontFamily: 'Outfit-Bold',
            color: splashColors.ink,
            letterSpacing: -0.5,
          },
          riseStyle(titleAnim),
        ]}
      >
        {title}
      </Animated.Text>
      <Animated.Text
        style={[
          {
            fontSize: 13.5,
            fontFamily: 'Outfit-Medium',
            color: splashColors.inkMuted,
            marginTop: 6,
          },
          riseStyle(taglineAnim),
        ]}
      >
        {tagline}
      </Animated.Text>
    </Animated.View>
  );
}