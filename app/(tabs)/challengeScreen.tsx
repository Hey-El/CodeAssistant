import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/components/authstate";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import CodeEditor from "@rivascva/react-native-code-editor";
import { useNavigation } from "@react-navigation/native";

type SupportedLanguage =
  | "javascript"
  | "python"
  | "java"
  | "cpp"
  | "csharp"
  | "php";

// Judge0 language IDs mapping
const JUDGE0_LANGUAGE_IDS: Record<SupportedLanguage, number> = {
  javascript: 63, // JavaScript (Node.js 12.14.0)
  python: 71, // Python (3.8.1)
  java: 62, // Java (OpenJDK 13.0.1)
  cpp: 54, // C++ (GCC 9.2.0)
  csharp: 51, // C# (Mono 6.6.0.161)
  php: 68, // PHP (7.4.1)
};

function CodeChallenge() {
  const { codingChallenge } = useSelector(
    (state: RootState) => state.codeSnippet
  );
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] =
    useState<SupportedLanguage>("javascript");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();

  console.log("Redux state codingChallenge:", codingChallenge);

  const languages: Array<{ name: string; value: SupportedLanguage }> = [
    { name: "JavaScript", value: "javascript" },
    { name: "Python", value: "python" },
    { name: "Java", value: "java" },
    { name: "C++", value: "cpp" },
    { name: "C#", value: "csharp" },
    { name: "PHP", value: "php" },
  ];

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      Alert.alert("Error", "Please enter some code before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      const SERVER_URL = "https://codeassistant-app-q5sfn.ondigitalocean.app/";
      const response = await fetch(SERVER_URL + "submit-solution", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          languageId: JUDGE0_LANGUAGE_IDS[selectedLanguage],
          challenge: codingChallenge,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit solution");
      }

      const result = await response.json();
      console.log(result);

      if (result.errorDetails) {
        console.error("Backend system error:", result.errorDetails);
        Alert.alert("Server Error. Please try again later.");
        return;
      }

      if (!result || typeof result.success !== "boolean" || !result.message) {
        console.error("Invalid result object:", result);
        return;
      } // Navigate to results screen with the result data
      navigation.navigate("Results", result);
    } catch (error) {
      Alert.alert("Error", "Failed to submit code. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={tw`flex-1 bg-white`}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={tw`flex-1`}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <View style={tw`bg-gray-100 border-b border-gray-200`}>
            <ScrollView style={tw` p-4`}>
              <Text style={tw`text-base leading-6 text-gray-800`}>
                {codingChallenge || "No challenge available"}
              </Text>
            </ScrollView>

            <ScrollView
              horizontal
              style={tw`p-2 bg-gray-50`}
              showsHorizontalScrollIndicator={false}
            >
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.value}
                  style={[
                    tw`px-4 py-2 mx-1 rounded-full border-2`,
                    selectedLanguage === lang.value
                      ? tw`bg-blue-500 border-blue-500`
                      : tw`bg-white border-gray-200`,
                  ]}
                  onPress={() => setSelectedLanguage(lang.value)}
                >
                  <Text
                    style={[
                      tw`font-medium`,
                      selectedLanguage === lang.value && tw`text-white`,
                    ]}
                  >
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={tw`flex-1 m-2`}>
            <CodeEditor
              language={selectedLanguage}
              initialValue={code}
              onChange={handleCodeChange}
              style={tw`flex-1 bg-gray-900 rounded-lg`}
              showLineNumbers={true}
            />

            {isKeyboardVisible && (
              <TouchableOpacity
                style={tw`absolute right-4 bottom-4 bg-black/50 rounded-full w-10 h-10 justify-center items-center z-50`}
                onPress={Keyboard.dismiss}
              >
                <Ionicons name="chevron-down" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[
              tw`mx-4 mb-4 p-4 rounded-lg items-center`,
              isSubmitting ? tw`bg-gray-500` : tw`bg-green-500`,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={tw`flex-row items-center`}>
                <Ionicons name="play" size={24} color="white" />
                <Text style={tw`text-white text-base font-bold`}>Run</Text>
              </View>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default CodeChallenge;
