import { useContext } from "react";
import AuthContent from "@/components/AuthContent";
import { AuthContext } from "@/components/auth-context";
import { authenticateLogIn } from "./auth";
import { Alert } from "react-native";
import checkSubscription from "./checkSubscription";
import { useSubscription } from "./useSubscription";

function LoginScreen() {
  const authCtx = useContext(AuthContext);
  const { isProMember } = useSubscription();

  async function LogInUser({ email, password }) {
    try {
      const response = await authenticateLogIn(email, password);
      if (response && response.idToken && response.localId) {
        const token = response.idToken; // No need to stringify, it's already a string
        const userId = response.localId;
        await authCtx.login(token, userId);
        const proStatus = isProMember ? "Pro" : "Free";
        const subscription = await checkSubscription(userId, proStatus);
        if (subscription && subscription.subscriptionType) {
          authCtx.updateSubscription(subscription.subscriptionType); // Update context with the new subscription type
        }
      } else {
        throw new Error("Invalid subscription type response");
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
