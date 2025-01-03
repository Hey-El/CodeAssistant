import * as ImageManipulator from "expo-image-manipulator";

export async function imageEnhancer(url) {
  try {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      url, // Input image URI
      [{ resize: { width: 1000, height: 1000 } }], // Resize options
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG } // Save options
    );

    return manipulatedImage.uri; // Returns the URI of the resized image
  } catch (error) {
    console.error("Error while enhancing the image:", error);
    throw error;
  }
}
