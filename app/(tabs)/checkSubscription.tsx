import { SERVER_URL } from "./server";

export default async function checkSubscription(userId, proStatus) {
  try {
    const response = await fetch(SERVER_URL + "login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, proStatus }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Error fetching subscription type:", error);
    throw error;
  }
}
