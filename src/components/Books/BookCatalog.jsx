import React, { useState, useEffect } from "react";
import BookCard from "./BookCard";
import SearchBar from "./SearchBar";
import apiService from "../../services/api";

const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await apiService.getBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (err) {
      setError(err.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm, filters) => {
    let filtered = books;

    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.isbn.includes(searchTerm) ||
          book.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.genre && filters.genre !== "all") {
      filtered = filtered.filter((book) => book.genre === filters.genre);
    }

    if (filters.availability && filters.availability !== "all") {
      filtered = filtered.filter(
        (book) => book.availability === filters.availability
      );
    }

    setFilteredBooks(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Catalog</h1>
        <p className="text-gray-600">
          Discover and explore our collection of books
        </p>
      </div>

      {/* Search and Filters */}
      <SearchBar onSearch={handleSearch} />

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredBooks.length} of {books.length} books
        </p>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No books found
          </h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookCatalog;
