import { useState } from "react";
import { View, TouchableOpacity, Text, TextInput } from "react-native";
import tw from "twrnc";

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
    <View style={tw`mb-4`}>
      <Text style={tw`text-left font-semibold mb-2`}>Email Address</Text>
      <TextInput
        style={tw`border bg-white border-gray-300 rounded-lg p-3 text-left`}
        autoCapitalize="none"
        onChangeText={updateInputValueHandler.bind(this, "email")} // Corrected to onChangeText
        value={enteredEmail}
      />

      {!isLogin && (
        <>
          <Text style={tw`text-left font-semibold mb-2`}>
            Confirm Email Address
          </Text>
          <TextInput
            style={tw`border bg-white border-gray-300 rounded-lg p-3 text-left`}
            autoCapitalize="none"
            onChangeText={updateInputValueHandler.bind(this, "confirmEmail")} // Corrected to onChangeText
            value={enteredConfirmEmail}
          />
        </>
      )}

      <Text style={tw`text-left font-semibold mb-2`}>Password</Text>
      <TextInput
        style={tw`w-full border bg-white border-gray-300 rounded-lg p-3 text-left`}
        autoCapitalize="none"
        onChangeText={updateInputValueHandler.bind(this, "password")} // Corrected to onChangeText
        secureTextEntry={true}
        value={enteredPassword}
      />

      {!isLogin && (
        <>
          <Text style={tw`text-left font-semibold mb-2`}>Confirm Password</Text>
          <TextInput
            style={tw`w-full bg-white border border-gray-300 rounded-lg p-3 text-left`}
            autoCapitalize="none"
            onChangeText={updateInputValueHandler.bind(this, "confirmPassword")} // Corrected to onChangeText
            secureTextEntry={true}
            value={enteredConfirmPassword} // Changed to enteredConfirmPassword
          />
        </>
      )}

      <View style={tw`justify-center`}>
        {!isLogin && (
          <Text style={tw`font-semibold`}>
            This app tracks the number of scans you perform each month to
            provide accurate usage monitoring and account-based functionality. A
            user account is required to assign a unique ID for tracking
            purposes.
          </Text>
        )}
        <TouchableOpacity
          style={tw`mx-4 bg-orange-500 py-3 px-6 rounded-lg mt-4`}
          onPress={submitHandler}
        >
          <Text style={tw`text-white text-lg font-semibold text-center`}>
            {isLogin ? "Log In" : "Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default AuthForm;
