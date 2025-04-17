import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { LoadingOverlay } from "./loading";
import { imageEnhancer } from "./imageEnhance";
import { useSubscription } from "./useSubscription";
import {
  RootState,
  setCodingChallenges,
  setLanguage,
  store,
} from "@/components/authstate";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";
import sendExplanation from "./textExtract";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SERVER_URL } from "./server";

const Index = React.memo(() => {
  const [isLoading, setIsLoading] = useState(false);
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();
  const [explanation, setExplanation] = useState("");
  const { updateCustomerInfo } = useSubscription();
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [imageTaken, setImageTaken] = useState(false);

  //verify permissions
  const verifyPermission = useCallback(async () => {
    if (!cameraPermissionInformation) {
      return false; // Or handle this case appropriately
    }
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }
    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Camera access is required to take and upload images of your code."
      );
      return false;
    }
    return true;
  }, [cameraPermissionInformation, requestPermission]);

  // Verify permission at the start
  useEffect(() => {
    const initializePermissions = async () => {
      const hasPermission = await verifyPermission();
      setHasCameraPermission(hasPermission);
    };

    initializePermissions();
  }, []);

  //takes image
  async function takeImageHandler() {
    setExplanation("");
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      return;
    }
    //if permission is granted, launch camera
    const image = await launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
      aspect: [16, 9],
    });
    //if image is taken, set the image uri
    setImageTaken(image.assets[0].uri);
    // Get the image URI
    const imageUri = image.assets[0].uri;
    console.log("Image URI:", imageUri);
    // Enhance the image
    const enhanced = await imageEnhancer(imageUri);
    const formattedUri = enhanced.replace("file://", "");
    const formData = new FormData();
    formData.append("image", {
      uri: formattedUri,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    formData.append("userId", userId);
    console.log("Form data:", formData);
    setIsLoading(true);

    try {
      //create a controller to abort the request if it takes too long
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      //send the form data to the server
      const response = await fetch(SERVER_URL + "upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      //if the response is not ok, throw an error
      if (!response.ok) {
        throw new Error("Image upload failed");
      }
      //if the response is ok, parse the response as json
      const responseData = await response.json();
      console.log("Response data:", responseData);
      if (responseData.explanation) {
        setExplanation(responseData.explanation);
      } else {
        setExplanation("You have reached the scan upload limit for the month");
      }
    } catch (error) {
      if (error.message.includes("AbortError")) {
        setExplanation("The request took too long. Please try again.");
      } else {
        setExplanation("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const codingHandler = async () => {
    if (!explanation) {
      console.log("No explanation returned");
      return; // Exit if no explanation is available
    } else {
      try {
        const returnedChallenge = await sendExplanation(explanation);
        console.log("Returned challenge structure:", returnedChallenge);

        if (returnedChallenge && returnedChallenge.codingChallenge) {
          // Handle both possible response structures
          const challengeText =
            typeof returnedChallenge.codingChallenge === "object"
              ? returnedChallenge.codingChallenge.codingChallenge
              : returnedChallenge.codingChallenge;

          dispatch(setCodingChallenges(challengeText));
          navigation.navigate("Challenges");
        } else {
          console.error("Problem retrieving coding challenge");
          Alert.alert("Error", "Could not retrieve coding challenge");
        }
      } catch (error) {
        console.error("Error in coding handler:", error);
        Alert.alert("Error", "An error occurred when retrieving the challenge");
      }
    }
  };

  if (isLoading) {
    return (
      <View style={tw`flex-2 justify-end items-center pb-12`}>
        <LoadingOverlay />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={tw`flex-1 bg-gray-50 rounded-2xl shadow-lg border border-gray-200`}
    >
      {explanation ? (
        <>
          <View style={tw`bg-blue-600 py-4 px-6 rounded-t-2xl shadow-md`}>
            <Text style={tw`text-white text-lg font-bold text-center`}>
              Code Explanation
            </Text>
          </View>
          {/* Explanation Section */}
          <View style={tw`flex-1 p-6`}>
            <ScrollView>
              <Text style={tw`text-gray-800 text-lg font-medium`}>
                {isLoading && <LoadingOverlay />}
                {explanation}
              </Text>
            </ScrollView>
          </View>

          {/* Complete Similar Challenges Button */}
          <View style={tw`px-4 pb-6`}>
            <TouchableOpacity
              style={tw`mx-4 bg-orange-500 py-3 px-6 rounded-lg mt-4`}
              onPress={codingHandler}
            >
              <Text style={tw`text-white text-lg font-bold text-center`}>
                Complete similar challenges
              </Text>
            </TouchableOpacity>

            {/* Take Another Image Button */}
            <TouchableOpacity
              style={tw`mx-4 bg-orange-500 py-3 px-6 rounded-lg mt-4`}
              onPress={takeImageHandler}
            >
              <Text style={tw`text-white text-lg font-bold text-center`}>
                Take Image
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        // No Explanation Available: Show "Capture Your Code" Screen
        <View style={tw`items-center flex-1 justify-center px-6`}>
          <View style={tw`bg-blue-50 rounded-full p-8 mb-8 shadow-md`}>
            <Ionicons name="camera" size={80} color="#3b82f6" />
          </View>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-2 text-center`}>
            Capture Your Code
          </Text>
          <Text style={tw`text-base text-gray-600 mb-8 text-center leading-5`}>
            Take a photo of your code to get an explanation and similar coding
            challenges
          </Text>
          <TouchableOpacity
            style={tw`w-full bg-orange-500 py-4 px-6 rounded-xl shadow-lg`}
            onPress={takeImageHandler}
          >
            <Text style={tw`text-white text-lg font-bold text-center`}>
              Take Image
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
});

export default Index;
