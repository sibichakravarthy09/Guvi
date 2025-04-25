import axios from "axios";

// --------- HELPERS ---------
const getRole = () => localStorage.getItem("role") || "admin";
const getEmail = () => localStorage.getItem("userEmail") || "admin123@gmail.com";

// Create Axios instance (base domain only)
const api = axios.create({
  baseURL: "https://crm-backend-d6nj.onrender.com/api", // domain only
  withCredentials: true,
});

// Interceptor: Adjust baseURL per role + inject token and email
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const role = getRole(); // "admin" or "lead"
  const email = getEmail();

  config.baseURL = `https://crm-backend-d6nj.onrender.com/api/${role}`; // update base per role
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
export const fetchLeads = () => api.get("/leads").then(res => res.data);
export const addLead = (lead) => api.post("/leads", lead).then(res => res.data);
export const updateLead = (id, data) => api.put(`/leads/${id}`, data).then(res => res.data);
export const deleteLead = (id) => api.delete(`/leads/${id}`).then(res => res.data);

// ----------- CUSTOMERS ------------
export const fetchCustomers = () => api.get("/customers").then(res => res.data);
export const addNewCustomer = (customer) => api.post("/customers", customer).then(res => res.data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data).then(res => res.data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`).then(res => res.data);

// ----------- TASKS ------------
export const fetchTasks = () => api.get("/tasks").then(res => res.data);
export const addTask = (task) => api.post("/tasks", task).then(res => res.data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data).then(res => res.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then(res => res.data);

// ----------- SALES ------------
export const fetchSales = () => api.get("/sales").then(res => res.data);
export const createSale = (sale) => api.post("/sales", sale).then(res => res.data);
export const updateSale = (id, data) => api.put(`/sales/${id}`, data).then(res => res.data);
export const deleteSale = (id) => api.delete(`/sales/${id}`);

// ----------- EMAILS ------------
export const fetchEmails = () => api.get("/emails").then(res => res.data);
export const sendEmail = (email) => api.post("/emails", email).then(res => res.data);
export const updateEmail = (id, data) => api.put(`/emails/${id}`, data).then(res => res.data);
export const deleteEmail = (id) => api.delete(`/emails/${id}`).then(res => res.data);

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
