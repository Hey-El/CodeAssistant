import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { useContext, useCallback, useState } from "react";
import { AuthContext } from "@/components/auth-context";
import { globalStyles } from "./styles";
import { useSubscription } from "./useSubscription";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import Purchases from "react-native-purchases";
import upgradeSubscription from "./Payment";
import { LoadingOverlay } from "./loading";
import { useFocusEffect } from "@react-navigation/native";

function Settings() {
  const authCtx = useContext(AuthContext);
  const { isProMember, currentOffering, updateCustomerInfo } =
    useSubscription();
  const [isLoading, setIsLoading] = useState(false);

  const handleMonthlyPurchase = useCallback(async () => {
    if (!currentOffering?.monthly) {
      Alert.alert("Error", "Monthly subscription offering is not available.");
      return;
    }

    // Set loading to true when the purchase flow starts
    setIsLoading(true);

    try {
      // Start the purchase flow with the monthly package
      await Purchases.purchasePackage(currentOffering.monthly);
      Alert.alert("Your upgrade was a success");
    } catch (error) {
      console.error("Error during purchase:", error);
      Alert.alert("Error", "There was an issue during the purchase.");
    } finally {
      // Set loading to false when the process is complete, regardless of success or failure
      setIsLoading(false);
    }
  }, [currentOffering]);

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

  const LogOutUser = useCallback(async () => {
    await authCtx.logout();
  }, [authCtx]);

  const handleUpgrade = useCallback(async () => {
    try {
      console.log("Auth context:", authCtx);
      const paywallResult = await RevenueCatUI.presentPaywall();
      console.log("Paywall result:", paywallResult);

      // Handle the result
      switch (paywallResult) {
        case PAYWALL_RESULT.PURCHASED:
          await handleMonthlyPurchase();
          if (!authCtx.userId) {
            console.error(
              "User ID is null or undefined. Cannot upgrade subscription."
            );
            return;
          }
          console.log("sending userID to upgradesubscription", authCtx.userId);
          const upgradeResponse = await upgradeSubscription({
            userId: authCtx.userId,
          });
          console.log("Upgrade response:", upgradeResponse);
          // Fetch updated customer info and call the updater
          const updatedCustomerInfo = await Purchases.getCustomerInfo();
          console.log(
            "Entitlements Active:",
            updatedCustomerInfo.entitlements.active
          );
          // Update state and isProMember
          updateCustomerInfo(updatedCustomerInfo);
          console.log("Updated isProMember:", isProMember);
          break;
        case PAYWALL_RESULT.ERROR:
          alert("An error occurred while presenting the paywall.");
          break;
        case PAYWALL_RESULT.CANCELLED:
          console.log("User cancelled the paywall.");
          break;
        default:
          console.log("Unknown paywall result:", paywallResult);
      }
    } catch (error) {
      console.error("Error presenting paywall:", error);
    }
  }, [authCtx.userId, handleMonthlyPurchase]);

  const subscriptionMessage = isProMember
    ? "You are a PRO member!"
    : currentOffering
    ? "Upgrade to access PRO features!"
    : "Upgrade unavailable at the moment";

  if (isLoading) {
    return (
      <View style={globalStyles.bottomButtonContainer}>
        <LoadingOverlay />
        <Text>Loading My Account...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/icon.png")} // Path to your icon.png
      style={globalStyles.colouredContainer} // Ensure your globalStyles.container includes flex: 1 for proper layout
      resizeMode="cover" // Adjust how the image fits (e.g., 'cover', 'contain', etc.)
    >
      <View style={globalStyles.thirdContainer}>
        <View style={globalStyles.image}>
          <Text style={globalStyles.textButton}>{subscriptionMessage}</Text>
        </View>
      </View>

      <View style={globalStyles.bottomButtonContainer}>
        {!isProMember && (
          <TouchableOpacity
            style={globalStyles.buttons}
            disabled={isLoading}
            onPress={handleUpgrade}
          >
            {isLoading ? (
              <LoadingOverlay /> // Show spinner while loading
            ) : (
              <Text style={globalStyles.textButton}>Upgrade now</Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity style={globalStyles.buttons} onPress={LogOutUser}>
          <Text style={globalStyles.textButton}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
export default Settings;
