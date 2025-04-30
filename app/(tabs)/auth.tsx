import axios from "axios";

const API_KEY = "AIzaSyBYPyW6FDdK7sVmYSd1zm2a3hpQ1nvR4ls";

export async function authenticateLogIn(email, password) {
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );
    const { idToken, localId } = response.data; // Deconstruct the relevant fields
    return { idToken, localId };
  } catch (error: any) {
    // Check if the error response exists and contains details
    if (error.response && error.response.data && error.response.data.error) {
      const errorData = error.response.data.error;
      const errorCode = errorData.message;

      // Map Firebase error codes to user-friendly messages
      let userFriendlyMessage = "An error occurred during login.";

      switch (errorCode) {
        case "EMAIL_NOT_FOUND":
          userFriendlyMessage =
            "No account found with this email. Please check your email or sign up.";
          break;
        case "INVALID_PASSWORD":
          userFriendlyMessage = "The password is invalid. Please try again.";
          break;
        case "USER_DISABLED":
          userFriendlyMessage =
            "This account has been disabled by an administrator.";
          break;
      }
      console.error("Login failed:", errorCode, "-", userFriendlyMessage);
      return { error: userFriendlyMessage };
    } else {
      console.error("Login failed:", error.message);
      return { error: "An unknown error occurred" };
    }
  }
}

export async function createUser(email, password) {
  try {
    const response = await axios.post(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
        API_KEY,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );
    const { idToken, localId } = response.data;
    return { idToken, localId };
  } catch (error: any) {
    // Check if the error response exists and contains details
    if (error.response && error.response.data && error.response.data.error) {
      const errorData = error.response.data.error;
      const errorCode = errorData.message;

      // Map Firebase error codes to user-friendly messages
      let userFriendlyMessage = "An error occurred during sign up.";

      switch (errorCode) {
        case "EMAIL_EXISTS":
          userFriendlyMessage =
            "This email address is already in use. Please use a different email or try logging in.";
          break;
        default:
          userFriendlyMessage = `Sign up failed`;
      }

      console.error("User creation failed:", errorCode);
      return { error: userFriendlyMessage };
    } else {
      console.error("User creation failed:", error.message);
      return { error: "An unknown error occurred" };
    }
  }
}

export async function deleteUser(idToken) {
  try {
    const response = await axios.post(
      "https://identitytoolkit.googleapis.com/v1/accounts:delete?key=" +
        API_KEY,
      {
        idToken: idToken,
      }
    );
    console.log("User account deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    {
      // Some other error
      console.error("Error in setting up request:", error.message);
      return { error: error.message };
    }
  }
}
