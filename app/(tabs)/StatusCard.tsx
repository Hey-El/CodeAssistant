import { Animated, Text } from "react-native";
import { useRef, useEffect } from "react";
import tw from "twrnc";

export const StatusCard = ({ success, message }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        tw`p-6 rounded-xl mb-6 shadow-md`,
        success ? tw`bg-green-50` : tw`bg-red-50`,
        { opacity: fadeAnim },
      ]}
    >
      {/* Display message */}
      <Text style={tw`text-lg font-bold`}>
        {success ? "✅ Passed" : "❌ Failed"}
      </Text>
      <Text style={tw`mt-2`}>{message?.message}</Text>
      {message?.location && (
        <Text style={tw`mt-1 text-red-500`}>
          Error Location: {message.location}
        </Text>
      )}
    </Animated.View>
  );
};
