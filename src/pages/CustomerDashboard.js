import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const CustomerDashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar role="customer" />
      <div className="dashboard-content">
        <Navbar />
        <h2>Customer Dashboard</h2>
        <p>View sales and progress updates.</p>
      </div>
    </div>
  );
};

export default CustomerDashboard;
