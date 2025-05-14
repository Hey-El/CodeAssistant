import { View, Text, TouchableOpacity, Alert } from "react-native";
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
import { Ionicons } from "@expo/vector-icons";
import { SERVER_URL } from "./server";
import ScreenLayout from "./safeArea";

const handleTermsClick = () => {
  Linking.openURL(SERVER_URL + "terms-of-service").catch((err) =>
    console.error("Failed to open URL:", err)
  );
};

const handleSubmitClick = () => {
  Linking.openURL(SERVER_URL + "customer-support").catch((err) =>
    console.error("Failed to open URL:", err)
  );
};

const handleSubmitPrivacy = () => {
  Linking.openURL(SERVER_URL + "privacy-policy").catch((err) =>
    console.error("Failed to open URL:", err)
  );
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
          await upgradeSubscription({
            userId: userId,
          });
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

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <LoadingOverlay />
      </View>
    );
  }

  return (
    <ScreenLayout>
      <View style={tw`bg-white p-4`}>
        <View
          style={tw`bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-6`}
        >
          <View style={tw`bg-blue-500 py-2`}>
            <Text style={tw`text-white text-xl font-bold text-center`}>
              Account Management
            </Text>
          </View>
        </View>
        <View
          style={tw`items-center bg-blue-50 rounded-full p-8 mb-8 shadow-md`}
        >
          {isProMember ? (
            <>
              <Ionicons name="checkmark-circle" size={50} color="#3b82f6" />
              <Text
                style={tw`text-lg font-semibold text-gray-800 mt-2 text-center`}
              >
                You are a PRO member!
              </Text>
              <Text style={tw`text-gray-600 mt-1 text-center`}>
                Enjoy all premium features
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="star-outline" size={50} color="#f97316" />
              <Text
                style={tw`text-lg font-semibold text-gray-800 mt-2 text-center`}
              >
                Upgrade to access PRO features!
              </Text>
            </>
          )}
        </View>
        <View style={tw`mt-6`}>
          {!isProMember && (
            <View style={tw`flex-row items-center justify-center`}>
              <TouchableOpacity
                style={tw`bg-orange-500 py-3 px-6 rounded-lg mb-4`}
                disabled={isLoading}
                onPress={handleUpgrade}
              >
                {isLoading ? (
                  <LoadingOverlay />
                ) : (
                  <View style={tw`flex-row items-center justify-center`}>
                    <Ionicons
                      name="flash"
                      size={24}
                      color="white"
                      style={tw`mr-2`}
                    />
                    <Text style={tw`text-white text-lg font-bold text-center`}>
                      Upgrade now
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={tw`flex-row items-center justify-center`}>
          <TouchableOpacity
            style={tw`bg-blue-500 py-3 px-6 rounded-lg mb-4`}
            onPress={LogOutUser}
          >
            <View style={tw`flex-row items-center justify-center`}>
              <Ionicons
                name="log-out-outline"
                size={24}
                color="white"
                style={tw`mr-2`}
              />
              <Text style={tw`text-white text-lg font-bold text-center`}>
                Log Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={tw`p-4`}>
          <Text style={tw`text-lg font-bold text-center mb-4`}>
            If you want to permanently delete your account, please select the
            button below.
          </Text>
          <TouchableOpacity
            style={tw`bg-orange-500 py-3 px-6 rounded-lg mb-4`}
            onPress={DeleteUserHandler}
          >
            <View style={tw`flex-row items-center justify-center`}>
              <Ionicons
                name="trash-outline"
                size={22}
                color="white"
                style={tw`mr-2`}
              />
              <Text style={tw`text-white text-lg font-bold text-center`}>
                Delete Account
              </Text>
            </View>
          </TouchableOpacity>

          <View style={tw`flex-row justify-between`}>
            <TouchableOpacity
              style={tw`px-4 py-2 flex-row items-center justify-center`}
              onPress={handleTermsClick}
            >
              <Ionicons
                name="document-text-outline"
                size={18}
                color="#3b82f6"
                style={tw`mr-1`}
              />
              <Text
                style={tw`text-blue-500 font-medium font-semibold text-center`}
              >
                Terms of Use
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`px-4 py-2 flex-row items-center justify-center`}
              onPress={handleSubmitClick}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color="#3b82f6"
                style={tw`mr-1`}
              />
              <Text
                style={tw`text-blue-500 font-medium font-semibold text-center`}
              >
                Contact Support
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`px-4 py-2 flex-row items-center justify-center`}
              onPress={handleSubmitPrivacy}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color="#3b82f6"
                style={tw`mr-1`}
              />
              <Text
                style={tw`text-blue-500 font-medium font-semibold text-center`}
              >
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenLayout>
  );
});

export default Settings;
