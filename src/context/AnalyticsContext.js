import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { fetchAnalytics } from "../services/api";
import { useAuth } from "./AuthContext";

export const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const loadAnalytics = useCallback(async () => {
    if (!user) return;

    setIsFetching(true);
    setError(null);

    try {
      const data = await fetchAnalytics();
      setAnalyticsData(data || {}); // fallback to empty object if null
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err?.message || "Unknown error");
    } finally {
      setIsFetching(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      loadAnalytics();
    }
  }, [authLoading, user, loadAnalytics]);

  return (
    <AnalyticsContext.Provider
      value={{
        analyticsData,
        loadAnalytics,
        isFetching,
        error,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => useContext(AnalyticsContext);
