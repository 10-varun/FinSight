import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import MainPage from './MainPage';
import SearchResultsPage from './SearchResultsPage';
import axios from 'axios';

function App() {
  const [company, setCompany] = useState('');
  const [articles, setArticles] = useState([]);
  const [netCashFlow, setNetCashFlow] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!company) {
      setError('Please enter a company name');
      return;
    }

    setIsLoading(true); // Set loading state to true when fetching data
    setError(''); // Reset previous errors

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/news', { company });
      setArticles(response.data.articles);
      setNetCashFlow(response.data.net_cash_flow);
      setShowResults(true);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news. Please try again.');
    } finally {
      setIsLoading(false); // Set loading state to false when data is fetched
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <MainPage
                company={company}
                setCompany={setCompany}
                handleSearch={handleSearch}
                showResults={showResults}
                articles={articles}
                netCashFlow={netCashFlow}
                error={error}
                isLoading={isLoading} // Pass loading state to MainPage
              />
            }
          />
          <Route
            path="/search-results"
            element={
              <SearchResultsPage
                articles={articles}
                netCashFlow={netCashFlow}
                error={error}
                isLoading={isLoading} // Pass loading state to SearchResultsPage
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
