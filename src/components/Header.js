import React from "react";
import { useAuth } from "../context/AuthContext"; // ✅ Correct import

const Header = () => {
  const { user, logout } = useAuth(); // ✅ Correct usage

  return (
    <header>
      <h1>Welcome, {user ? user.name : "Guest"}!</h1>
      {user && <button onClick={logout}>Logout</button>}
    </header>
  );
};

export default Header;
