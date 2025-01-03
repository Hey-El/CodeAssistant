import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import React, { useState, useContext, useCallback } from "react";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { AuthContext } from "../components/auth-context";
import { globalStyles } from "./styles";
import { imageEnhancer } from "./imageEnhance";
import { LoadingOverlay } from "./loading";

const Index = React.memo(() => {
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const { userId } = useContext(AuthContext);
  const [pickedImage, setPickedImage] = useState();
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();
  const [explanation, setExplanation] = useState("");

  const fetchWithTimeout = (url, options, timeout = 20000) => {
    // Set timeout to 20 seconds
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), timeout)
      ),
    ]);
  };

  //verify permissions
  async function verifyPermission() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }
    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert("You need to grant permission to use camera for this app");
      return false;
    }
    return true;
  }

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
    console.log(enhanced);

    //send data to backend
    const formattedUri = enhanced.replace("file://", "");
    const formData = new FormData();
    formData.append("image", {
      uri: formattedUri,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    console.log(userId);

    formData.append("userId", String(userId));
    console.log(formData);

    setIsLoading(true);

    try {
      const response = await fetchWithTimeout(
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
      console.log("Response from backend:", responseData);
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

  let imagePreview = (
    <Text style={globalStyles.textButton}>No image taken</Text>
  );

  if (pickedImage) {
    imagePreview = (
      <Image style={globalStyles.imagePreview} source={{ uri: pickedImage }} />
    );
  }
  return (
    <View style={globalStyles.colouredContainer}>
      <View style={globalStyles.image}>{imagePreview}</View>
      <View style={globalStyles.ExplanationtextContainer}>
        <ScrollView>
          <Text style={globalStyles.explanationText}>
            {isLoading && <LoadingOverlay />}
            Code Explanation: {explanation}
          </Text>
        </ScrollView>
      </View>
      <View style={globalStyles.container}>
        <TouchableOpacity
          style={globalStyles.buttons}
          onPress={takeImageHandler}
        >
          <Text style={globalStyles.textButton}>Take Image</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default Index;
