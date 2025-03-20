import api from "../services/api";

export const signupUser = async (userData) => {
  try {
    const response = await api.post("/user/signup", userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/user/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
