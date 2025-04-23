import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import DashboardLayout from "./components/DashboardLayout"; // Admin layout
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/LeadsPage";
import Customers from "./pages/Customers";
import Tasks from "./pages/TasksPage";
import Sales from "./pages/SalesPage";
import Emails from "./pages/EmailsPage";
import Analytics from "./pages/AnalyticsPage";

import LoginPage from "./pages/LoginPage";


import LeadDashboard from "./pages/LeadDashboard"; // Lead dashboard page

function App() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* ✅ Public Login Route */}
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to={user?.role === "admin" ? "/admin" : "/lead"} />
            : <LoginPage />
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

      {/* ✅ Fallback - Redirect to login or role dashboard */}
      <Route
        path="*"
        element={
          isAuthenticated
            ? <Navigate to={user?.role === "admin" ? "/admin" : "/lead"} />
            : <Navigate to="/login" />
        }
      />
    </Routes>
  );
}

export default App;
