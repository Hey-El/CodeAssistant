import { useState } from "react";
import { View, TouchableOpacity, Text, TextInput } from "react-native";
import { Colors } from "./colors";
import { globalStyles } from "../(tabs)/styles";

function AuthForm({ onSubmit, isLogin }) {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredConfirmEmail, setEnteredConfirmEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "confirmEmail":
        setEnteredConfirmEmail(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
      case "confirmPassword":
        setEnteredConfirmPassword(enteredValue);
        break;
    }
  }

  function submitHandler() {
    onSubmit({
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    });
  }

  return (
    <View>
      <Text style={globalStyles.TextInput}>Email Address</Text>
      <TextInput
        style={globalStyles.textContainer}
        autoCapitalize="none"
        onChangeText={updateInputValueHandler.bind(this, "email")} // Corrected to onChangeText
        value={enteredEmail}
      />

      {!isLogin && (
        <>
          <Text style={globalStyles.TextInput}>Confirm Email Address</Text>
          <TextInput
            style={globalStyles.textContainer}
            autoCapitalize="none"
            onChangeText={updateInputValueHandler.bind(this, "confirmEmail")} // Corrected to onChangeText
            value={enteredConfirmEmail}
          />
        </>
      )}

      <Text style={globalStyles.TextInput}>Password</Text>
      <TextInput
        style={globalStyles.textContainer}
        autoCapitalize="none"
        onChangeText={updateInputValueHandler.bind(this, "password")} // Corrected to onChangeText
        secureTextEntry={true}
        value={enteredPassword}
      />

      {!isLogin && (
        <>
          <Text style={globalStyles.TextInput}>Confirm Password</Text>
          <TextInput
            style={globalStyles.textContainer}
            autoCapitalize="none"
            onChangeText={updateInputValueHandler.bind(this, "confirmPassword")} // Corrected to onChangeText
            secureTextEntry={true}
            value={enteredConfirmPassword} // Changed to enteredConfirmPassword
          />
        </>
      )}
      <View style={globalStyles.container}>
        <TouchableOpacity style={globalStyles.buttons} onPress={submitHandler}>
          <Text style={globalStyles.textButton}>
            {isLogin ? "Log In" : "Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default AuthForm;
