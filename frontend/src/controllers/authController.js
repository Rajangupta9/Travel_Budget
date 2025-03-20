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

