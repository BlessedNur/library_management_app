export const cloudinaryConfig = {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
  apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY,
};

export const uploadSingleImage = async (file, folder = "library/books") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);
  formData.append("cloud_name", cloudinaryConfig.cloudName);
  formData.append("folder", folder);

  try {
    const response = await fetch(
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

export const uploadMultipleImages = async (files, folder = "library/books") => {
  const uploadPromises = files.map((file) => uploadSingleImage(file, folder));
  return Promise.all(uploadPromises);
};

export const uploadImageToCloudinary = async (file) => {
  const result = await uploadSingleImage(file);
  return result.secure_url;
};

export const deleteImages = async (publicIds) => {
  if (publicIds.length === 0) return;

  try {
    console.warn(
      "Image deletion should be implemented server-side for security"
    );
    return { deleted: publicIds };
  } catch (error) {
    console.error("Error deleting images:", error);
    throw error;
  }
};
