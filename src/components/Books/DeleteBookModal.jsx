import React from "react";
import { Button } from "../ui/Button";
import { FiX, FiAlertTriangle } from "react-icons/fi";

const DeleteBookModal = ({ isOpen, onClose, onConfirm, book, loading }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with higher z-index */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-[9998]"
        onClick={onClose}
      />

      {/* Centered Modal with highest z-index */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FiAlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Book
                </h3>
                <p className="text-sm text-gray-500">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={loading}
            >
              <FiX className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-red-800">
                    Are you sure you want to delete this book?
                  </h4>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      <strong>Title:</strong> {book?.title}
                    </p>
                    <p>
                      <strong>Author:</strong> {book?.author}
                    </p>
                    <p>
                      <strong>ISBN:</strong> {book?.isbn}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p className="mb-2">
                <strong>Warning:</strong> This will permanently delete:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-500">
                <li>The book record from the database</li>
                <li>All associated loan history</li>
                <li>All reservations for this book</li>
                <li>All cover images and metadata</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
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
              type="button"
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Book"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteBookModal;
