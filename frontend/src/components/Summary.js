import React, { useState, useEffect } from 'react';
import './Summary.css';

function Summary({ summary, overallScore, investmentAdvice, error, isLoading }) {
  const [fetchError, setFetchError] = useState(null); // Track fetch errors

  useEffect(() => {
    if (!summary) {
      setFetchError('No summary available.');
    }
  }, [summary]);

  return (
    <section className="summary">
      {isLoading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading company data...</p>
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : fetchError ? (
        <p className="error">{fetchError}</p>
      ) : (
        <>
          {/* Display Summary */}
          {summary ? (
            <div className="news-summary">
              <h3>Summary of Articles:</h3>
              <p>{summary}</p>
            </div>
          ) : (
            <p>No summary available.</p>
          )}

          {/* Display Sentiment Score */}
          {overallScore !== undefined ? (
            <div className="overall-score">
              <h3>Overall Sentiment Score: {overallScore}</h3>
            </div>
          ) : (
            <p>No sentiment score available.</p>
          )}

          {/* Display Investment Advice */}
          {investmentAdvice ? (
            <div className="investment-advice">
              <h3>Investment Advice:</h3>
              <p>{investmentAdvice}</p>
            </div>
          ) : (
            <p>No investment advice available.</p>
          )}
        </>
      )}
    </section>
  );
}

export default Summary;
