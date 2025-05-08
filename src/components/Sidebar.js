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
  FaHome,
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

  if (!user) return null;

  const renderNavLink = (to, icon, label) => (
    <li>
      <NavLink to={to} className={({ isActive }) => (isActive ? "active" : "")}>
        {icon} {label}
      </NavLink>
    </li>
  );

  return (
    <div className="sidebar">
      <h2>Elite Nest Realty</h2>
      <nav>
        <ul>
          {user.role === "admin" && (
            <>
              {renderNavLink("/admin/dashboard", <FaTachometerAlt />, "Dashboard")}
              {renderNavLink("/admin/leads", <FaUserPlus />, "Leads")}
              {renderNavLink("/admin/customers", <FaUsers />, "Customers")}
              {renderNavLink("/admin/tasks", <FaTasks />, "Tasks")}
              {renderNavLink("/admin/sales", <FaDollarSign />, "Sales")}
              {renderNavLink("/admin/message", <FaEnvelope />, "Message")}
              {renderNavLink("/admin/emails", <FaEnvelope />, "Emails")}
              {renderNavLink("/admin/analytics", <FaChartBar />, "Analytics")}
            </>
          )}

          {user.role === "lead" && (
            <>
              {renderNavLink("/lead/dashboard", <FaTachometerAlt />, "Dashboard")}
              {renderNavLink("/lead/tasks", <FaTasks />, "Tasks")}
              {renderNavLink("/lead/sales", <FaDollarSign />, "Sales")}
              {renderNavLink("/lead/emails", <FaEnvelope />, "Emails")}
              {renderNavLink("/lead/analytics", <FaChartBar />, "Analytics")}
            </>
          )}

          {user.role === "user" && (
            <>
              {renderNavLink("/customer/dashboard", <FaTachometerAlt />, "Dashboard")}
              {renderNavLink("/customer/property", <FaHome />, "Property")}
              {renderNavLink("/customer/message", <FaEnvelope />, "Message")}
              {renderNavLink("/customer/analytics", <FaChartBar />, "Analytics")}
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
