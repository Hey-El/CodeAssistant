import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  colouredContainer: {
    flex: 1, // Ensures the View takes up the available screen space
    backgroundColor: "#ffffff",
    width: "100%",
  },
  bottomButtonContainer: {
    flex: 1, // Take up available space in the bottom
    justifyContent: "flex-end", // Push the buttons to the bottom
    alignItems: "center",
    paddingBottom: 50, // Space from the bottom edge (adjust as needed)
  },
  thirdContainer: {
    flex: 1, // Take up one third of the screen
    justifyContent: "flex-start", // Center the buttons vertically
    alignItems: "center", // Center buttons horizontally
  },
  container: {
    alignItems: "center",
  },
  image: {
    borderRadius: 20,
    height: "33%",
    width: "100%",
    backgroundColor: "#d3d3d3", // Light background color
    borderWidth: 1, // Optional: adds a border
    borderColor: "#ccc", // Optional: border color
    overflow: "hidden", // Ensures the image stays within the rounded corners
    elevation: 5, // Optional: adds shadow for Android
    shadowColor: "#000", // Optional: shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Optional: shadow offset
    shadowOpacity: 0.1, // Optional: shadow opacity
    shadowRadius: 5, // Optional: shadow radius
    justifyContent: "center",
    alignSelf: "center",
  },
  imagePreview: {
    width: "100%", // Make the image take up full width of the container
    height: "100%", // Make the image take up full height of the container
    borderRadius: 10,
  },
  ExplanationtextContainer: {
    flex: 2,
    padding: 12,
    width: "100%",
    backgroundColor: "#fff", // Light background color
    borderWidth: 1, // Optional: adds a border
    borderColor: "#ccc", // Optional: border color
    overflow: "hidden", // Ensures the image stays within the rounded corners
    elevation: 5, // Optional: adds shadow for Android
    shadowColor: "#000", // Optional: shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Optional: shadow offset
    shadowOpacity: 0.1, // Optional: shadow opacity
    shadowRadius: 5, // Optional: shadow radius
    marginTop: 20,
    borderRadius: 30, // Rounded corners
    paddingHorizontal: 20, // Add horizontal padding
  },
  explanationText: {
    fontSize: 16, // A comfortable size for reading
    fontWeight: "500", // Medium weight for a more subtle emphasis
    color: "#333", // A dark gray color for easy readability
    lineHeight: 24, // Increases line spacing for better readability
    marginVertical: 10, // Adds space above and below the text
    paddingHorizontal: 16, // Adds horizontal padding for better alignment
    textAlign: "justify", // Justifies the text for a clean look
  },
  buttonContainer: {
    borderRadius: 24,
    padding: 6,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  buttons: {
    backgroundColor: "#d2691e", // Bootstrap primary color
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    width: "90%",
  },
  textButton: {
    color: "#ffffff", // White text color
    fontSize: 18, // Increased font size
    fontWeight: "bold", // Bold text
    textAlign: "center",
  },
  textContainer: {
    backgroundColor: "#ffffff", // White background for input field
    borderColor: "#ccc", // Light border color
    borderWidth: 1, // Add a border to make the input field stand out
    borderRadius: 8, // Round corners for a cleaner look
    paddingHorizontal: 16, // Padding inside the input field
    paddingVertical: 12, // Padding inside the input field
    fontSize: 16, // Comfortable font size
    color: "#000", // Text color for input field
    marginBottom: 20, // Spacing below the input field
  },
  authContent: {
    backgroundColor: "#fffaf0",
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "white",
    borderWidth: 1,
  },
  TextInput: {
    fontSize: 18, // Larger font size for this specific input
    color: "black", // Black text color
    textAlignVertical: "top",
    marginBottom: 10,
  },
  proContainer: {
    flex: 1,
    backgroundColor: "#fffaf0",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  benefitCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    width: "100%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  icon: {
    marginRight: 12,
  },
  benefitText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  upgradeButton: {
    marginTop: 20,
    backgroundColor: "#d2691e",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  upgradeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  priceBox: {
    backgroundColor: "#f0f8ff", // Light blue background
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center", // Center the text within the box
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
