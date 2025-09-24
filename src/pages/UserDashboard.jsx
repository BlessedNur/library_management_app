import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import {
  FiLayout,
  FiBook,
  FiClock,
  FiDollarSign,
  FiMenu,
  FiX,
} from "react-icons/fi";
import apiService from "../services/api";

const UserDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Real data from API
  const [loans, setLoans] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [loansData, reservationsData, finesData] = await Promise.all([
        apiService.getLoans(),
        apiService.getReservations(),
        apiService.getFines(),
      ]);

      setLoans(loansData);
      setReservations(reservationsData);
      setFines(finesData);
    } catch (error) {
      // Error toast is already shown by API service
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleReturn = async (loanId) => {
    try {
      await apiService.returnBook(loanId);
      await loadData(); // Reload data
    } catch (error) {
      // Error toast is already shown by API service
    }
  };

  const handleRenew = (loanId) => {
    // TODO: Implement renewal functionality when backend supports it
    console.log("Renewing loan:", loanId);
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      await apiService.cancelReservation(reservationId);
      await loadData(); // Reload data
    } catch (error) {
      // Error toast is already shown by API service
    }
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: FiLayout },
    { id: "loans", label: "Current Loans", icon: FiBook },
    { id: "history", label: "Loan History", icon: FiBook },
    { id: "reservations", label: "Reservations", icon: FiClock },
    { id: "fines", label: "Fines & Payments", icon: FiDollarSign },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <FiBook className="text-3xl text-gray-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900">{loans.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <FiClock className="text-3xl text-gray-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reservations</p>
              <p className="text-2xl font-bold text-gray-900">
                {reservations.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <FiDollarSign className="text-3xl text-gray-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Outstanding Fines
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {fines.filter((fine) => fine.status === "pending").length}
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
          {loans.slice(0, 5).map((loan, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                <FiBook className="text-gray-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {loan.book?.title || "Unknown Book"}
                </h4>
                <p className="text-sm text-gray-600">
                  by {loan.book?.author || "Unknown Author"}
                </p>
                <p className="text-xs text-gray-500">Currently borrowed</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLoans = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading loans...</p>
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
            Current Loans
          </h2>
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loans.length === 0 ? (
          <div className="text-center py-12">
            <FiBook className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No current loans
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring our collection!
            </p>
            <Button asChild>
              <Link to="/">Browse Books</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {loans.map((loan) => (
              <div
                key={loan._id}
                className={`border rounded-lg p-6 transition-all duration-200 hover:shadow-md ${
                  isOverdue(loan.dueDate)
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200 bg-white hover:border-blue-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-28 bg-gray-200 rounded-lg shadow-sm flex items-center justify-center">
                      <FiBook className="text-gray-400 text-2xl" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                          {loan.book?.title || "Unknown Book"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 truncate">
                          by {loan.book?.author || "Unknown Author"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {isOverdue(loan.dueDate) ? (
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                            Overdue
                          </span>
                        ) : getDaysUntilDue(loan.dueDate) <= 3 ? (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                            Due Soon
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                            Active
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="space-y-1">
                        <p className="text-gray-500">
                          <span className="font-medium">Borrowed:</span>{" "}
                          {formatDate(loan.borrowedDate)}
                        </p>
                        <p
                          className={`font-medium ${
                            isOverdue(loan.dueDate)
                              ? "text-red-600"
                              : getDaysUntilDue(loan.dueDate) <= 3
                              ? "text-yellow-600"
                              : "text-gray-900"
                          }`}
                        >
                          <span className="font-medium">Due:</span>{" "}
                          {formatDate(loan.dueDate)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        {!isOverdue(loan.dueDate) && (
                          <p
                            className={`font-medium ${
                              getDaysUntilDue(loan.dueDate) <= 3
                                ? "text-yellow-600"
                                : "text-blue-600"
                            }`}
                          >
                            {getDaysUntilDue(loan.dueDate)} days left
                          </p>
                        )}
                        <p className="text-gray-500">
                          <span className="font-medium">Status:</span>{" "}
                          {loan.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={() => handleReturn(loan._id)}
                    className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                  >
                    Return Book
                  </Button>
                  <Button
                    onClick={() => handleRenew(loan._id)}
                    variant="outline"
                    className="flex-1 sm:flex-none"
                  >
                    Renew Loan
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderHistory = () => {
    const returnedLoans = loans.filter((loan) => loan.status === "returned");

    return (
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Loan History
        </h2>

        {returnedLoans.length === 0 ? (
          <div className="text-center py-12">
            <FiBook className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No loan history
            </h3>
            <p className="text-gray-600">
              Your borrowing history will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {returnedLoans.map((loan) => (
              <div
                key={loan._id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex space-x-4">
                  <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                    <FiBook className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {loan.book?.title || "Unknown Book"}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      by {loan.book?.author || "Unknown Author"}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Borrowed: {formatDate(loan.borrowedDate)}</span>
                      <span>Returned: {formatDate(loan.returnedDate)}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          loan.status === "returned"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {loan.status}
                      </span>
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

  const renderReservations = () => (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
        Reservations
      </h2>

      {reservations.length === 0 ? (
        <div className="text-center py-12">
          <FiClock className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reservations
          </h3>
          <p className="text-gray-600">
            Books you've reserved will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div
              key={reservation._id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex space-x-4">
                <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                  <FiBook className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {reservation.book?.title || "Unknown Book"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    by {reservation.book?.author || "Unknown Author"}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Reserved: {formatDate(reservation.createdAt)}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        reservation.status === "waiting"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button
                    onClick={() => handleCancelReservation(reservation._id)}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFines = () => {
    const pendingFines = fines.filter((fine) => fine.status === "pending");
    const totalAmount = pendingFines.reduce(
      (sum, fine) => sum + fine.amount,
      0
    );

    return (
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Fines & Payments
        </h2>

        {pendingFines.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-900">
                  Outstanding Fines
                </h3>
                <p className="text-red-700">Total: ${totalAmount.toFixed(2)}</p>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Pay Now
              </Button>
            </div>
          </div>
        )}

        {fines.length === 0 ? (
          <div className="text-center py-12">
            <FiDollarSign className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No fines</h3>
            <p className="text-gray-600">You have no outstanding fines.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {fines.map((fine) => (
              <div
                key={fine._id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {fine.loan?.book?.title || "Unknown Book"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {fine.status === "pending" ? "Outstanding fine" : "Paid"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        fine.status === "pending"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      ${fine.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {fine.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "loans":
        return renderLoans();
      case "history":
        return renderHistory();
      case "reservations":
        return renderReservations();
      case "fines":
        return renderFines();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between fixed top-16 left-0 right-0 z-50">
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
          <span style={{ fontFamily: "Caveat, cursive" }}>Dashboard</span>
        </h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:shadow-sm border-r border-gray-200 h-screen lg:h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out`}
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
    </div>
  );
};

export default UserDashboard;
