import { useContext, useEffect, useState } from "react";
import AuthContent from "@/components/AuthContent";
import { AuthContext } from "@/components/auth-context";
import { authenticateLogIn } from "./auth";
import { Alert } from "react-native";
import checkSubscription from "./checkSubscription";
import { useSubscription } from "./useSubscription";
import Purchases from "react-native-purchases";

function LoginScreen() {
  const authCtx = useContext(AuthContext);
  const { updateCustomerInfo } = useSubscription();

  async function LogInUser({ email, password }) {
    try {
      const response = await authenticateLogIn(email, password);
      if (response && response.idToken && response.localId) {
        const token = response.idToken; // No need to stringify, it's already a string
        const userId = response.localId;
        await authCtx.login(token, userId);
        await Purchases.logIn(userId);
        const customerInfo = await Purchases.getCustomerInfo();
        updateCustomerInfo(customerInfo);
        const proStatus = customerInfo.entitlements.active["Pro access"]
          ? "Pro"
          : "Free";
        const membership = await checkSubscription(userId, proStatus);
        console.log("Subscription result:", membership);
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Login Failed",
        "Invalid email or password. Please try again."
      );
    }
  }

  return <AuthContent isLogin Authenticated={LogInUser} />;
}

export default LoginScreen;
