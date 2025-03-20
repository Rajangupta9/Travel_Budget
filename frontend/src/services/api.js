import axios from "axios";

const api = axios.create({
  baseURL: "https://travel-budget-coo4.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
