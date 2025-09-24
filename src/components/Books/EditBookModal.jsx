import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { FiX, FiUpload, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import { uploadImageToCloudinary } from "../../config/cloudinary";

const EditBookModal = ({ isOpen, onClose, onSubmit, book }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    totalCopies: 1,
    availableCopies: 1,
    coverImage: "",
  });
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (book && isOpen) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        genre: book.genre || "",
        description: book.description || "",
        totalCopies: book.totalCopies || 1,
        availableCopies: book.availableCopies || 1,
        coverImage: book.coverImage || "",
      });
    }
  }, [book, isOpen]);

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

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setLoading(true);
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData({ ...formData, coverImage: imageUrl });
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
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
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Edit Book</h2>
              <p className="text-sm text-gray-500 mt-1">
                ISBN: {book?.isbn} (Auto-generated, cannot be changed)
              </p>
            </div>
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
                      className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiUpload className="mr-2 h-4 w-4" />
                      Upload Cover
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
                  required
                  placeholder="Enter book title"
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
                  required
                  placeholder="Enter author name"
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
                  required
                  placeholder="Enter genre"
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
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter book description"
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
                  min="1"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  required
                  placeholder="Enter total copies"
                />
              </div>

              {/* Available Copies */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Available Copies *
                </label>
                <Input
                  name="availableCopies"
                  type="number"
                  min="0"
                  max={formData.totalCopies}
                  value={formData.availableCopies}
                  onChange={handleChange}
                  required
                  placeholder="Enter available copies"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Book"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditBookModal;
