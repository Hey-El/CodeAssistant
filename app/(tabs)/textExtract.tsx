export default async function sendExplanation(explanation) {
  const SERVER_URL = "https://codeassistant-app-q5sfn.ondigitalocean.app/";

  try {
    const response = await fetch(SERVER_URL + "challengeextraction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ explanation }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching keywords:", error);
    throw error;
  }
}
