// Cloudinary configuration
// Replace with your actual Cloudinary credentials
export const cloudinaryConfig = {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "your-cloud-name",
  uploadPreset:
    process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "your-upload-preset",
  apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY || "your-api-key",
};

// Upload image to Cloudinary
export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);
  formData.append("cloud_name", cloudinaryConfig.cloudName);

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
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
