import { useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";
import Purchases, {
  PurchasesOffering,
  CustomerInfo,
} from "react-native-purchases";
import env from "react-native-dotenv";

const API_KEY = env.API_KEY;

export function useSubscription() {
  const [currentOffering, setCurrentOffering] =
    useState<PurchasesOffering | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  // Determine if the user has an active "Pro" subscription
  const [isProMember, setIsProMember] = useState(false);

  const updateCustomerInfo = useCallback((customerInfo: CustomerInfo) => {
    setCustomerInfo(customerInfo);
    const proStatus =
      customerInfo.entitlements.active["Pro access"] !== undefined;
    setIsProMember(proStatus);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (Platform.OS === "ios") {
          Purchases.configure({ apiKey: API_KEY });
        }
        const offerings = await Purchases.getOfferings();
        const customerInfo = await Purchases.getCustomerInfo();
        setCurrentOffering(offerings.current);
        setCustomerInfo(customerInfo);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      }
    };

    fetchData();

    // Add listener for updates
    Purchases.addCustomerInfoUpdateListener(updateCustomerInfo);

    // Cleanup listener on unmount
    return () => {
      Purchases.removeCustomerInfoUpdateListener(updateCustomerInfo);
    };
  }, [updateCustomerInfo]);

  return {
    currentOffering,
    customerInfo,
    isProMember,
    setIsProMember,
    updateCustomerInfo,
  };
}
