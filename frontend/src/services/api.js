import axios from "axios";

const api = axios.create({
  baseURL: "https://travel-budget-j7jp.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
