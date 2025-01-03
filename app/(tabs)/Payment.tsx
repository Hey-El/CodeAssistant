const SERVER_URL = "https://codeassistant-cc828ac15c2e.herokuapp.com/";

export default async function upgradeSubscription({ userId }) {
  try {
    const response = await fetch(SERVER_URL + "upgrade-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      console.log(response);
    }
  } catch (error) {
    console.error("Error upgrading subscription:", error);
  }
}
