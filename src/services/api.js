import axios from "axios";

// --------- HELPERS ---------
const getRole = () => localStorage.getItem("role") || "admin";
const getEmail = () => localStorage.getItem("userEmail") || "admin123@gmail.com";

// Create Axios instance (base domain only)
const api = axios.create({
  baseURL: "https://guvi-1j1n.onrender.com/api", // base domain only
  withCredentials: true,
});

// Interceptor: Adjust baseURL per role + inject token and email
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const role = getRole(); // "admin" or "lead"
  const email = getEmail();

  config.baseURL = `https://guvi-1j1n.onrender.com/api/${role}`; // update baseURL per role
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers.email = email;

  return config;
});

// ----------- AUTH ------------

export const login = async (email, password, role = "admin") => {
  try {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("userEmail", email);
    localStorage.setItem("role", role); // "admin" or "lead"
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed!";
  }
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("role");
    return true;
  } catch (error) {
    throw error.response?.data?.message || "Logout failed!";
  }
};

// ----------- DASHBOARD ------------

export const fetchDashboardData = async () => {
  const res = await api.get("/dashboard");
  return res.data;
};

// ----------- LEADS ------------

export const fetchLeads = async () => {
  const res = await api.get("/leads");
  return res.data;
};
export const addLead = async (lead) => {
  const res = await api.post("/leads", lead);
  return res.data;
};
export const updateLead = async (id, data) => {
  const res = await api.put(`/leads/${id}`, data);
  return res.data;
};
export const deleteLead = async (id) => {
  const res = await api.delete(`/leads/${id}`);
  return res.data;
};

// ----------- CUSTOMERS ------------

// Fetch customers based on the logged-in user's email
export const fetchCustomers = async () => {
  const email = getEmail();
  const res = await api.get(`/customers?email=${email}`);
  return res.data;
};
export const addNewCustomer = async (customer) => {
  const res = await api.post("/customers", customer);
  return res.data;
};
export const updateCustomer = async (id, data) => {
  const res = await api.put(`/customers/${id}`, data);
  return res.data;
};
export const deleteCustomer = async (id) => {
  const res = await api.delete(`/customers/${id}`);
  return res.data;
};

// ----------- TASKS ------------

export const fetchTasks = async () => {
  const res = await api.get("/tasks");
  return res.data;
};
export const addTask = async (task) => {
  const res = await api.post("/tasks", task);
  return res.data;
};
export const updateTask = async (id, data) => {
  const res = await api.put(`/tasks/${id}`, data);
  return res.data;
};
export const deleteTask = async (id) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};

// ----------- SALES ------------

export const fetchSales = async () => {
  const res = await api.get("/sales");
  return res.data;
};
export const createSale = async (sale) => {
  const res = await api.post("/sales", sale);
  return res.data;
};
export const updateSale = async (id, data) => {
  const res = await api.put(`/sales/${id}`, data);
  return res.data;
};
export const deleteSale = async (id) => {
  const res = await api.delete(`/sales/${id}`);
  return res.data;
};

// ----------- EMAILS ------------

export const fetchEmails = async () => {
  const res = await api.get("/emails");
  return res.data;
};
export const sendEmail = async (email) => {
  const res = await api.post("/emails", email);
  return res.data;
};
export const updateEmail = async (id, data) => {
  const res = await api.put(`/emails/${id}`, data);
  return res.data;
};
export const deleteEmail = async (id) => {
  const res = await api.delete(`/emails/${id}`);
  return res.data;
};

// ----------- ANALYTICS ------------

export const fetchAnalytics = async () => {
  try {
    const response = await api.get("/analytics");
    return response.data;
  } catch (error) {
    console.error("Analytics fetch error:", error?.response?.data || error.message);
    throw new Error("Failed to fetch analytics.");
  }
};

export default api;
