import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import tw from "twrnc"; // Import twrnc

export function LoadingOverlay() {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3], // Grows 30% larger
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.3], // Fades slightly
  });

  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Animated.View
        style={[
          tw`w-10 h-10 rounded-full bg-purple-600`, // 40px = ~10 in Tailwind units
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
    </View>
  );
}
