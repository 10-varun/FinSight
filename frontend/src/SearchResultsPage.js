import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchResultsPage.css';
import Summary from './components/Summary';  // Import the Summary component
import Graphs from './components/Graphs';
import Charts from './components/Charts';

function SearchResultsPage({ 
  summary, 
  overallScore, 
  investmentAdvice, 
  error, 
  isLoading, 
  companyName
}) {
  const [activeSection, setActiveSection] = useState('summary');
  const [stockData, setStockData] = useState(null);  // State to store stock data

  const company = companyName || '';  // Retrieve company name from route state

  useEffect(() => {
    if (activeSection === 'charts' && company) {
      // Fetch stock data when 'charts' section is active
      const fetchStockData = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:5000/api/stock-data/${company}`);
          if (response.data.error) {
            setStockData({ error: response.data.error });
          } else {
            setStockData(response.data); // Set the stock data to state
          }
        } catch (err) {
          setStockData({ error: "Error fetching stock data." });
        }
      };

      fetchStockData();  // Trigger the fetch
    }
  }, [activeSection, company]);  // Re-fetch when section changes or company name updates

  // Dynamically render the active section based on the navigation state
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'graphs':
        return <Graphs />;
      case 'charts':
        return <Charts stockData={stockData} />;  // Pass stock data to the Charts component
      case 'summary':
      default:
        return <Summary 
          summary={summary}
          overallScore={overallScore}
          investmentAdvice={investmentAdvice}
          error={error}
          isLoading={isLoading}
        />;
    }
  };

  // Dynamic section buttons
  const sections = ['summary', 'graphs', 'charts'];

  return (
    <main className="search-results-page">
      <nav className="results-nav">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={activeSection === section ? 'active' : ''}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </nav>

      <div className="results-section">
        {renderActiveSection()} 
      </div>
    </main>
  );
}

export default SearchResultsPage;
