import React from 'react';
import './Summary.css';

function Summary({ articleScores, netCashFlow, error }) {
  return (
    <section className="summary">
      {error && <p className="error">{error}</p>}
      {netCashFlow && (
        <div className="net-cash-flow">
          <h3>Net Cash Flow:</h3>
          <p>{netCashFlow}</p>
        </div>
      )}
      <div className="news-summary">
        <h3>Article Sentiment Scores:</h3>
        {articleScores.length > 0 ? (
          <ul>
            {articleScores.map((score, index) => (
              <li key={index} className="article-item">
                <strong>{score.headline}</strong>
                <p>Sentiment Score: {score.normalized_score}</p>
                <p>Original Score: {score.original_score}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No articles found.</p>
        )}
      </div>
      <div className="average-score">
        {/* <h3>Average Sentiment Score: {averageScore}</h3> */}
      </div>
    </section>
  );
}

export default Summary;
