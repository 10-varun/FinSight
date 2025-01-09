import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [company, setCompany] = useState('');
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!company) {
      setError('Please enter a company name');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/news', { company });
      setArticles(response.data.articles);
      setError('');
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news. Please try again.');
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Stock News Analyzer</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="Search for a company..."
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>
      </header>
      <main className="main-content">
        {error && <p className="error">{error}</p>}
        <section className="news-articles">
          <ul>
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <li key={index}>
                  <strong>{article.Headline}</strong>
                  <br />
                  <span>{article.Timestamp}</span>
                </li>
              ))
            ) : (
              <li>No articles found.</li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
