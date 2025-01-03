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
  } catch (error) {
    if (error.response) {
      console.error("Error data:", error.response.data);
    } else if (error.request) {
      console.error("Request data:", error.request);
    } else {
      console.error("Error message:", error.message);
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
  } catch (error) {
    {
      // Check if the error response exists and contains details
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error.message;
        console.error("User creation failed:", errorMessage);

        // Custom error handling based on Firebase error messages
        switch (errorMessage) {
          case "EMAIL_EXISTS":
            throw new Error(
              "This email is already in use. Please use a different one."
            );
          case "INVALID_EMAIL":
            throw new Error("The email address is not valid.");
          case "WEAK_PASSWORD":
            throw new Error(
              "The password is too weak. It should be at least 6 characters long."
            );
          default:
            throw new Error("User creation failed. Please try again.");
        }
      } else {
        console.log("User creation failed:", error);
        throw new Error("User creation failed due to an unknown error.");
      }
    }
  }
}
