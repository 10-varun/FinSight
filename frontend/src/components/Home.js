import React from 'react';
import './Home.css';

function Home({ company, setCompany, handleSearch }) {
  return (
    <div className="home-container">
      <div className="home-div-left">
        <div className="top-content">
          <h1>Make informed financial</h1>
          <h1>decisions with</h1>
          <h1>FinSight</h1>
          <h3>
            powered by <span className="ai-box">AI</span>
          </h3>
          <div className="search-container">
            <input
              type="text"
              className="search-bar-nav"
              placeholder="Search for a company..."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <div className="stats-container">
            <div className="stats-box">
              <div className="large-number">1</div>
              <div className="small-text">% Error</div>
            </div>
            <div className="stats-box">
              <div className="large-number">30</div>
              <div className="small-text">Day Estimates</div>
            </div>
          </div>
        </div>
      </div>
      <div className="home-div-right">
        <div className="home-div-right-up"></div>
        <div className="home-div-right-down"></div>
      </div>
    </div>
  );
}

export default Home;