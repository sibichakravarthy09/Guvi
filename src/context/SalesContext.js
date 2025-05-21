import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { fetchSales, createSale, updateSale, deleteSale } from "../services/api";
import { useAuth } from "./AuthContext";

export const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [sales, setSales] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const loadSales = useCallback(async () => {
    if (loading) return;
    if (!user) {
      console.warn("User not found. Skipping sales fetch.");
      return;
    }

    setIsFetching(true);
    try {
      const data = await fetchSales();
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setIsFetching(false);
    }
  }, [user, loading]);

  // Create a new sale
  const addNewSale = async (saleData) => {
    try {
      const newSale = await createSale(saleData);
      setSales((prev) => [...prev, newSale]);
    } catch (error) {
      console.error("Error creating sale:", error);
    }
  };

  // Update a sale — rename to updateSale to keep naming consistent
  const updateSaleById = async (id, updatedSale) => {
    try {
      const updated = await updateSale(id, updatedSale);
      setSales((prev) => prev.map((sale) => (sale._id === id ? updated : sale)));
    } catch (error) {
      console.error("Error updating sale:", error);
    }
  };

  // Delete a sale — rename to deleteSale to keep naming consistent
  const deleteSaleById = async (id) => {
    try {
      await deleteSale(id);
      setSales((prev) => prev.filter((sale) => sale._id !== id));
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  return (
    <SalesContext.Provider
      value={{
        sales,
        isFetching,
        loadSales,
        addNewSale,
        updateSale: updateSaleById,
        deleteSale: deleteSaleById,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => useContext(SalesContext);
