// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName:
    process.env.REACT_APP_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME,
  apiKey:
    process.env.REACT_APP_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY,
  apiSecret:
    process.env.REACT_APP_CLOUDINARY_API_SECRET ||
    process.env.CLOUDINARY_API_SECRET,
  uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "ml_default",
};

// Upload image to Cloudinary
export const uploadImageToCloudinary = async (file) => {
  // Check if Cloudinary is properly configured
  if (
    cloudinaryConfig.cloudName === "dummy-cloud" ||
    cloudinaryConfig.uploadPreset === "your-upload-preset"
  ) {
    console.warn("Cloudinary not configured, using placeholder image");
    // Return a placeholder image URL instead of failing
    return "https://via.placeholder.com/300x400?text=Book+Cover";
  }

  const formData = new FormData();
  formData.append("file", file);
  
  // Only add upload_preset if it's configured and not the default
  if (cloudinaryConfig.uploadPreset && cloudinaryConfig.uploadPreset !== "ml_default") {
    formData.append("upload_preset", cloudinaryConfig.uploadPreset);
  }
  
  // Add API key for signed uploads if available
  if (cloudinaryConfig.apiKey) {
    formData.append("api_key", cloudinaryConfig.apiKey);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary response error:", errorText);
      
      // If upload preset error, try without it
      if (errorText.includes("Upload preset not found")) {
        console.warn("Upload preset not found, trying without preset...");
        const formDataWithoutPreset = new FormData();
        formDataWithoutPreset.append("file", file);
        if (cloudinaryConfig.apiKey) {
          formDataWithoutPreset.append("api_key", cloudinaryConfig.apiKey);
        }
        
        const retryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
          {
            method: "POST",
            body: formDataWithoutPreset,
          }
        );
        
        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          return retryData.secure_url;
        }
      }
      
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    // Return placeholder image on error instead of throwing
    console.warn("Using placeholder image due to upload error");
    return "https://via.placeholder.com/300x400?text=Book+Cover";
  }
};
