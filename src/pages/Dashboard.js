import React, { useState } from "react";
import {
  FaTasks,
  FaBell,
  FaCalendarAlt,
  FaCheckCircle,
  FaUsers,
  FaChartLine,
  FaMoneyBillAlt,
  FaClock
} from "react-icons/fa";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [filter, setFilter] = useState("all");

  const activityData = [
    { type: "lead", text: "➕ New lead: Vijay", time: "2 mins ago" },
    { type: "task", text: "✅ Task completed: Email follow-up", time: "15 mins ago" },
    { type: "sale", text: "💰 Sale closed: $2,000", time: "30 mins ago" },
    { type: "lead", text: "➕ New lead: Jane Smith", time: "1 hour ago" },
  ];

  const filteredActivity =
    filter === "all"
      ? activityData
      : activityData.filter((item) => item.type === filter);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {/* KPI Snapshot */}
      <div className="kpi-cards">
        <div className="kpi-card">
          <h3><FaChartLine /> Leads Today</h3>
          <p>12</p>
        </div>
        <div className="kpi-card">
          <h3><FaMoneyBillAlt /> Revenue Today</h3>
          <p>$4,500</p>
        </div>
        <div className="kpi-card">
          <h3><FaClock /> Avg. Lead Response</h3>
          <p>30 mins</p>
        </div>
        <div className="kpi-card">
          <h3><FaCheckCircle /> Completed Tasks</h3>
          <p>5</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Task Overview */}
        <div className="task-overview">
          <h2><FaTasks /> Task Overview</h2>
          <p>🗓️ 3 tasks due today</p>
          <p>⚠️ 2 overdue</p>
          <p>✅ 5 in progress</p>
        </div>

        {/* Team Status */}
        <div className="team-status">
          <h2><FaUsers /> Team Status</h2>
          <ul>
            <li>🟢 Alex (Online)</li>
            <li>🟠 Sibi (In a meeting)</li>
            <li>🔴 Maya (Offline)</li>
          </ul>
          <p>🎉 Sibi closed 2 deals today!</p>
        </div>

        {/* Notifications */}
        <div className="notifications">
          <h2><FaBell /> Notifications</h2>
          <ul>
            <li>⚠️ 3 leads uncontacted for 7+ days</li>
            <li>⏰ Task deadline approaching</li>
            <li>📧 New customer message</li>
          </ul>
        </div>

        {/* Calendar Widget */}
        <div className="calendar-widget">
          <h2><FaCalendarAlt /> Calendar</h2>
          <p>📅 April 10, 2025</p>
          <ul>
            <li>✔ Meeting with team at 11:00 AM</li>
            <li>📝 Follow-up call with client at 3:00 PM</li>
          </ul>
        </div>

        {/* Recent Activity with Filtering */}
        <div className="activity-feed">
          <h2>Recent Activity</h2>

          <div className="filter-buttons">
            <button onClick={() => setFilter("all")}>All</button>
            <button onClick={() => setFilter("lead")}>Leads</button>
            <button onClick={() => setFilter("task")}>Tasks</button>
            <button onClick={() => setFilter("sale")}>Sales</button>
          </div>

          <ul>
            {filteredActivity.map((item, index) => (
              <li key={index}>
                {item.text} <span className="time">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
