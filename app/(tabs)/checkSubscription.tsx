export default async function checkSubscription(userId, proStatus) {
  const SERVER_URL = "https://codeassistant-cc828ac15c2e.herokuapp.com/";

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
