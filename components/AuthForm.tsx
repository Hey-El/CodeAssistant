import { useState } from "react";
import { View, TouchableOpacity, Text, TextInput } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
    <KeyboardAwareScrollView>
     <View style={tw`mt-2`}>
      <View>
        <Text style={tw`text-gray-700 mt-8 font-semibold mb-2`}>
          Email Address
        </Text>
        <View
          style={tw`flex-row items-center border border-gray-300 rounded-lg bg-white p-3`}
        >
          <Ionicons
            name="mail-outline"
            size={20}
            color="#6B7280"
            style={tw`mr-2`}
          />
          <TextInput
            style={tw`flex-1 text-gray-800`}
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            onChangeText={updateInputValueHandler.bind(this, "email")}
            value={enteredEmail}
          />
        </View>
      </View>

      {!isLogin && (
        <View>
          <Text style={tw`text-gray-700 mt-8 font-semibold mb-2`}>
            Confirm Email Address
          </Text>
          <View
            style={tw`flex-row items-center border border-gray-300 rounded-lg bg-white p-3`}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color="#6B7280"
              style={tw`mr-2`}
            />
            <TextInput
              style={tw`flex-1 text-gray-800`}
              placeholder="Confirm your email"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              onChangeText={updateInputValueHandler.bind(this, "confirmEmail")}
              value={enteredConfirmEmail}
            />
          </View>
        </View>
      )}

      <Text style={tw`text-left font-semibold mt-8 mb-2`}>Password</Text>
      <View
        style={tw`flex-row items-center border border-gray-300 rounded-lg bg-white p-3`}
      >
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#6B7280"
          style={tw`mr-2`}
        />
        <TextInput
          style={tw`w-full text-left`}
          autoCapitalize="none"
          onChangeText={updateInputValueHandler.bind(this, "password")} // Corrected to onChangeText
          secureTextEntry={true}
          value={enteredPassword}
          placeholder="Enter your password"
        />
      </View>

      {!isLogin && (
        <>
          <Text style={tw`text-left mt-8 font-semibold mb-2`}>
            Confirm Password
          </Text>
          <View
            style={tw`flex-row items-center border border-gray-300 rounded-lg bg-white p-3`}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#6B7280"
              style={tw`mr-2`}
            />
            <TextInput
              style={tw`w-full text-left`}
              placeholder="Confirm your password"
              autoCapitalize="none"
              onChangeText={updateInputValueHandler.bind(
                this,
                "confirmPassword"
              )} // Corrected to onChangeText
              secureTextEntry={true}
              value={enteredConfirmPassword} // Changed to enteredConfirmPassword
            />
          </View>
        </>
      )}

      <View style={tw`justify-center`}>
        {!isLogin && (
          <Text style={tw`font-semibold mt-8 `}>
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
    </KeyboardAwareScrollView>
  );
}

export default AuthForm;
