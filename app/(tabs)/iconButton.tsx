import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  size: number;
  color: string;
  onPress?: () => void; // Mark onPress as optional
}

function IconButton({ icon, size, color, onPress }: IconButtonProps) {
  return (
    <Pressable onPress={onPress}>
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
}

export default IconButton;
