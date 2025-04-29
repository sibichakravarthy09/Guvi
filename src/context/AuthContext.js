import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi, logout as logoutApi, register as registerApi } from "../services/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLead, setIsLead] = useState(false);
  const navigate = useNavigate();

  // ✅ Load user from localStorage on first load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setIsAdmin(parsedUser.role === "admin");
      setIsLead(parsedUser.role === "lead");
    }
    setLoading(false);
  }, []);

  // ✅ Login
  const login = async (email, password) => {
    try {
      const userData = await loginApi(email, password); // no role sent

      if (!userData?.role) throw new Error("Role missing in backend response");

      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.role === "admin");
      setIsLead(userData.role === "lead");
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect based on role
      if (userData.role === "admin") {
        navigate("/admin-dashboard");
      } else if (userData.role === "lead") {
        navigate("/lead-dashboard");
      }

      return true;
    } catch (error) {
      console.error("Login error:", error.message || error);
      return false;
    }
  };

  // ✅ Register
  const register = async (name, email, password, role) => {
    try {
      const userData = await registerApi(name, email, password, role);

      if (!userData?.role) throw new Error("Role missing in backend response");

      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.role === "admin");
      setIsLead(userData.role === "lead");
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect based on role
      if (userData.role === "admin") {
        navigate("/admin-dashboard");
      } else if (userData.role === "lead") {
        navigate("/lead-dashboard");
      }

      return true;
    } catch (error) {
      console.error("Registration error:", error.message || error);
      return false;
    }
  };

  // ✅ Logout
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
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register, // Expose register function to the context
        loading,
        isAuthenticated,
        isAdmin,
        isLead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
