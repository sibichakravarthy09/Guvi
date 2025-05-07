import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import DashboardLayout from "./components/DashboardLayout"; // Shared layout

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";

// Shared Pages
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/LeadsPage";
import Customers from "./pages/Customers";
import Tasks from "./pages/TasksPage";
import Sales from "./pages/SalesPage";
import Emails from "./pages/EmailsPage";
import Analytics from "./pages/AnalyticsPage";
import Property from "./pages/Property";
import Message from "./pages/Message";

// Auth Page
import LoginPage from "./pages/LoginPage";

// Lead Dashboard
import LeadDashboard from "./pages/LeadDashboard";

// ✅ Customer Dashboard
import CustomerDashboard from "./pages/CustomerDashboard";

function App() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* ✅ Login Route */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            user?.role === "admin" ? (
              <Navigate to="/admin" />
            ) : user?.role === "lead" ? (
              <Navigate to="/lead" />
            ) : (
              <Navigate to="/customer/dashboard" />
            )
          ) : (
            <LoginPage />
          )
        }
      />

      {/* ✅ Admin Routes */}
      {isAuthenticated && user?.role === "admin" && (
        <Route path="/admin/*" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="customers" element={<Customers />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="sales" element={<Sales />} />
          <Route path="message" element={<Message />} />
          <Route path="emails" element={<Emails />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      )}

      {/* ✅ Lead Routes */}
      {isAuthenticated && user?.role === "lead" && (
        <Route path="/lead/*" element={<DashboardLayout />}>
          <Route index element={<LeadDashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="sales" element={<Sales />} />
          <Route path="emails" element={<Emails />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      )}

       {/* ✅ Customer Routes */}
       {isAuthenticated && user?.role === "user" && (
        <Route path="/customer/*" element={<DashboardLayout />}>
          <Route  index element={<CustomerDashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="property" element={<Property />} />
          <Route path="message" element={<Message />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      )}

      {/* ✅ Fallback Route */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            user?.role === "admin" ? (
              <Navigate to="/admin" />
            ) : user?.role === "lead" ? (
              <Navigate to="/lead" />
            ) : (
              <Navigate to="/customer" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
