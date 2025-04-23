import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Outlet /> {/* ✅ This renders the nested content */}
      </div>
    </div>
  );
};

export default DashboardLayout;
