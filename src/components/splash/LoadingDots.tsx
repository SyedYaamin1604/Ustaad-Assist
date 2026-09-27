import React, { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';
import { splashColors, timings } from '../../types/splash-theme';

export default function LoadingDots() {
  const [anims] = useState(() => [0, 1, 2].map(() => new Animated.Value(0.3)));
  const [containerFade] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.delay(timings.dotsDelay),
      Animated.timing(containerFade, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    const loops = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(anim, { toValue: 1, duration: 380, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.3, duration: 380, useNativeDriver: true }),
          Animated.delay((2 - i) * 150),
        ])
      )
    );
    Animated.parallel(loops).start();
  }, []);

  return (
    <Animated.View style={{ flexDirection: 'row', opacity: containerFade, marginTop: 40 }}>
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            marginHorizontal: 4,
            backgroundColor: splashColors.dot,
            opacity: anim,
            transform: [{ scale: anim.interpolate({ inputRange: [0.3, 1], outputRange: [0.85, 1.15] }) }],
          }}
        />
      ))}
    </Animated.View>
  );
}