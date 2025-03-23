import api from "../services/api";

 export const SignupUser = async (userData) => {
  try {
    const response = await api.post("/user/signup", userData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

 export const LoginUser = async (credentials) => {
  try {
    const response = await api.post("/user/login", credentials);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Password reset API endpoints
export const passwordResetService = {
  // Request password reset (send OTP)
  requestReset: async (email) => {
    try {
      const response = await api.post('/user/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: 'Failed to send reset request' };
    }
  },
  
  // Verify OTP code
  verifyOTP: async (email, otp) => {
    try {
      const response = await api.post('/user/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: 'Failed to verify OTP' };
    }
  },
  
  // Reset password with token
  resetPassword: async (resetToken, password, otp) => {
    try {
      const response = await api.post('/user/reset-password', { 
        resetToken, 
        password,
        otp
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: 'Failed to reset password' };
    }
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get("/user/profile"); 
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const tripService = {
  // Create a new trip
  createTrip: async (tripData) => {
    try {
      const response = await api.post("/trip/create-trip", tripData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to create trip" };
    }
  },

  // Get all trips for the user
  getTrips: async () => {
    try {
      const response = await api.get("/trip/trips");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch trips" };
    }
  },

  // Get a specific trip by ID
  getTripById: async (tripId) => {
    try {
      const response = await api.get(`/trip/${tripId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch trip details" };
    }
  },

  // Update a trip
  updateTrip: async (tripId, tripData) => {
    try {
      const response = await api.put(`/trip/update-trip/${tripId}`, tripData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update trip" };
    }
  },

  // Delete a trip
  deleteTrip: async (tripId) => {
    try {
      const response = await api.delete(`/trip/delete-trip/${tripId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete trip" };
    }
  }
};

// Report related API services
export const reportService = {
  // Create a new report
  createReport: async (reportData) => {
    try {
      const response = await api.post("/report/create", reportData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to create report" };
    }
  },

  // Get reports for the user
  getReports: async () => {
    try {
      const response = await api.get("/report");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch reports" };
    }
  },

  // Get a specific report by ID
  getReportById: async (reportId) => {
    try {
      const response = await api.get(`/report/${reportId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch report details" };
    }
  },

  // Delete a report
  deleteReport: async (reportId) => {
    try {
      const response = await api.delete(`/report/${reportId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete report" };
    }
  },

  // Get all reports (admin function)
  getAllReports: async () => {
    try {
      const response = await api.get("/report/all");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch all reports" };
    }
  },

  // Compare reports
  compareReports: async (reportIds) => {
    try {
      const response = await api.get("/report/compare", { params: { reportIds } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to compare reports" };
    }
  }
};

// Expense related API services
export const expenseService = {
  // Create a new expense
  createExpense: async (expenseData) => {
    try {
      const response = await api.post("/expense/create", expenseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to create expense" };
    }
  },

  // Get all expenses for the user
  getExpenses: async (queryParams = {}) => {
    try {
      const response = await api.get("/expense", { params: queryParams });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch expenses" };
    }
  },

  // Get a specific expense by ID
  getExpenseById: async (expenseId) => {
    try {
      const response = await api.get(`/expense/${expenseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch expense details" };
    }
  },

  // Update an expense
  updateExpense: async (expenseId, expenseData) => {
    try {
      const response = await api.put(`/expense/${expenseId}`, expenseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update expense" };
    }
  },

  // Delete an expense
  deleteExpense: async (expenseId) => {
    try {
      const response = await api.delete(`/expense/${expenseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete expense" };
    }
  },

  // Get expense statistics for a trip
  getExpenseStatistics: async (tripId) => {
    try {
      const response = await api.get(`/expense/statistics/${tripId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch expense statistics" };
    }
  }
};



