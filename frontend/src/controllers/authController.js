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


export default api;
