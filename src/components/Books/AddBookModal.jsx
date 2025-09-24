import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { FiX, FiUpload, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import { uploadImageToCloudinary } from "../../config/cloudinary";

const AddBookModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    totalCopies: 1,
    coverImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready for animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Wait for animation to complete before unmounting
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      setFormData({
        title: "",
        author: "",
        genre: "",
        description: "",
        totalCopies: 1,
        coverImage: "",
      });
      onClose();
    } catch (error) {
      // Error toast is already shown by parent
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      toast.loading("Uploading image...", { id: "upload" });

      // Upload to Cloudinary
      const imageUrl = await uploadImageToCloudinary(file);

      setFormData({ ...formData, coverImage: imageUrl });
      toast.success("Image uploaded successfully!", { id: "upload" });
    } catch (error) {
      toast.error("Failed to upload image. Please try again.", {
        id: "upload",
      });
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop with higher z-index */}
      <div
        className={`fixed inset-0 bg-black z-[9998] transition-opacity duration-300 ${
          isVisible ? "bg-opacity-60" : "bg-opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sliding Modal with highest z-index */}
      <div
        className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Add New Book
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Book Cover Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Book Cover
                </label>
                <div className="flex items-center space-x-4">
                  {formData.coverImage ? (
                    <img
                      src={formData.coverImage}
                      alt="Book cover"
                      className="w-20 h-28 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-20 h-28 bg-gray-200 rounded border flex items-center justify-center">
                      <FiImage className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="cover-upload"
                    />
                    <label
                      htmlFor="cover-upload"
                      className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium transition-all duration-200 ${
                        uploading
                          ? "text-blue-600 bg-blue-50 border-blue-300 cursor-not-allowed"
                          : "text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      {uploading ? (
                        <div className="flex items-center">
                          <div className="animate-pulse w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        <>
                          <FiUpload className="h-4 w-4 mr-2" />
                          Upload Cover
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                  required
                />
              </div>

              {/* Author */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Author *
                </label>
                <Input
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  required
                />
              </div>

              {/* Genre */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Genre *
                </label>
                <Input
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="Enter genre"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter book description"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Total Copies */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Total Copies *
                </label>
                <Input
                  name="totalCopies"
                  type="number"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  placeholder="Enter number of copies"
                  min="1"
                  required
                />
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Adding..." : "Add Book"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBookModal;
