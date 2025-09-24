// Cloudinary configuration for client-side uploads
export const cloudinaryConfig = {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
  apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY,
};

// Upload single image to Cloudinary (client-side)
export const uploadSingleImage = async (file, folder = "library/books") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);
  formData.append("cloud_name", cloudinaryConfig.cloudName);
  formData.append("folder", folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

// Upload multiple images to Cloudinary (client-side)
export const uploadMultipleImages = async (files, folder = "library/books") => {
  const uploadPromises = files.map((file) => uploadSingleImage(file, folder));
  return Promise.all(uploadPromises);
};

// Legacy function for backward compatibility
export const uploadImageToCloudinary = async (file) => {
  const result = await uploadSingleImage(file);
  return result.secure_url;
};

// Helper function to delete images (requires server-side implementation)
export const deleteImages = async (publicIds) => {
  if (publicIds.length === 0) return;

  try {
    // Note: This requires server-side implementation as client-side deletion
    // requires API secret which should never be exposed to the frontend
    console.warn(
      "Image deletion should be implemented server-side for security"
    );
    return { deleted: publicIds };
  } catch (error) {
    console.error("Error deleting images:", error);
    throw error;
  }
};
