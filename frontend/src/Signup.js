import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "./supabaseClient";
import "./Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle Email/Password Signup
  const handleSignup = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }, // Save user name in metadata
      },
    });

    if (error) {
      alert("Error signing up: " + error.message);
      return;
    }

    console.log("Signed up:", data);
    alert("Sign-up successful! Check your email to verify your account.");

    // Redirect to login page after successful signup
    navigate("/login");
  };

  // Handle Google Signup (OAuth)
  const handleGoogleSignup = async () => {
    const { user, session, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/", // Redirect to login page after Google authentication
      },
    });

    if (error) {
      alert("Error signing up with Google: " + error.message);
      return;
    }

    if (user) {
      console.log("Google login successful, user data:", user);
      alert("Successfully signed up with Google! You are being redirected to the login page.");
      
      // After Google login/signup, navigate to the login page
      navigate("/login");
    }

    // If session exists, it means the user is logged in, and we can redirect to the home page
    if (session) {
      console.log("User session exists:", session);
      navigate("/");  // Navigate to home/dashboard or wherever you want
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
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
          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>
        <p>or</p>
        <button className="signup-btn google-btn" onClick={handleGoogleSignup}>
          Sign Up with Google
        </button>
        <p>
          Already have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/MainPage")}>
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
