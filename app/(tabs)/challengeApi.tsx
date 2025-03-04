export const sendKeywordsApi = async (keywords) => {
  const baseUrl = "https://codeforces.com/api/"; // Base URL for Codeforces API
  const searchEndpoint = "problemset.problems";

  // Sanitize the keywords by ensuring they match the expected format
  const sanitizedKeywords = keywords
    .map((keyword) => keyword.toLowerCase().replace(/[^a-z0-9\s\-;]/g, "")) // Convert to lowercase and remove invalid characters
    .join(";"); // Use semicolons to separate tags

  const query = keywords.join(" ");
  try {
    // Fetch problems from the Codeforces API
    const response = await fetch(
      `${baseUrl}${searchEndpoint}?tags=${encodeURIComponent(
        sanitizedKeywords
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    if (response.ok) {
      console.log("API Response: ", data); // Successfully sent data to API
      return data;
      // Process the response data if needed
    } else {
      console.error("API Error: ", data); // Handle API errors
      return null;
    }
  } catch (error) {
    console.error("Error sending data to API:", error);
    return null;
  }
};
