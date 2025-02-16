import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "./supabaseClient"; // Ensure this is correctly configured
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();

    // Ensure email and password fields are not empty
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      // Attempt to log in using Supabase's sign-in method
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Log response data and error for debugging
      console.log("Login Response:", data, error);

      // Handle login errors
      if (error) {
        console.error("Login Error:", error.message);
        alert("Error logging in: " + error.message);
        setLoading(false);
        return;
      }

      // Check if the user's email is confirmed
      if (!data.user.confirmed_at) {
        alert("Please confirm your email before logging in.");
        setLoading(false);
        return;
      }

      // Redirect to the main page after successful login
      console.log("Logged in successfully:", data);
      navigate("/"); // No alert for login success
    } catch (err) {
      console.error("Unexpected Error:", err); // Log full error for debugging

      // Enhanced error handling
      if (err instanceof Error) {
        alert(`An unexpected error occurred: ${err.message}\nStack Trace: ${err.stack || "No stack trace available."}`);
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Log In</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())} // Remove spaces
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p>or</p>
        <button className="auth-btn" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
        <p>
          Don't have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
