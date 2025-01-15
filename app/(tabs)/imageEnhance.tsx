import * as ImageManipulator from "expo-image-manipulator";

export async function imageEnhancer(url) {
  try {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      url,
      [
        { resize: { width: 1000 } }, // Resize while maintaining aspect ratio
      ],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );

    return manipulatedImage.uri;
  } catch (error) {
    console.error("Error while enhancing the image:", error);
    throw error;
  }
}
