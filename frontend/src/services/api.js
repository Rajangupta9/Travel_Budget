import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'https://travel-budget-j7jp.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - adds the access token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add refresh token to header if available
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      config.headers["x-refresh-token"] = refreshToken;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handles token refresh
api.interceptors.response.use(
  (response) => {
    // Check if server sent a new access token
    const newAccessToken = response.headers["x-new-access-token"];
    if (newAccessToken) {
      // Save the new token
      localStorage.setItem("accessToken", newAccessToken);
      console.log("Access token refreshed");
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to an invalid token and we haven't tried refreshing yet
    if (error.response?.status === 403 && 
        !originalRequest._retry && 
        localStorage.getItem("refreshToken")) {
      
      originalRequest._retry = true;
      
      try {
        // Try to refresh token by making a request to the refresh endpoint
        // This is optional if your server already handles refresh in every request
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(
          'https://your-api-url.com/api/refresh-token',
          {},
          {
            headers: {
              'x-refresh-token': refreshToken
            }
          }
        );
        
        // If refresh was successful, get the new token
        if (response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
          // Update the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token is also invalid, redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;