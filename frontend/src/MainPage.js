import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import AboutProduct from "./components/AboutProduct";
import Home from "./components/Home";
import supabase from "./supabaseClient";

function MainPage({ company, setCompany, handleSearch }) {
  const [activeSection, setActiveSection] = useState("home");
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSession() {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setUser(data.session.user);
      }
    }

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session ? session.user : null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSearchAndNavigate = () => {
    handleSearch();
    navigate("/search-results", { state: { companyName: company } });
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "home":
        return <Home company={company} setCompany={setCompany} handleSearch={handleSearchAndNavigate} />;
      case "about-us":
        return <AboutUs />;
      case "contact-us":
        return <ContactUs />;
      case "about-product":
        return <AboutProduct />;
      default:
        return null;
    }
  };

  return (
    <main className="main-page">
      <nav className="main-nav">
        <div className="logodiv"></div>
        <div className="nav-container">
          <div className="nav-links">
            <button onClick={() => setActiveSection("home")} className={activeSection === "home" ? "active" : ""}>
              Home
            </button>
            <button onClick={() => setActiveSection("about-product")} className={activeSection === "about-product" ? "active" : ""}>
              Product
            </button>
            <button onClick={() => setActiveSection("about-us")} className={activeSection === "about-us" ? "active" : ""}>
              About Us
            </button>
            <button onClick={() => setActiveSection("contact-us")} className={activeSection === "contact-us" ? "active" : ""}>
              Contact Us
            </button>
          </div>
          <div className="auth-buttons" style={{ marginLeft: "auto" }}>
            {!user ? (
              <div className="auth-group">
                <button onClick={() => { setActiveSection("login"); navigate("/login"); }} className={activeSection === "login" ? "active" : ""}>
                  Login
                </button>
                <button onClick={() => { setActiveSection("signup"); navigate("/signup"); }} className={activeSection === "signup" ? "active" : ""}>
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="user-dropdown">
                <button className="user-button" onClick={() => setShowDropdown(!showDropdown)}>
                  {user.email[0].toUpperCase()}
                </button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <button onClick={async () => await supabase.auth.signOut()}>Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="active-section">{renderActiveSection()}</div>
    </main>
  );
}

export default MainPage;
