import React from 'react';
import './Summary.css';

function Summary({ articles, netCashFlow, error }) {
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
        <h3>Latest News Articles:</h3>
        <ul>
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <li key={index} className="article-item">
                <strong>{article.Headline}</strong>
              </li>
            ))
          ) : (
            <li>No articles found.</li>
          )}
        </ul>
      </div>
    </section>
  );
}

export default Summary;