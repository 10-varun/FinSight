import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Home.css';
import supabase from "../supabaseClient";

function Home({ company, setCompany, handleSearch }) {
  const [showSearch, setShowSearch] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userEmail, setUserEmail] = useState(""); // ✨ Add userEmail state
  const inputRef = useRef(null);
  
  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserEmail(data.user.email);
        sendEmailToBackend(data.user.email); // Send email to backend
      }
      if (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, []);

  const sendEmailToBackend = async (email) => {
    try {
      const response = await fetch("http://localhost:5000/store-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Error sending email to backend:", error);
    }
  };
  // Sample company data - replace with your actual data source
  const companyList = [
  "Reliance Industries Ltd",
  "Tata Consultancy Services Ltd",
  "HDFC Bank Ltd",
  "Infosys Ltd",
  "Hindustan Unilever Ltd",
  "ICICI Bank Ltd",
  "Bharti Airtel Ltd",
  "State Bank of India",
  "Kotak Mahindra Bank Ltd",
  "Bajaj Finance Ltd",
  "Axis Bank Ltd",
  "ITC Ltd",
  "Larsen & Toubro Ltd",
  "HCL Technologies Ltd",
  "Asian Paints Ltd",
  "Maruti Suzuki India Ltd",
  "Titan Company Ltd",
  "Bajaj Finserv Ltd",
  "Wipro Ltd",
  "UltraTech Cement Ltd",
  "Sun Pharmaceutical Industries Ltd",
  "Nestle India Ltd",
  "Power Grid Corporation of India Ltd",
  "Tech Mahindra Ltd",
  "Mahindra & Mahindra Ltd",
  "Tata Steel Ltd",
  "JSW Steel Ltd",
  "NTPC Ltd",
  "Tata Motors Ltd",
  "IndusInd Bank Ltd",
  "HDFC Life Insurance Company Ltd",
  "Adani Ports and Special Economic Zone Ltd",
  "Shree Cement Ltd",
  "Bajaj Auto Ltd",
  "Hindalco Industries Ltd",
  "Oil & Natural Gas Corporation Ltd",
  "Bharat Petroleum Corporation Ltd",
  "Grasim Industries Ltd",
  "SBI Life Insurance Company Ltd",
  "Britannia Industries Ltd",
  "Godrej Consumer Products Ltd",
  "Dr. Reddy's Laboratories Ltd",
  "Indian Oil Corporation Ltd",
  "Hero MotoCorp Ltd",
  "Adani Enterprises Ltd",
  "Cipla Ltd",
  "Divi's Laboratories Ltd",
  "Eicher Motors Ltd",
  "Dabur India Ltd",
  "Coal India Ltd",
  "GAIL (India) Ltd",
  "Adani Green Energy Ltd",
  "Siemens Ltd",
  "Lupin Ltd",
  "Vedanta Ltd",
  "Tata Power Company Ltd",
  "Bajaj Holdings & Investment Ltd",
  "Havells India Ltd",
  "Berger Paints India Ltd",
  "Ambuja Cements Ltd",
  "Marico Ltd",
  "Pidilite Industries Ltd",
  "Tata Consumer Products Ltd",
  "Biocon Ltd",
  "Aurobindo Pharma Ltd",
  "Adani Transmission Ltd",
  "DLF Ltd",
  "Yes Bank Ltd",
  "Torrent Pharmaceuticals Ltd",
  "Bosch Ltd",
  "Jubilant Foodworks Ltd",
  "InterGlobe Aviation Ltd",
  "Balkrishna Industries Ltd",
  "Motherson Sumi Systems Ltd",
  "Muthoot Finance Ltd",
  "Bandhan Bank Ltd",
  "Hindustan Aeronautics Ltd",
  "Gland Pharma Ltd",
  "United Spirits Ltd",
  "Bharat Electronics Ltd",
  "Colgate-Palmolive (India) Ltd",
  "Jindal Steel & Power Ltd",
  "MRF Ltd",
  "Cadila Healthcare Ltd",
  "SBI Cards and Payment Services Ltd",
  "Punjab National Bank",
  "Bharat Forge Ltd",
  "Trent Ltd",
  "NMDC Ltd",
  "Aditya Birla Capital Ltd",
  "LIC Housing Finance Ltd",
  "Abbott India Ltd",
  "Page Industries Ltd",
  "ICICI Prudential Life Insurance Company Ltd",
  "Voltas Ltd",
  "HDFC Asset Management Company Ltd",
  "Alkem Laboratories Ltd",
  "Info Edge (India) Ltd",
  "Cholamandalam Investment and Finance Company Ltd",
  "ICICI Lombard General Insurance Company Ltd",
  "Petronet LNG Ltd",
  "Zee Entertainment Enterprises Ltd"
];

  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setCompany(value);
    
    if (value.length > 0) {
      const filteredSuggestions = companyList.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    setCompany(suggestion);
    setShowSuggestions(false);
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {showSearch ? (
      <motion.div
      key="search"
      className="search-fullscreen"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        background: "linear-gradient(to right, #f8f9fa, #ffffff)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        overflow: "hidden"
      }}
    >
      <div 
        className="search-left" 
        style={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)",
          padding: "2rem",
          position: "relative"
        }}
      >
        <div className="search-left-content" style={{ maxWidth: "80%" }}>
          <h1 style={{ 
            fontSize: "3rem", 
            fontWeight: "700", 
            color: "#2d3748", 
            marginBottom: "2rem",
            lineHeight: "1.2"
          }}>
            FinSight
          </h1>
          <p style={{
            fontSize: "1.2rem",
            color: "#4a5568",
            lineHeight: "1.6",
            marginBottom: "2rem"
          }}>
           Discover the perfect company to invest in with ease. Explore a curated selection of top-performing companies, analyze key insights, and make informed investment decisions—all in one place.
          </p>
          <div className="search-decoration" style={{
            position: "absolute",
            bottom: "2rem",
            left: "2rem",
            width: "80%",
            height: "1px",
            background: "linear-gradient(to right, #cbd5e0, transparent)"
          }}></div>
        </div>
      </div>
      
      <div className="search-right" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "2rem", position: "relative" }}>
        <div className="search-container" style={{ width: "80%", maxWidth: "400px" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "500", color: "#444", marginBottom: "1.5rem", textAlign: "center" }}><b>Search</b></h2>
          
          <div className="input-group" style={{ position: "relative", marginBottom: "1.5rem" }} ref={inputRef}>
            <input
              type="text"
              className="search-bar-nav"
              placeholder="Company name..."
              value={company}
              onChange={handleInputChange}
              onFocus={() => company.length > 0 && setShowSuggestions(true)}
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                fontSize: "1rem",
                borderRadius: "0.5rem",
                border: "1px solid #ddd",
                outline: "none",
                transition: "border 0.3s ease",
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown" style={{
                position: "absolute",
                top: "calc(100% + 5px)",
                left: 0,
                width: "100%",
                maxHeight: "200px",
                overflowY: "auto",
                background: "white",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                zIndex: 10,
                border: "1px solid #eee",
              }}>
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{
                      padding: "0.75rem 1rem",
                      cursor: "pointer",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f9f9f9"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="button-group" style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button 
              onClick={handleSearch}
              style={{
                padding: "0.7rem 2rem",
                backgroundColor: "#333",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              Search
            </button>
            
            <button 
              className="try-btn" 
              onClick={() => setShowSearch(false)}
              style={{
                padding: "0.7rem 2rem",
                backgroundColor: "transparent",
                color: "#444",
                border: "1px solid #ddd",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </motion.div>
      ) : (
        <motion.div
          key="home"
          className="home-container"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
          }}
        >
          <div className="home-div-left" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="top-content">
              <h1>Make informed financial</h1>
              <h1>decisions with</h1>
              <h1>FinSight</h1>
              <h3>
                powered by <span className="ai-box">AI</span>
              </h3>
              <button className="back-btn" onClick={() => setShowSearch(true)}>
                Try FinSight →
              </button>
            </div>
          </div>
          <div className="home-div-right">
            <div className="home-div-right-up"></div>
            <div className="home-div-right-down"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Home;















