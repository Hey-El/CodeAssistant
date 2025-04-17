import { SERVER_URL } from "./server";

export default async function upgradeSubscription({ userId }) {
  try {
    const payload = JSON.stringify({ userId });
    console.log("Payload being sent:", payload);
    const response = await fetch(SERVER_URL + "upgrade-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
  } catch (error) {
    console.error("Error upgrading subscription:", error);
    return null;
  }
}
