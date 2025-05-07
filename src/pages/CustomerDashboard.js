import React from "react";
import { useAuth } from "../context/AuthContext"; // ✅ Import useAuth

const CustomerDashboard = () => {
  const { user } = useAuth(); // ✅ Ensure it's correctly used

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome customer...</h1>

    </div>
  );
};

export default CustomerDashboard;
