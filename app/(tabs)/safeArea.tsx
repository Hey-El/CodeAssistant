// components/ScreenLayout.js
import { View, StatusBar, StatusBarStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { ReactNode } from "react";

interface ScreenLayoutProps {
  children: ReactNode;
  barStyle?: StatusBarStyle;
}

const ScreenLayout = ({
  children,
  barStyle = "dark-content",
}: ScreenLayoutProps) => {
  return (
    <SafeAreaView edges={["top", "bottom"]} style={tw`flex-1 bg-white`}>
      <StatusBar backgroundColor="#ffffff" barStyle={barStyle} />
      <View style={tw`flex-1 bg-white`}>{children}</View>
    </SafeAreaView>
  );
};

export default ScreenLayout;
