import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
} from "../services/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLead, setIsLead] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);
  const navigate = useNavigate();

  // Centralized redirect logic based on role
  const redirectToDashboard = (role) => {
    const routes = {
      admin: "/admin-dashboard",
      lead: "/lead-dashboard",
      customer: "/customer-dashboard",
    };
    navigate(routes[role] || "/login");
  };

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setIsAdmin(parsedUser.role === "admin");
      setIsLead(parsedUser.role === "lead");
      setIsCustomer(parsedUser.role === "customer");
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const userData = await loginApi(email, password);
      if (!userData?.role) throw new Error("Role missing in backend response");

      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.role === "admin");
      setIsLead(userData.role === "lead");
      setIsCustomer(userData.role === "customer");
      localStorage.setItem("user", JSON.stringify(userData));

      redirectToDashboard(userData.role);
      return true;
    } catch (error) {
      console.error("Login error:", error.message || error);
      return false;
    }
  };

  // Register
  const register = async (name, email, password, role) => {
    try {
      const userData = await registerApi(name, email, password, role);
      if (!userData?.role) throw new Error("Role missing in backend response");

      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.role === "admin");
      setIsLead(userData.role === "lead");
      setIsCustomer(userData.role === "user");
      localStorage.setItem("user", JSON.stringify(userData));

      redirectToDashboard(userData.role);
      return true;
    } catch (error) {
      console.error("Registration error:", error.message || error);
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.warn("Logout error (ignored):", err.message || err);
    }
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsLead(false);
    setIsCustomer(false);
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        loading,
        isAuthenticated,
        isAdmin,
        isLead,
        isCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
