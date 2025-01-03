import { Alert } from "react-native";
import Purchases, { PurchasesOffering } from "react-native-purchases";
import { useSubscription } from "./useSubscription"; // Assuming this is where you get the currentOffering

export const handleMonthlyPurchase = async () => {
  const { currentOffering } = useSubscription(); // Get the current offering

  // Check if the current offering has a monthly package
  if (!currentOffering?.monthly) {
    Alert.alert("Error", "Monthly subscription offering is not available.");
    return;
  }

  try {
    // Start the purchase flow with the monthly package
    await Purchases.purchasePackage(currentOffering.monthly);
    Alert.alert("Your upgrade was a success");
  } catch (error) {
    // Log the error once and handle user notifications accordingly
    console.error("Error during purchase:", error);
  }
};
