import React, { useState } from 'react';
import './App.css';
import MainPage from './MainPage';
import SearchResultsPage from './SearchResultsPage';
import axios from 'axios'

function App() {
  const [company, setCompany] = useState('');
  const [articles, setArticles] = useState([]);
  const [netCashFlow, setNetCashFlow] = useState('');
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!company) {
      setError('Please enter a company name');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/news', { company });
      setArticles(response.data.articles);
      setNetCashFlow(response.data.net_cash_flow);
      setShowResults(true);
      setError('');
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news. Please try again.');
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Stock News Analyzer</h1>
        <div className='search-section'>
        <input
          type="text"
          className="search-bar"
          placeholder="Search for a company..."
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>
        </div>
      </header>
      {showResults ? (
        <SearchResultsPage
          articles={articles}
          netCashFlow={netCashFlow}
          error={error}
        />
      ) : (
        <MainPage />
      )}
    </div>
  );
}

export default App;