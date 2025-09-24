import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import BookCatalog from "./components/Books/BookCatalog";
import BookDetail from "./pages/BookDetail";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import apiService from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Clear any old token first
        localStorage.removeItem("token");

        const token = localStorage.getItem("librarytoken");
        if (token) {
          const userData = await apiService.getMe();
          setUser(userData.user);
        }
      } catch (error) {
        // Token is invalid, clear it
        apiService.clearToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    apiService.clearToken();
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, requireAdmin = false }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user.role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  };

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#4ade80",
                secondary: "#fff",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <Layout user={user} onLogout={handleLogout}>
                <Home user={user} />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  replace
                />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  replace
                />
              ) : (
                <Register onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/catalog"
            element={
              <Layout user={user} onLogout={handleLogout}>
                <BookCatalog />
              </Layout>
            }
          />
          <Route
            path="/books/:id"
            element={
              <Layout user={user} onLogout={handleLogout}>
                <BookDetail user={user} />
              </Layout>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout user={user} onLogout={handleLogout}>
                  <UserDashboard user={user} />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout user={user} onLogout={handleLogout}>
                  <AdminDashboard user={user} />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
