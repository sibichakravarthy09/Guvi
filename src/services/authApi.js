// src/services/authApi.js
import axios from "axios";

const authApi = axios.create({
  baseURL: "https://crm-backend-d6nj.onrender.com/api/auth",
  withCredentials: true,
});

export const login = async (email, password) => {
  const res = await authApi.post("/login", { email, password }); // ⛔ remove role
  return res.data; // should include role from backend response
};

export const logout = async () => {
  await authApi.post("/logout");
};
