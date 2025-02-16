import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Home.css';

function Home({ company, setCompany, handleSearch }) {
  const [showSearch, setShowSearch] = useState(false);

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
            background: "white",
          }}
        >
          <div className="search-left" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h1>Find the Right Company</h1>
          </div>
          <div className="search-right" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h1>Search for a Company</h1>
            <input
              type="text"
              className="search-bar-nav"
              placeholder="Enter company name..."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <button className="try-btn" onClick={() => setShowSearch(false)}>
              ← Home
            </button>
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
