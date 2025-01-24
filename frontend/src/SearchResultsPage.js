import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchResultsPage.css';
import Summary from './components/Summary';
import Graphs from './components/Graphs';
import Charts from './components/Charts';

function SearchResultsPage({
  summary,
  overallScore,
  investmentAdvice,
  error,
  isLoading,
  companyName, // Pass companyName from parent
}) {
  const [activeSection, setActiveSection] = useState('summary');
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    if (activeSection === 'charts' && companyName) {
      const fetchStockData = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:5000/api/stock-data/${companyName}`);
          setStockData(response.data);
        } catch {
          setStockData({ error: 'Error fetching stock data.' });
        }
      };

      fetchStockData();
    }
  }, [activeSection, companyName]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'graphs':
        return <Graphs companyName={companyName} />; // Pass companyName here
      case 'charts':
        return <Charts stockData={stockData} />;
      default:
        return (
          <Summary
            summary={summary}
            overallScore={overallScore}
            investmentAdvice={investmentAdvice}
            error={error}
            isLoading={isLoading}
          />
        );
    }
  };

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
      <div className="results-section">{renderActiveSection()}</div>
    </main>
  );
}

export default SearchResultsPage;
