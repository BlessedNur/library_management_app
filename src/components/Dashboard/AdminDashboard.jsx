import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import {
  FiUsers,
  FiBook,
  FiClock,
  FiDollarSign,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiMenu,
  FiX,
  FiLayout,
} from "react-icons/fi";
import apiService from "../../services/api";
import AddBookModal from "../Books/AddBookModal";
import EditBookModal from "../Books/EditBookModal";
import DeleteBookModal from "../Books/DeleteBookModal";

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Real data from API
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showEditBookModal, setShowEditBookModal] = useState(false);
  const [showDeleteBookModal, setShowDeleteBookModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [booksData, loansData, finesData, usersData] = await Promise.all([
        apiService.getBooks(),
        apiService.getLoans(),
        apiService.getFines(),
        apiService.getUsers(),
      ]);

      setBooks(booksData);
      setLoans(loansData);
      setFines(finesData);
      setUsers(usersData);
    } catch (error) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Admin action handlers
  const handleCreateBook = async (bookData) => {
    try {
      await apiService.createBook(bookData);
      await loadData();
    } catch (error) {}
  };

  const handleUpdateBook = async (bookId, bookData) => {
    try {
      await apiService.updateBook(bookId, bookData);
      await loadData();
    } catch (error) {}
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await apiService.deleteBook(bookId);
      await loadData();
    } catch (error) {}
  };

  const handleCreateFine = async (fineData) => {
    try {
      await apiService.createFine(fineData);
      await loadData();
    } catch (error) {}
  };

  // Modal handlers
  const handleEditBook = (book) => {
    setSelectedBook(book);
    setShowEditBookModal(true);
  };

  const handleDeleteBookClick = (book) => {
    setSelectedBook(book);
    setShowDeleteBookModal(true);
  };

  const handleEditBookSubmit = async (bookData) => {
    await handleUpdateBook(selectedBook._id, bookData);
    setShowEditBookModal(false);
    setSelectedBook(null);
  };

  const handleDeleteBookConfirm = async () => {
    await handleDeleteBook(selectedBook._id);
    setShowDeleteBookModal(false);
    setSelectedBook(null);
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: FiLayout },
    { id: "books", label: "Manage Books", icon: FiBook },
    { id: "loans", label: "Manage Loans", icon: FiClock },
    { id: "users", label: "Manage Users", icon: FiUsers },
    { id: "fines", label: "Fines & Payments", icon: FiDollarSign },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <FiBook className="text-3xl text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Books</p>
              <p className="text-2xl font-bold text-gray-900">{books.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <FiUsers className="text-3xl text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <FiClock className="text-3xl text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900">{loans.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <FiDollarSign className="text-3xl text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Outstanding Fines
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${fines.reduce((sum, fine) => sum + fine.amount, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {loans.slice(0, 5).map((loan) => (
            <div
              key={loan.id}
              className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{loan.book.title}</h4>
                <p className="text-sm text-gray-600">
                  Borrowed by {loan.user.name}
                </p>
                <p className="text-xs text-gray-500">
                  Due: {formatDate(loan.dueDate)}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  loan.status === "overdue"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {loan.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBooks = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={() => {
              toast.loading("Retrying...", { id: "retry" });
              loadData().finally(() => toast.dismiss("retry"));
            }}
          >
            Try Again
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Manage Books
          </h2>
          <Button
            onClick={() => setShowAddBookModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FiPlus className="mr-2" />
            Add New Book
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Input
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-12">
            <FiBook className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No books found
            </h3>
            <p className="text-gray-600">Add your first book to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex space-x-4">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                      <FiBook className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      by {book.author}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      ISBN: {book.isbn}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          book.availableCopies > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {book.availableCopies}/{book.totalCopies} available
                      </span>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditBook(book)}
                        >
                          <FiEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => handleDeleteBookClick(book)}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderLoans = () => (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
        Manage Loans
      </h2>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrowed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {loan.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {loan.user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {loan.book.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {loan.book.author}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(loan.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        isOverdue(loan.dueDate)
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      {formatDate(loan.dueDate)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        loan.status === "overdue"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
        Manage Users
      </h2>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.createdAt ? formatDate(user.createdAt) : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className="text-gray-400">View Only</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <FiUsers className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm">
                      Users will appear here once they register
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFines = () => (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
        Fines & Payments
      </h2>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fines.map((fine) => (
                <tr key={fine._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {fine.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {fine.user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${fine.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {fine.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {fine.createdAt ? formatDate(fine.createdAt) : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        fine.status === "pending"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {fine.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "books":
        return renderBooks();
      case "loans":
        return renderLoans();
      case "users":
        return renderUsers();
      case "fines":
        return renderFines();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="h-screen flex">
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          {sidebarOpen ? (
            <FiX className="h-6 w-6" />
          ) : (
            <FiMenu className="h-6 w-6" />
          )}
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          <span style={{ fontFamily: "Caveat, cursive" }}>Admin Dashboard</span>
        </h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:shadow-sm border-r border-gray-200 h-screen transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 lg:p-6 h-full flex flex-col">
          <nav className="space-y-1 lg:space-y-2 flex-1">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                  className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-colors text-sm lg:text-base ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <IconComponent className="text-base lg:text-lg" />
                  <span className="font-medium truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto lg:ml-0 ml-0">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </div>
      </div>

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={showAddBookModal}
        onClose={() => setShowAddBookModal(false)}
        onSubmit={handleCreateBook}
      />

      {/* Edit Book Modal */}
      <EditBookModal
        isOpen={showEditBookModal}
        onClose={() => setShowEditBookModal(false)}
        onSubmit={handleEditBookSubmit}
        book={selectedBook}
      />

      {/* Delete Book Modal */}
      <DeleteBookModal
        isOpen={showDeleteBookModal}
        onClose={() => setShowDeleteBookModal(false)}
        onConfirm={handleDeleteBookConfirm}
        book={selectedBook}
        loading={false}
      />
    </div>
  );
};

export default AdminDashboard;
