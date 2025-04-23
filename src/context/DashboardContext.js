import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { fetchDashboardData } from "../services/api";
import { useAuth } from "./AuthContext";

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [summary, setSummary] = useState({});
  const [isFetching, setIsFetching] = useState(false);

  // ✅ useCallback to avoid ESLint warning
  const fetchSummary = useCallback(async () => {
    if (!user || !user.email) {
      console.error("User not logged in");
      return;
    }

    setIsFetching(true);
    try {
      const data = await fetchDashboardData(user.email);
      setSummary(data);
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
    } finally {
      setIsFetching(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && user?.email) {
      fetchSummary(); // ✅ Fetch summary only after auth is ready
    }
  }, [loading, user, fetchSummary]);

  return (
    <DashboardContext.Provider value={{ summary, fetchSummary, isFetching }}>
      {children}
    </DashboardContext.Provider>
  );
};

// ✅ Custom Hook for easier usage
export const useDashboard = () => useContext(DashboardContext);
