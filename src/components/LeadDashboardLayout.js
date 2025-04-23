// src/components/LeadDashboardLayout.js
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LeadDashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Lead Panel</h2>
        <p className="user-info">Welcome, {user?.name}</p>

        <nav className="sidebar-nav">
          <NavLink to="/lead" end className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/lead/leads" className="nav-link">
            Leads
          </NavLink>
          <NavLink to="/lead/tasks" className="nav-link">
            Tasks
          </NavLink>
          <NavLink to="/lead/sales" className="nav-link">
            Sales
          </NavLink>
        </nav>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default LeadDashboardLayout;
