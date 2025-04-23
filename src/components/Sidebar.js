import { NavLink, useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";
import "../styles/Sidebar.css";
import {
  FaTachometerAlt,
  FaUserPlus,
  FaUsers,
  FaTasks,
  FaDollarSign,
  FaEnvelope,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/login", { replace: true });
    }
  };

  // Only show sidebar for admin or lead roles
  if (!user || (user.role !== "admin" && user.role !== "lead")) {
    return null;
  }

  return (
    <div className="sidebar">
      <h2>Elite Nest Realty</h2>
      <nav>
        <ul>
          {user.role === "admin" && (
            <>
              <li>
                <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                  <FaTachometerAlt /> Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/leads" className={({ isActive }) => (isActive ? "active" : "")}>
                  <FaUserPlus /> Leads
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/customers" className={({ isActive }) => (isActive ? "active" : "")}>
                  <FaUsers /> Customers
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/tasks" className={({ isActive }) => (isActive ? "active" : "")}>
                  <FaTasks /> Tasks
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/sales" className={({ isActive }) => (isActive ? "active" : "")}>
                  <FaDollarSign /> Sales
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/emails" className={({ isActive }) => (isActive ? "active" : "")}>
                  <FaEnvelope /> Emails
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/analytics" className={({ isActive }) => (isActive ? "active" : "")}>
                  <FaChartBar /> Analytics
                </NavLink>
              </li>
            </>
          )}

          {user.role === "lead" && (
            <>
              <li>
                <NavLink to="/lead/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                  <FaTachometerAlt /> Dashboard
                </NavLink>
              </li>
              
              <li>
                <NavLink to="/lead/tasks" className={({ isActive }) => (isActive ? "active" : "")}>
                  <FaTasks /> Tasks
                </NavLink>
              </li>
              <li>
                <NavLink to="/lead/sales" className={({ isActive }) => (isActive ? "active" : "")}>
                  <FaDollarSign /> Sales
                </NavLink>
              </li>
              <li>
                <NavLink to="/lead/emails" className={({ isActive }) => (isActive ? "active" : "")}>
                  <FaEnvelope /> Emails
                </NavLink>
              </li>
              <li>
                <NavLink to="/lead/analytics" className={({ isActive }) => (isActive ? "active" : "")}>
                  <FaChartBar /> Analytics
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
