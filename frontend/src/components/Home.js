import React from 'react';
import './Home.css';

function Home({ company, setCompany, handleSearch }) {
  return (
    <div className="home-container">
      <div className="search-section">
      <div className='search-title'>
          <h1>Finsight!</h1>
        </div>
        <div className='search-elements'>
          <input
            type="text"
            className="search-bar"
            placeholder="Search for a company..."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className='search-content'>
          <h3>Get real-time stock insights, top financial news, and market trends. Analyze data to make informed investment decisions.</h3>
        </div>
      </div>
    </div>
  );
}

export default Home;
