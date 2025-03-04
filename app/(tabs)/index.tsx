import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { LoadingOverlay } from "./loading";
import { useFocusEffect } from "@react-navigation/native";
import { imageEnhancer } from "./imageEnhance";
import { useSubscription } from "./useSubscription";
import Purchases from "react-native-purchases";
import checkSubscription from "./checkSubscription";
import { RootState, setCodingChallenges } from "@/components/authstate";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";
import sendExplanation, { extractKeywords } from "./textExtract";
import { sendKeywordsApi } from "./challengeApi";

const Index = React.memo(() => {
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [pickedImage, setPickedImage] = useState();
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();
  const [explanation, setExplanation] = useState("");
  const { updateCustomerInfo } = useSubscription();
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const dispatch = useDispatch();

  // Use useFocusEffect to handle loading when the tab is pressed
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true); // Set loading to true when the tab is pressed
      // Simulate data fetching or perform actual operations here
      const timer = setTimeout(() => {
        setIsLoading(false); // Set loading to false after operations complete
      }, 1000); // Simulate 1-second load time

      return () => clearTimeout(timer); // Cleanup timer when the tab is unfocused
    }, [])
  );

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
    const image = await launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
      aspect: [16, 9],
    });
    setPickedImage(image.assets[0].uri);
    const enhanced = await imageEnhancer(image.assets[0].uri);
    //send data to backend
    const formattedUri = enhanced.replace("file://", "");
    const formData = new FormData();
    formData.append("image", {
      uri: formattedUri,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    formData.append("userId", String(userId));
    setIsLoading(true);

    if (userId) {
      // Proceed with the function call because userId is guaranteed to be a string here
      await Purchases.logIn(userId);
    } else {
      console.error("User ID is null or undefined");
      // Handle the error appropriately, e.g., show an alert or navigate to login
    }
    // Fetch latest customer info (including entitlements)
    const customerInfo = await Purchases.getCustomerInfo();
    updateCustomerInfo(customerInfo);

    // Determine the proStatus (either "Pro" or "Free")
    const proStatus = customerInfo.entitlements.active["Pro access"]
      ? "Pro"
      : "Free";

    // Optionally, call your backend to sync this info
    await checkSubscription(userId, proStatus);

    try {
      const response = await fetch(
        "https://codeassistant-cc828ac15c2e.herokuapp.com/upload",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const responseData = await response.json();
      if (responseData.explanation) {
        setExplanation(responseData.explanation);
      } else {
        setExplanation("You have reached the scan upload limit for the month");
      }
    } catch (error) {
      if (error.message.includes("timed out")) {
        setExplanation("The request took too long. Please try again.");
      } else {
        setExplanation("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false); // Reset loading state to false
    }
  }

  // Coding Handler for extracting keywords and calling Codewars API
  const codingHandler = async () => {
    if (!explanation) {
      console.log ("No explanation returned")
      return; // Exit if no explanation is available
    } else {
      const extractedKeywords = sendExplanation(explanation);
      console.log("Extracted Keywords:", extractedKeywords);
      const apiData = await sendKeywordsApi(extractedKeywords);

      if (apiData) {
        dispatch (setCodingChallenges(apiData))
      }
      else {
        console.error("API data is invalid or missing the expected structure.");
      }
    }
  };

  let imagePreview = (
    <Text style={tw`text-gray-800 text-lg font-bold text-center`}>
      No image taken
    </Text>
  );

  if (pickedImage) {
    imagePreview = (
      <Image
        style={tw`w-full h-full rounded-lg`}
        source={{ uri: pickedImage }}
      />
    );
  }

  if (isLoading) {
    return (
      <View style={tw`flex-2 justify-end items-center pb-12`}>
        <LoadingOverlay />
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={tw`flex-1 p-4 bg-white`}>
      <View
        style={tw`mx-4 mr-4 w-auto h-56 mb-4 rounded-lg overflow-hidden border border-gray-300 p-4 bg-gray-100`}
      >
        {imagePreview}
      </View>
      <View style={tw`mx-4 flex-1 mb-4 border border-gray-300 p-4 bg-gray-100`}>
        <ScrollView>
          <Text style={tw`text-lg text-center text-gray-800`}>
            {isLoading && <LoadingOverlay />}
            Code Explanation: {explanation}
          </Text>
        </ScrollView>
      </View>
      {explanation && (
        <TouchableOpacity
          style={tw`mx-4 bg-orange-500 py-3 px-6 rounded-lg mt-4`}
          onPress={codingHandler}
        >
          <Text style={tw`text-white text-lg font-bold text-center`}>
            Complete similar challenges
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={tw`mx-4 bg-orange-500 py-3 px-6 rounded-lg mt-4`}
        onPress={takeImageHandler}
      >
        <Text style={tw`text-white text-lg font-bold text-center`}>
          Take Image
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
});

export default Index;
