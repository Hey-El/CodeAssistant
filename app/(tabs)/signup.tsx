import { createUser } from "./auth";
import AuthContent from "@/components/AuthContent";
import signUpUser from "./newUser";
import { useDispatch } from "react-redux";
import { login } from "@/components/authstate";
import { Alert } from "react-native";

function SignupScreen() {
  const dispatch = useDispatch();

  async function SignUpUser({ email, password }) {
    const response = await createUser(email, password);
    if (response.error) {
      Alert.alert("Sign Up Failed", response.error);
      return;
    }
    const authToken = JSON.stringify(response.idToken);
    const userId = response.localId;
    dispatch(login({ authToken, userId }));
    const newUser = await signUpUser(userId);
  }

  return <AuthContent Authenticated={SignUpUser} />;
}

export default SignupScreen;
