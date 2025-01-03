import { ActivityIndicator, View } from "react-native";

export function LoadingOverlay() {
  return (
    <View>
      <ActivityIndicator size="large" />
    </View>
  );
}
