import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { fetchLeads, addLead, updateLead, deleteLead } from "../services/api";
import { useAuth } from "./AuthContext";

export const LeadContext = createContext();

export const LeadProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [leads, setLeads] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // ✅ Fetch leads
  const loadLeads = useCallback(async () => {
    if (loading) return;
    if (!user) {
      console.warn("User not found. Skipping lead fetch.");
      return;
    }

    setIsFetching(true);
    try {
      console.log("Fetching leads...");
      const data = await fetchLeads();
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setIsFetching(false);
    }
  }, [user, loading]);

  // ✅ Create a new lead
  const createLead = async (lead) => {
    try {
      const newLead = await addLead(lead);
      setLeads((prevLeads) => [...prevLeads, newLead]); // Update state
    } catch (error) {
      console.error("Error adding lead:", error);
    }
  };

  // ✅ Update a lead
  const editLead = async (id, leadData) => {
    try {
      const updatedLead = await updateLead(id, leadData);
      setLeads((prevLeads) => prevLeads.map((lead) => (lead._id === id ? updatedLead : lead)));
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  // ✅ Delete a lead
  const removeLead = async (id) => {
    try {
      await deleteLead(id);
      setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== id));
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  // Fetch leads when component mounts
  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  return (
    <LeadContext.Provider value={{ leads, loadLeads, createLead, editLead, removeLead, isFetching }}>
      {children}
    </LeadContext.Provider>
  );
};

// ✅ Custom hook to use lead context
export const useLeads = () => useContext(LeadContext);
