import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Input } from "../components/ui/Input";
import Hero from "../components/Hero/Hero";
import apiService from "../services/api";

const Home = ({ user }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("all");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const booksPerPage = 8; // 4 per row, 2 rows

  // Load books from API
  useEffect(() => {
    loadBooks();
  }, []);

  // Reset to first page when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterGenre]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await apiService.getBooks();
      setBooks(response.books || response);
    } catch (error) {
      console.error("Error loading books:", error);
      // Fallback to empty array if API fails
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter books based on search term and genre
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      searchTerm === "" ||
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);

    const matchesGenre = filterGenre === "all" || book.genre === filterGenre;

    return matchesSearch && matchesGenre;
  });

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage
  );

  // Get unique genres for filter dropdown
  const genres = [...new Set(books.map((book) => book.genre))];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero user={user} />

      {/* Books Section */}
      <section id="books-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "Caveat, cursive" }}
            >
              Our Book Collection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover our extensive collection of books. Click on any book to
              view details and availability.
            </p>

            {/* Search and Filter Interface */}
            <div className="max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Input
                    type="text"
                    placeholder="Search by title, author, genre, or ISBN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Select value={filterGenre} onValueChange={setFilterGenre}>
                    <SelectTrigger className="w-full ">
                      <SelectValue placeholder="All Genres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genres</SelectItem>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(searchTerm || filterGenre !== "all") && (
                <div className="text-sm text-gray-600 mb-4">
                  Found {filteredBooks.length} book(s) matching your search
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading books...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Books Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterGenre !== "all" 
                    ? "No books match your search criteria. Try adjusting your filters."
                    : "The library catalog is currently empty. Check back later for new additions."
                  }
                </p>
                {(searchTerm || filterGenre !== "all") && (
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterGenre("all");
                    }}
                    variant="outline"
                    className="mx-auto"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Books Grid - 4 per row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                {currentBooks.map((book) => (
                  <Card
                    key={book._id || book.id}
                    className="border border-gray-200 hover:border-blue-300 transition-colors duration-200 cursor-pointer group bg-white h-full flex flex-col p-0 overflow-hidden"
                  >
                    {/* Cover Image - No padding */}
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Status Badge - Absolute positioned at top right */}
                      <span
                        className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium ${
                          book.availableCopies > 0
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {book.availableCopies > 0 ? "Available" : "Checked Out"}
                      </span>
                    </div>

                {/* Content with padding */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3
                      style={{ fontFamily: "Caveat, cursive" }}
                      className="text-xl font-semibold text-gray-900 line-clamp-2 text-left mb-1"
                    >
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 text-left mb-2">
                      by {book.author}
                    </p>
                    <p className="text-xs text-gray-500 text-left">
                      {book.genre}
                    </p>
                  </div>

                  {/* Button at bottom */}
                  <div className="mt-auto pt-4">
                    <Button
                      asChild
                      className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Link to={`/books/${book._id || book.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mb-8">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="w-10"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          )}

              <div className="text-center">
                <p className="text-gray-600">
                  Showing {startIndex + 1}-
                  {Math.min(startIndex + booksPerPage, filteredBooks.length)} of{" "}
                  {filteredBooks.length} books
                </p>
              </div>
            </>
          )}
        </div>
      </section>

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

export default Home;
