import React, { useEffect, useRef } from 'react';
import { View, Animated, Image } from 'react-native';

interface AnimatedSplashScreenProps {
  onAnimationFinish?: () => void;
}

export default function AnimatedSplashScreen({ onAnimationFinish }: AnimatedSplashScreenProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Pulsing animation
    const pulseSequence = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.15,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);

    // Loop the pulse animation twice, then fade out
    Animated.loop(pulseSequence, { iterations: 2 }).start(() => {
      // Fade out after animation completes
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onAnimationFinish?.();
      });
    });
  }, []);

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: pulseAnim }],
        }}
        className="items-center justify-center"
      >
        {/* Main icon */}
        <Image
          source={require('../../../assets/splash-icon.png')}
          className="w-48 h-48"
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}
