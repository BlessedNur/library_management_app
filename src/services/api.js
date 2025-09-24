import toast from "react-hot-toast";

const API_BASE_URL = "https://library-management-backend-lqqv.onrender.com/api";

class ApiService {
  constructor() {
    // Clear any old token keys first
    localStorage.removeItem("token");
    this.token = localStorage.getItem("librarytoken");
    console.log(
      "ApiService initialized with token:",
      this.token ? "Present" : "Not found"
    );
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem("librarytoken", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("librarytoken");
    // Also clear any old token keys
    localStorage.removeItem("token");
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };


    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses (like 500 errors)
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }

      if (!response.ok) {
        const errorMessage = data.message || `Server error: ${response.status}`;
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      if (
        !error.message.includes("Server error") &&
        !error.message.includes("Network error")
      ) {
        toast.error("Network error. Please check your connection.");
      }
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    const result = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    toast.success("Account created successfully!");
    return result;
  }

  async login(credentials) {
    const result = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    toast.success("Welcome back!");
    return result;
  }

  async getMe() {
    return this.request("/auth/me");
  }

  // Books endpoints
  async getBooks() {
    return this.request("/books");
  }

  async getBook(id) {
    return this.request(`/books/${id}`);
  }

  async createBook(bookData) {
    const result = await this.request("/books", {
      method: "POST",
      body: JSON.stringify(bookData),
    });
    toast.success("Book created successfully!");
    return result;
  }

  async updateBook(id, bookData) {
    const result = await this.request(`/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(bookData),
    });
    toast.success("Book updated successfully!");
    return result;
  }

  async deleteBook(id) {
    const result = await this.request(`/books/${id}`, {
      method: "DELETE",
    });
    toast.success("Book deleted successfully!");
    return result;
  }

  // Loans endpoints
  async getLoans() {
    return this.request("/loans");
  }

  async createLoan(loanData) {
    return this.request("/loans", {
      method: "POST",
      body: JSON.stringify(loanData),
    });
  }

  async returnBook(loanId) {
    const result = await this.request(`/loans/${loanId}/return`, {
      method: "PUT",
    });
    toast.success("Book returned successfully!");
    return result;
  }

  // Reservations endpoints
  async getReservations() {
    return this.request("/reservations");
  }

  async createReservation(reservationData) {
    const result = await this.request("/reservations", {
      method: "POST",
      body: JSON.stringify(reservationData),
    });
    toast.success("Book reserved successfully!");
    return result;
  }

  async cancelReservation(reservationId) {
    const result = await this.request(`/reservations/${reservationId}/cancel`, {
      method: "PUT",
    });
    toast.success("Reservation cancelled!");
    return result;
  }

  // Fines endpoints
  async getFines() {
    return this.request("/fines");
  }

  async createFine(fineData) {
    const result = await this.request("/fines", {
      method: "POST",
      body: JSON.stringify(fineData),
    });
    toast.success("Fine created successfully!");
    return result;
  }

  async payFine(fineId) {
    const result = await this.request(`/fines/${fineId}/pay`, {
      method: "PUT",
    });
    toast.success("Fine paid successfully!");
    return result;
  }

  // Users API
  async getUsers() {
    return this.request("/users");
  }
}

export default new ApiService();
