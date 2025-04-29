import axios from "axios";

const authApi = axios.create({
  baseURL: "https://crm-backend-d6nj.onrender.com/api/auth",
  withCredentials: true,
});

// ✅ Login function
export const login = async (email, password) => {
  const res = await authApi.post("/login", { email, password });
  return res.data; // should include role from backend response
};

// ✅ Logout function
export const logout = async () => {
  await authApi.post("/logout");
};

// ✅ Register function with retry
export const register = async (name, email, password, role) => {
  try {
    const res = await authApi.post("/register", { name, email, password, role });
    return res.data;
  } catch (err) {
    console.warn("First register attempt failed, retrying after 2 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
    const res = await authApi.post("/register", { name, email, password, role }); // Retry once
    return res.data;
  }
};
