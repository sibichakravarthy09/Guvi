import React, { useContext } from "react";
import { AnalyticsContext } from "../context/AnalyticsContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
  LineChart, Line, Legend
} from "recharts";
import "../styles/Analytics.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const Analytics = () => {
  const { analyticsData: analytics } = useContext(AnalyticsContext);

  const salesStages = analytics?.salesByStage || [];
  const topCustomers = analytics?.topCustomers || [];
  const monthlyRevenue = analytics?.monthlyRevenue || [];

  return (
    <div className="analytics-container" style={{ marginTop: "100px" , marginLeft: "240px"}} >
      <h2>Analytics Dashboard</h2>

      <div className="stats-cards">
        <div className="card">Total Leads <span>{analytics?.totalLeads ?? "N/A"}</span></div>
        <div className="card">Total Sales <span>{analytics?.totalSales ?? "N/A"}</span></div>
        <div className="card">Total Customers <span>{analytics?.totalCustomers ?? "N/A"}</span></div>
        <div className="card">Task Completion Rate <span>{analytics?.taskCompletionRate ?? "N/A"}%</span></div>
        <div className="card">Report Date <span>{analytics?.reportDate ? new Date(analytics.reportDate).toLocaleDateString() : "N/A"}</span></div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h4>Sales by Stage</h4>
          <BarChart width={300} height={250} data={salesStages}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>

        <div className="chart-card">
          <h4>Top Customers</h4>
          <PieChart width={300} height={250}>
            <Pie
              data={topCustomers}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {topCustomers.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>
      </div>

      <div className="chart-card full-width">
        <h4>Monthly Revenue</h4>
        <LineChart width={600} height={250} data={monthlyRevenue}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
};

export default Analytics;
