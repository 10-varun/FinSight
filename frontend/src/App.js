import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import SearchResultsPage from './SearchResultsPage';
import axios from 'axios';

function App() {
  const [company, setCompany] = useState('');
  const [summary, setSummary] = useState('');  
  const [overallScore, setOverallScore] = useState(null); 
  const [investmentAdvice, setInvestmentAdvice] = useState('');
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
    setShowResults(false); 

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/news', { company });
    
      if (response.data) {
        setSummary(response.data.summary || '');
        setOverallScore(response.data.overall_score || null);
        setInvestmentAdvice(response.data.investment_advice || '');
        setShowResults(true); 
      } else {
        setError('No data found for this company');
      }
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
              />
            }
          />
          <Route
            path="/search-results"
            element={
              <SearchResultsPage 
                summary={summary}
                overallScore={overallScore}
                investmentAdvice={investmentAdvice}
                error={error}
                isLoading={isLoading}
                companyName={company} 
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
