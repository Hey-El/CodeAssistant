import { useState } from "react";
import { Alert, View, TouchableOpacity, Text } from "react-native";
import AuthForm from "./AuthForm";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "@/app/(tabs)/styles";

function AuthContent({ isLogin = false, Authenticated }) {
  const navigation = useNavigation();
  //each state is set to invalid at the moment
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.navigate("SignUp");
    } else {
      navigation.navigate("Log In");
    }
  }

  function submitHandler(credentials) {
    let { email, confirmEmail, password, confirmPassword } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 6;
    const emailsAreEqual = email === confirmEmail;
    const passwordsAreEqual = password === confirmPassword;

    const errorMessages = [];

    // Add specific error messages based on the validation
    if (!emailIsValid) {
      errorMessages.push("The email address is invalid. It must include '@'.");
    }
    if (!passwordIsValid) {
      errorMessages.push("The password must be at least 7 characters long.");
    }
    if (!isLogin) {
      if (!emailsAreEqual) {
        errorMessages.push("Email addresses do not match.");
      }
      if (!passwordsAreEqual) {
        errorMessages.push("Passwords do not match.");
      }
    }

    // If there are any errors, display them and mark fields as invalid
    if (errorMessages.length > 0) {
      Alert.alert("Invalid Input", errorMessages.join("\n"));
      setCredentialsInvalid({
        email: !emailIsValid,
        confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
    Authenticated({ email, password });
  }

  return (
    <View style={globalStyles.authContent}>
      <AuthForm isLogin={isLogin} onSubmit={submitHandler} />
      <View style={globalStyles.container}>
        <TouchableOpacity
          style={globalStyles.buttons}
          onPress={switchAuthModeHandler}
        >
          <Text style={globalStyles.textButton}>
            {isLogin ? "Create a new user" : "Log in instead"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default AuthContent;
