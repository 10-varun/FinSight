import React, { useState } from 'react';
import './SearchResultsPage.css';
import Summary from './components/Summary';  // Import the Summary component
import Graphs from './components/Graphs';
import Charts from './components/Charts';

function SearchResultsPage({ summary, overallScore, investmentAdvice, error, isLoading }) {
  const [activeSection, setActiveSection] = useState('summary');
  
  // Dynamically render the active section based on the navigation state
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'graphs':
        return <Graphs />;
      case 'charts':
        return <Charts />;
      case 'summary':
      default:
        return <Summary 
          summary={summary}        // Pass the summary data to the Summary component
          overallScore={overallScore}  // Pass the sentiment score to the Summary component
          investmentAdvice={investmentAdvice}  // Pass the investment advice to the Summary component
          error={error}
          isLoading={isLoading}
        />;
    }
  };

  // Dynamic section buttons (helpful for scalability)
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
        {renderActiveSection()} {/* Render the active section */}
      </div>
    </main>
  );
}

export default SearchResultsPage;
