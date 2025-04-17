import { SERVER_URL } from "./server";

export default async function signUpUser(userId) {
  try {
    const response = await fetch(SERVER_URL + "signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Error upgrading subscription:", error);
    throw error;
  }
}
