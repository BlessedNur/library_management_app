import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import apiService from "../services/api";
import toast from "react-hot-toast";

const BookDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await apiService.getBook(id);
      const bookData = response.book || response;
      setBook(bookData);

      // Fetch related books after main book is loaded
      if (bookData) {
        fetchRelatedBooks(bookData.genre, bookData.author, bookData._id);
      }
    } catch (error) {
      console.error("Error fetching book:", error);
      setError("Book not found");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBooks = async (genre, author, currentBookId) => {
    try {
      setRelatedLoading(true);
      const response = await apiService.getBooks();
      const allBooks = response.books || response;

      // Filter related books by genre or author, excluding current book
      const related = allBooks
        .filter(
          (book) =>
            book._id !== currentBookId &&
            (book.genre === genre || book.author === author)
        )
        .slice(0, 6); // Limit to 6 related books

      setRelatedBooks(related);
    } catch (error) {
      console.error("Error fetching related books:", error);
      setRelatedBooks([]);
    } finally {
      setRelatedLoading(false);
    }
  };

  const handleBorrow = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowBorrowModal(true);
    // Set default due date to 14 days from now
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);
    setDueDate(defaultDueDate.toISOString().split("T")[0]);
  };

  const confirmBorrow = async () => {
    if (!dueDate) {
      toast.error("Please select a due date");
      return;
    }

    setActionLoading(true);
    try {
      const response = await apiService.createLoan({ bookId: id, dueDate });

      // Update book state immediately with the returned book data
      if (response.book) {
        setBook(response.book);
      }

      toast.success("Book borrowed successfully!");
      setShowBorrowModal(false);

      // Also refresh book data to be sure
      fetchBook();
    } catch (error) {
      console.error("Error borrowing book:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReserve = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setActionLoading(true);
    try {
      await apiService.createReservation({ book: id });
      toast.success("Book reserved successfully!");
      // Refresh book data
      fetchBook();
    } catch (error) {
      console.error("Error reserving book:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Book Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The book you're looking for doesn't exist."}
          </p>
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="outline">
            <Link to="/">← Back to Books</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="aspect-[3/4] bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={
                    book.coverImage ||
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop"
                  }
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 mb-6">by {book.author}</p>

              {/* Status and Genre */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {book.genre}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    book.availableCopies > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {book.availableCopies > 0 ? "Available" : "Checked Out"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-8">
                {user ? (
                  book.availableCopies > 0 ? (
                    <Button
                      onClick={handleBorrow}
                      disabled={actionLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                    >
                      {actionLoading ? "Processing..." : "Borrow Book"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleReserve}
                      disabled={actionLoading}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
                    >
                      {actionLoading ? "Processing..." : "Reserve Book"}
                    </Button>
                  )
                ) : (
                  <div className="w-full">
                    <p className="text-gray-600 mb-4">
                      Please sign in to borrow or reserve books
                    </p>
                    <Button
                      asChild
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                    >
                      <Link to="/login">Sign In</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Book Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Book Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">ISBN</p>
                  <p className="text-sm text-black">{book.isbn}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Genre</p>
                  <p className="text-sm text-black">{book.genre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Author</p>
                  <p className="text-sm text-black">{book.author}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Copies
                  </p>
                  <p className="text-sm text-black">{book.totalCopies}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">
                  Copies Available
                </p>
                <p className="text-sm text-black">
                  {book.availableCopies} of {book.totalCopies} copies available
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {book.description || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Borrow Modal */}
      {showBorrowModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setShowBorrowModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Borrow Book
              </h3>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Please select a due date for returning the book:
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Book:</strong> {book?.title}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Author:</strong> {book?.author}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowBorrowModal(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmBorrow}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Confirm Borrow"}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Related Books Section */}
      {relatedBooks.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Related Books
            </h2>
            <p className="text-gray-600">
              Discover more books in the same genre or by the same author
            </p>
          </div>

          {relatedLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
              className="related-books-swiper"
            >
              {relatedBooks.map((relatedBook) => (
                <SwiperSlide key={relatedBook._id}>
                  <Link
                    to={`/book/${relatedBook._id}`}
                    className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
                      <img
                        src={
                          relatedBook.coverImage ||
                          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"
                        }
                        alt={relatedBook.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                        {relatedBook.title}
                      </h3>
                      <p className="text-gray-600 text-xs mb-2">
                        by {relatedBook.author}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {relatedBook.genre}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            relatedBook.availableCopies > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {relatedBook.availableCopies > 0
                            ? "Available"
                            : "Out"}
                        </span>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "Caveat, cursive" }}
              >
                Library Management
              </h3>
              <p className="text-gray-300 mb-4">
                Your gateway to knowledge. Discover, borrow, and manage books
                with our modern library system.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Browse Books
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-300">Email: info@library.com</p>
              <p className="text-gray-300">Phone: (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 Library Management. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BookDetail;
