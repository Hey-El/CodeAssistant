import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  authcontainer: {
    width: "100%",
    justifyContent: "center", // Center content vertically
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    width: "100%",
    justifyContent: "center", // Center content vertically
    alignItems: "center",
  },
  bottomButtonContainer: {
    flex: 2, // Take up available space in the bottom
    justifyContent: "flex-end", // Push the buttons to the bottom
    alignItems: "center",
    paddingBottom: 50, // Space from the bottom edge (adjust as needed)
  },
  upperContainer: {
    flex: 1, // Takes up 1/3 of the screen
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
    width: "100%", // Ensures full width
    paddingVertical: 20, // Adds some spacing
  },
  imageBackground: {
    flex: 1, // Ensures it covers the full screen
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Ensures the image covers the screen
  },
  image: {
    flex: 1,
    borderRadius: 20,
    height: "33%",
    width: "100%",
    backgroundColor: "#d3d3d3", // Light background color
    overflow: "hidden", // Ensures the image stays within the rounded corners
    shadowColor: "#000", // Optional: shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Optional: shadow offset
    shadowOpacity: 0.1, // Optional: shadow opacity
    shadowRadius: 5, // Optional: shadow radius
    justifyContent: "center",
    alignItems: "center",
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
  registrationbuttons: {
    backgroundColor: "#d2691e", // Bootstrap primary color
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    width: "90%",
    flexDirection: "row",
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
  deleteButton: {
    fontSize: 14, // Slightly larger font
    fontWeight: "bold", // Bold text for emphasis
    color: "black", // Warning color
    textAlign: "center", // Center-align the text
    marginVertical: 10, // Add spacing above and below the text
    paddingHorizontal: 20, // Add padding to make it easier to read
    lineHeight: 22, // Increase line height for better readability
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  footerContainer: {
    alignItems: "center",
    width: "100%", // Make sure it's full width
    paddingVertical: 10,
    flexDirection: "row", // Ensures the child elements are arranged horizontally (side by side)
    justifyContent: "space-evenly",
  },
  footerLink: {
    paddingVertical: 5, // Add space between the links
  },
  footertextButton: {
    color: "black", // Set the text color to black
    fontSize: 16, // Adjust font size if needed
    fontWeight: "bold", // You can make the text bold (optional)
    textAlign: "center", // Centers the text
  },
});
