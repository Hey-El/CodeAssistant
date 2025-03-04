import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useSubscription } from "./useSubscription";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import Purchases from "react-native-purchases";
import upgradeSubscription from "./Payment";
import { LoadingOverlay } from "./loading";
import { useFocusEffect } from "@react-navigation/native";
import { deleteUser } from "./auth";
import { Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/components/authstate";
import { RootState } from "@/components/authstate";
import tw from "twrnc";

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
  const dispatch = useDispatch();
  const authToken = useSelector((state: RootState) => state.auth.authToken);
  const userId = useSelector((state: RootState) => state.auth.userId);
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
    dispatch(logout());
  }, [dispatch]);

  const DeleteUserHandler = async () => {
    try {
      const response = await deleteUser(authToken);
      console.log(response);
      if (response.kind === "identitytoolkit#DeleteAccountResponse") {
        Alert.alert("Account successfully deleted");
        dispatch(logout()); // Log the user out after deletion
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
          if (!userId) {
            console.error(
              "User ID is null or undefined. Cannot upgrade subscription."
            );
            return;
          }
          const upgradeResponse = await upgradeSubscription({
            userId: userId,
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
  }, [userId, handleMonthlyPurchase]);

  const subscriptionMessage = isProMember
    ? "You are a PRO member!"
    : currentOffering
    ? "Upgrade to access PRO features!"
    : "Upgrade unavailable at the moment";

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <LoadingOverlay />
        <Text>Loading My Account...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 mx-4`}>
      <View style={tw`bg-blue-500 px-6 py-4 rounded-lg`}>
        <Text style={tw`text-white text-xl font-bold text-center`}>
          {subscriptionMessage}
        </Text>
      </View>
      <View style={tw`mt-6`}>
        {!isProMember && (
          <TouchableOpacity
            style={tw`bg-orange-500 py-3 px-6 rounded-lg mb-4`}
            disabled={isLoading}
            onPress={handleUpgrade}
          >
            {isLoading ? (
              <LoadingOverlay /> // Show spinner while loading
            ) : (
              <Text style={tw`text-white text-lg font-bold text-center`}>
                Upgrade now
              </Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={tw`bg-red-700 py-3 px-6 rounded-lg mb-4`}
          onPress={LogOutUser}
        >
          <Text style={tw`text-white text-lg font-bold text-center`}>
            Log Out
          </Text>
        </TouchableOpacity>
        <Text style={tw`text-red text-lg font-bold text-center`}>
          If you want to permanently delete your account, please select the
          button below.
        </Text>
        <TouchableOpacity
          style={tw`bg-red-500 py-3 px-6 rounded-lg mb-4`}
          onPress={DeleteUserHandler}
        >
          <Text style={tw`text-white text-lg font-bold text-center`}>
            Delete Account
          </Text>
        </TouchableOpacity>

        {/* Footer links */}
        <View style={tw`flex-row justify-between`}>
          <TouchableOpacity style={tw`px-4 py-2`} onPress={handleTermsClick}>
            <Text
              style={tw`text-blue-500 font-medium font-semibold text-center`}
            >
              Terms of Use
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={tw`px-4 py-2`} onPress={handleSubmitClick}>
            <Text
              style={tw`text-blue-500 font-medium font-semibold text-center`}
            >
              Contact Support
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
});

export default Settings;
