import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { fetchEmails, sendEmail } from "../services/api"; // <-- include sendEmail
import { useAuth } from "./AuthContext";

export const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [emails, setEmails] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch all emails for current user
  const loadEmails = useCallback(async () => {
    if (!user || !user.email) {
      console.error("User not logged in");
      return;
    }

    setIsFetching(true);
    try {
      const data = await fetchEmails(user.email);
      setEmails(data);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setIsFetching(false);
    }
  }, [user]);

  // Send new email
  const handleSendEmail = async (emailData) => {
    try {
      const response = await sendEmail(emailData);
      // Append sent email to current state
      setEmails((prev) => [...prev, { ...emailData, status: "Sent", date: new Date().toLocaleString() }]);
      return response;
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!loading && user?.email) {
      loadEmails();
    }
  }, [loading, user, loadEmails]);

  return (
    <EmailContext.Provider value={{ emails, loadEmails, isFetching, handleSendEmail }}>
      {children}
    </EmailContext.Provider>
  );
};

// Custom Hook
export const useEmails = () => useContext(EmailContext);
