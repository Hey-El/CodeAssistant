import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { StatusCard } from "./StatusCard";
import tw from "twrnc";

export default function Results() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { success, message } = params as {
    success: boolean;
    message: { message: string; location?: string };
  };

  if (!params) {
    return <Text>No results available.</Text>;
  }

  const newChallenge = () => {
    navigation.navigate("HomeScreen");
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View
        style={tw`flex-row justify-between items-center p-4 border-b border-gray-200`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold`}>Challenge Results</Text>
        <View style={tw`w-10`}></View>
      </View>

      <ScrollView style={tw`flex-1 p-4`}>
        <StatusCard success={success} message={message} />
      </ScrollView>

      <TouchableOpacity
        style={tw`mx-4 bg-orange-500 py-3 px-6 rounded-lg mt-4`}
        onPress={newChallenge}
      >
        <Text style={tw`text-white text-lg font-bold text-center`}>
          Complete new challenge
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
