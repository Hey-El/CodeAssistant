export default async function sendExplanation(explanation) {
  const SERVER_URL = "https://codeassistant-cc828ac15c2e.herokuapp.com/";

  try {
    const response = await fetch(SERVER_URL + "python", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ explanation }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Error fetching keywords from Python:", error);
    throw error;
  }
}
