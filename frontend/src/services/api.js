import axios from "axios";

// Example of properly configured Axios instance
const api = axios.create({
  baseURL: 'https://travel-budget-j7jp.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});
export default api;
