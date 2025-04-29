import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For register form
  const [isRegistering, setIsRegistering] = useState(false); // To toggle between login and register forms
  const { login, register } = useAuth(); // Assuming you have a register function in your AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (!success) {
      alert("Login failed! Please check your credentials.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) {
      alert("Registration successful. Please log in.");
      setIsRegistering(false); // Switch back to login form
    } else {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? "Register" : "Login"}</h2>

      {/* Conditionally render login or register form */}
      {isRegistering ? (
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      )}

      {/* Toggle between Login and Register */}
      <p>
        {isRegistering ? (
          <>
            Already have an account?{" "}
            <span
              className="toggle-link"
              onClick={() => setIsRegistering(false)}
            >
              Login here
            </span>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <span
              className="toggle-link"
              onClick={() => setIsRegistering(true)}
            >
              Register here
            </span>
          </>
        )}
      </p>
    </div>
  );
};

export default LoginPage;
