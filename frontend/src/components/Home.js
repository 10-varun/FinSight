import React from 'react';
import './Home.css';

function Home({ company, setCompany }) {
  return (
    <div className="home-container">
      <div className="home-div-left">
        <div className="top-content">
          <h1>Make informed financial</h1>
          <h1>decisions with</h1>
          <h1>FinSight</h1>
          <h3>
            powered by <span className="ai-box">AI</span>
          </h3>
          <div className="stats-container">
            <div className="stats-box">
              <div className="large-number">1</div>
              <div className="small-text">% Error</div>
            </div>
            <div className="stats-box">
              <div className="large-number">30</div>
              <div className="small-text">Day Estimates</div>
            </div>
          </div>
        </div>
      </div>
      <div className="home-div-right">
        <div className="home-div-right-up">
          {/* image rightupper */}
        </div>
        <div className="home-div-right-down">
          {/* image rightlower */}
        </div>
      </div>
    </div>
  );
}

export default Home;