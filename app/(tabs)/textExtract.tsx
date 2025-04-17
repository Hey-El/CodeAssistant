import { SERVER_URL } from "./server";

export default async function sendExplanation(explanation) {
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
