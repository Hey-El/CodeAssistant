import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { useContext, useCallback } from "react";
import { AuthContext } from "../components/auth-context";
import { globalStyles } from "./styles";
import { useSubscription } from "./useSubscription";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import { handleMonthlyPurchase } from "./Upgrade";
import upgradeSubscription from "./Payment";

function Settings() {
  const authCtx = useContext(AuthContext);
  const { isProMember, currentOffering } = useSubscription();

  const LogOutUser = useCallback(async () => {
    await authCtx.logout();
  }, [authCtx]);

  const handleUpgrade = useCallback(async () => {
    try {
      // Present the paywall
      const paywallResult = await RevenueCatUI.presentPaywall();

      // Handle the result
      switch (paywallResult) {
        case PAYWALL_RESULT.PURCHASED:
          handleMonthlyPurchase();
          await upgradeSubscription(authCtx.userId);
          authCtx.updateSubscription("Pro");
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
  }, []);

  const subscriptionMessage =
    authCtx.subscriptionType === "Pro"
      ? "You are a PRO member!"
      : currentOffering
      ? "Upgrade to access PRO features!"
      : "Upgrade unavailable at the moment";

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
            onPress={handleUpgrade}
          >
            <Text style={globalStyles.textButton}>Upgrade now</Text>
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
