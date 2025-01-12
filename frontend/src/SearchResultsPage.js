import React, { useState } from 'react';
import './SearchResultsPage.css';
import Summary from './components/Summary';
import Graphs from './components/Graphs';
import Charts from './components/Charts';

function SearchResultsPage({ articleScores, averageScore, netCashFlow, error, isLoading }) {
  const [activeSection, setActiveSection] = useState('summary');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'graphs':
        return <Graphs />;
      case 'charts':
        return <Charts />;
      case 'summary':
      default:
        return (
          <Summary
            articleScores={articleScores}   
            averageScore={averageScore}     
            netCashFlow={netCashFlow}
            error={error}
          />
        );
    }
  };

  return (
    <main className="search-results-page">
      <nav className="results-nav">
        <button
          onClick={() => setActiveSection('summary')}
          className={activeSection === 'summary' ? 'active' : ''}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveSection('graphs')}
          className={activeSection === 'graphs' ? 'active' : ''}
        >
          Graphs
        </button>
        <button
          onClick={() => setActiveSection('charts')}
          className={activeSection === 'charts' ? 'active' : ''}
        >
          Charts
        </button>
      </nav>
      <div className="results-section">
        {isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : articleScores.length > 0 || netCashFlow ? (
          renderActiveSection()
        ) : (
          <p>No data available</p>
        )}
      </div>
    </main>
  );
}

export default SearchResultsPage;
