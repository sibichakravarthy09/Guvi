import React from "react";
import { useAuth } from "../context/AuthContext"; // ✅ Import useAuth

const AdminDashboard = () => {
  const { user } = useAuth(); // ✅ Ensure it's correctly used

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome...</h1>

    </div>
  );
};

export default AdminDashboard;
