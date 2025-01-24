import React from 'react';
import './AboutProduct.css';

function AboutProduct() {
  return (
    <div className="product-container">
      <div className="product-div-left">
        <div className="product-top-content">
          <h1>About FinSight</h1>
          <p>
            FinSight is a revolutionary platform designed to empower investors with data-driven insights, real-time stock updates, and advanced analytics.
            Our goal is to provide investors with comprehensive tools to make well-informed decisions in the ever-evolving financial markets.
          </p>
        </div>
        <div className="product-bottom-content">
             {/* Image for product-left-down div */}
        </div>
      </div>
      <div className="product-div-right">
        <div className="product-div-right-up">
          <h2>Advanced Analytics for Smarter Decisions</h2>
          <p>
            FinSight offers an advanced suite of tools for market analysis, including sentiment analysis, predictive modeling, and real-time data updates. 
            It enables users to understand stock trends and forecast potential market movements with a high degree of accuracy.
          </p>
        </div>
        <div className="product-div-right-down">
          <h2>Key Features</h2>
          <ul>
            <li>Real-time stock updates from NSE and global markets.</li>
            <li>Sentiment analysis based on live news articles for market prediction.</li>
            <li>Comprehensive stock screening tools with multiple filters.</li>
            <li>Customizable charts and graphs for visual analysis of trends.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AboutProduct;
