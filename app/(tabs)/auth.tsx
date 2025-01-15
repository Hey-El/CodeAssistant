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
    console.error("Error message");
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
      console.error("User creation failed:");
    }
  }
}
