import axios from "axios";

// Example of properly configured Axios instance
const api = axios.create({
  baseURL: 'https://travel-budget-j7jp.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // Retrieve token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
