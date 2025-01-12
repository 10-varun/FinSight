import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import MainPage from './MainPage';
import SearchResultsPage from './SearchResultsPage';
import axios from 'axios';

function App() {
  const [company, setCompany] = useState('');
  const [articleScores, setArticleScores] = useState([]);  
  const [averageScore, setAverageScore] = useState(null);  
  const [netCashFlow, setNetCashFlow] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!company) {
      setError('Please enter a company name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/news', { company });
      setArticleScores(response.data.article_scores);
      setAverageScore(response.data.average_score);
      setNetCashFlow(response.data.net_cash_flow);
      setShowResults(true);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setIsLoading(false);
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
                error={error}
                isLoading={isLoading}
              />
            }
          />
          <Route
            path="/search-results"
            element={
              <SearchResultsPage
                articleScores={articleScores}  
                averageScore={averageScore}    
                netCashFlow={netCashFlow}
                error={error}
                isLoading={isLoading}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
