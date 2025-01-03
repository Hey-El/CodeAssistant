export default async function signUpUser(userId) {
  const SERVER_URL = "https://codeassistant-cc828ac15c2e.herokuapp.com/";

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
