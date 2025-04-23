import { createContext, useState, useEffect, useContext, useCallback } from "react";
import {
  fetchCustomers,
  addNewCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/api";
import { useAuth } from "./AuthContext";

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const loadCustomers = useCallback(async () => {
    setIsFetching(true);
    try {
      const data = await fetchCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  const addCustomer = async (customer) => {
    try {
      const newCustomer = await addNewCustomer(customer);
      setCustomers((prev) => [...prev, newCustomer]);
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const editCustomer = async (id, updatedData) => {
    try {
      const updatedCustomer = await updateCustomer(id, updatedData);
      setCustomers((prev) =>
        prev.map((cust) => (cust._id === id ? updatedCustomer : cust))
      );
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const removeCustomer = async (id) => {
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((cust) => cust._id !== id));
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  useEffect(() => {
    if (!loading) {
      loadCustomers();
    }
  }, [loading, loadCustomers]);

  return (
    <CustomerContext.Provider
      value={{
        customers,
        isFetching,
        loadCustomers,
        addCustomer,
        editCustomer,
        removeCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => useContext(CustomerContext);
