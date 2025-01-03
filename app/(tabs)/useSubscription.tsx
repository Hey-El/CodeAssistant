import { useState, useEffect } from "react";
import { Platform } from "react-native";
import Purchases, {
  PurchasesOffering,
  CustomerInfo,
} from "react-native-purchases";

const API_KEY = "appl_amUULqrjAwYvtFDxuhgVjhqsJRf";

export function useSubscription() {
  const [currentOffering, setCurrentOffering] =
    useState<PurchasesOffering | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  // Determine if the user has an active "Pro" subscription
  const isProMember = customerInfo?.activeSubscriptions?.includes("Pro");

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
  }, []);

  useEffect(() => {
    const customerInfoUpdated = async (purchaseInfo: CustomerInfo) => {
      setCustomerInfo(purchaseInfo);
    };
    Purchases.addCustomerInfoUpdateListener(customerInfoUpdated);
  }, []);

  return { currentOffering, customerInfo, isProMember };
}
