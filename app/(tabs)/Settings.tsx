import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import React, { useContext, useCallback, useState } from "react";
import { AuthContext } from "@/components/auth-context";
import { globalStyles } from "./styles";
import { useSubscription } from "./useSubscription";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import Purchases from "react-native-purchases";
import upgradeSubscription from "./Payment";
import { LoadingOverlay } from "./loading";
import { useFocusEffect } from "@react-navigation/native";
import { deleteUser } from "./auth";
import { Linking } from "react-native";

const handleTermsClick = () => {
  Linking.openURL(
    "https://codeassistant-cc828ac15c2e.herokuapp.com/terms-of-service"
  ).catch((err) => console.error("Failed to open URL:", err));
};

const handleSubmitClick = () => {
  Linking.openURL(
    "https://codeassistant-cc828ac15c2e.herokuapp.com/customer-support"
  ).catch((err) => console.error("Failed to open URL:", err));
};

const Settings = React.memo(() => {
  const authCtx = useContext(AuthContext);
  const { isProMember, currentOffering, updateCustomerInfo } =
    useSubscription();
  const [isLoading, setIsLoading] = useState(false);

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

  const LogOutUser = useCallback(async () => {
    await authCtx.logout();
  }, [authCtx]);

  const DeleteUserHandler = async () => {
    try {
      const response = await deleteUser(authCtx.authToken);
      console.log(response);
      if (response.kind === "identitytoolkit#DeleteAccountResponse") {
        Alert.alert("Account successfully deleted");
        await authCtx.logout(); // Log the user out after deletion
      } else {
        Alert.alert(
          "Failed to delete account. Please log out of account and log back in again to delete account."
        );
      }
    } catch (error) {
      Alert.alert("An unexpected error occurred.");
    }
  };

  const handleUpgrade = useCallback(async () => {
    try {
      const paywallResult = await RevenueCatUI.presentPaywall();
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
          const upgradeResponse = await upgradeSubscription({
            userId: authCtx.userId,
          });
          // Fetch updated customer info and call the updater
          const updatedCustomerInfo = await Purchases.getCustomerInfo();
          console.log(
            "Entitlements Active:",
            updatedCustomerInfo.entitlements.active
          );
          // Update state and isProMember
          updateCustomerInfo(updatedCustomerInfo);
          break;
        case PAYWALL_RESULT.ERROR:
          alert("An error occurred while presenting the paywall.");
          break;
        case PAYWALL_RESULT.CANCELLED:
          break;
        default:
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
      style={globalStyles.imageBackground} // Ensure your globalStyles.container includes flex: 1 for proper layout
      resizeMode="contain" // Adjust how the image fits (e.g., 'cover', 'contain', etc.)
    >
      <View style={globalStyles.upperContainer}>
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
        <Text style={globalStyles.deleteButton}>
          If you want to permanently delete your account, please select the
          button below.
        </Text>
        <TouchableOpacity
          style={globalStyles.buttons}
          onPress={DeleteUserHandler}
        >
          <Text style={globalStyles.textButton}>Delete Account</Text>
        </TouchableOpacity>

        {/* Footer links */}
        <View style={globalStyles.footerContainer}>
          <TouchableOpacity
            style={globalStyles.footerLink}
            onPress={handleTermsClick}
          >
            <Text style={globalStyles.footertextButton}>Terms of Use</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.footerLink}
            onPress={handleSubmitClick}
          >
            <Text style={globalStyles.footertextButton}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
});

export default Settings;
