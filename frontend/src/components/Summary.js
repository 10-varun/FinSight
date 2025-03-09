import React, { useState, useEffect, useRef } from "react";
import "./Summary.css";

function Summary({ summary, overallScore, investmentAdvice, error, isLoading, company }) {
  const [fetchError, setFetchError] = useState(null);
  const [typedSummary, setTypedSummary] = useState("");
  const [typedAdvice, setTypedAdvice] = useState("");
  const [typedScore, setTypedScore] = useState("");

  const indexRefSummary = useRef(0);
  const indexRefAdvice = useRef(0);
  const indexRefScore = useRef(0);
  const lastScoreRef = useRef(null); 

  const isTypingRefSummary = useRef(false);
  const isTypingRefAdvice = useRef(false);
  const isTypingRefScore = useRef(false);

  // 🔹 Reset values when the company changes
  useEffect(() => {
    setTypedSummary("");
    setTypedAdvice("");
    setTypedScore("");
    lastScoreRef.current = null;
  }, [company]);

  useEffect(() => {
    if (summary && summary !== typedSummary) {
      setFetchError(null);
      typeSummary(summary);
    }
  }, [summary]);

  useEffect(() => {
    if (investmentAdvice && investmentAdvice !== typedAdvice) {
      typeAdvice(investmentAdvice);
    }
  }, [investmentAdvice]);

  useEffect(() => {
    if (
      overallScore !== undefined &&
      overallScore !== null &&
      overallScore !== lastScoreRef.current
    ) {
      lastScoreRef.current = overallScore;
      typeScore(`${overallScore}/10`);
    } else if (typedScore === "") {
      setTypedScore(`${lastScoreRef.current || 0}/10`);
    }
  }, [overallScore]);

  const typeSummary = (content) => {
    if (isTypingRefSummary.current) return;
    isTypingRefSummary.current = true;
    indexRefSummary.current = 0;
    setTypedSummary("");

    const interval = setInterval(() => {
      const nextChar = content.charAt(indexRefSummary.current);
      setTypedSummary((prev) => prev + nextChar);
      indexRefSummary.current++;
      if (indexRefSummary.current >= content.length) {
        clearInterval(interval);
        isTypingRefSummary.current = false;
      }
    }, 5);
  };

  const typeAdvice = (content) => {
    if (isTypingRefAdvice.current) return;
    isTypingRefAdvice.current = true;
    indexRefAdvice.current = 0;
    setTypedAdvice("");

    const interval = setInterval(() => {
      const nextChar = content.charAt(indexRefAdvice.current);
      setTypedAdvice((prev) => prev + nextChar);
      indexRefAdvice.current++;
      if (indexRefAdvice.current >= content.length) {
        clearInterval(interval);
        isTypingRefAdvice.current = false;
      }
    }, 5);
  };

  const typeScore = (content) => {
    if (isTypingRefScore.current) return;
    isTypingRefScore.current = true;
    indexRefScore.current = 0;
    setTypedScore("");

    const interval = setInterval(() => {
      const nextChar = content.charAt(indexRefScore.current);
      setTypedScore((prev) => prev + nextChar);
      indexRefScore.current++;
      if (indexRefScore.current >= content.length) {
        clearInterval(interval);
        isTypingRefScore.current = false;
      }
    }, 5);
  };

  const getCircleColor = (score) => {
    if (score >= 7) {
      return "#4CAF50";
    } else if (score >= 4) {
      return "#FFEB3B";
    } else {
      return "#F44336";
    }
  };

  return (
    <section className="summary-container">
      {isLoading ? (
        <div className="loading-indicator"> 
          <svg viewBox="0 0 240 240" height="240" width="240" className="pl">
            <circle strokeLinecap="round" strokeDashoffset="-330" strokeDasharray="0 660" strokeWidth="20" stroke="#000" fill="none" r="105" cy="120" cx="120" className="pl__ring pl__ring--a"></circle>
            <circle strokeLinecap="round" strokeDashoffset="-110" strokeDasharray="0 220" strokeWidth="20" stroke="#000" fill="none" r="35" cy="120" cx="120" className="pl__ring pl__ring--b"></circle>
            <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="85" className="pl__ring pl__ring--c"></circle>
            <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="155" className="pl__ring pl__ring--d"></circle>
          </svg>
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : fetchError ? (
        <p className="error">{fetchError}</p>
      ) : (summary && investmentAdvice && overallScore !== undefined) ? (
        <div className="content-wrapper">
          <div className="text-content">
            <div className="news-summary">
              <h3>Summary of Articles</h3>
              <p>{typedSummary || "No summary available."}</p>
            </div>
            <div className="investment-advice">
              <h3>Investment Advice</h3>
              <p>{typedAdvice || "No advice available."}</p>
            </div>
          </div>

          <div className="sentiment-score">
            <h3>Overall Sentiment Score</h3>
            <div className="circle-container">
              <svg className="progress-circle" viewBox="0 0 36 36">
                <path
                  className="circle-bg"
                  d="M18 4
                    a 12 12 0 0 1 0 24
                    a 12 12 0 0 1 0 -24"
                  fill="none"
                />
                <path
                  className="circle"
                  strokeDasharray={`${(overallScore || 0) * 10}, 100`}
                  stroke={getCircleColor(overallScore)}
                  fill="none"
                  d="M18 4
                    a 12 12 0 0 1 0 24
                    a 12 12 0 0 1 0 -24"
                />
              </svg>
              <p className="score-text">{typedScore}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="error">Waiting for data...</p>
      )}
    </section>
  );
}

export default Summary;
