import React, { useState, useEffect, useRef } from 'react';
import './Summary.css';

function Summary({ summary, overallScore, investmentAdvice, error, isLoading }) {
  const [fetchError, setFetchError] = useState(null); // Track fetch errors
  const [typedSummary, setTypedSummary] = useState('');
  const [typedScore, setTypedScore] = useState(''); // Set initial state as empty
  const [typedAdvice, setTypedAdvice] = useState(''); // Set initial state as empty

  const indexRefSummary = useRef(0); // Ref for summary typing
  const indexRefScore = useRef(0); // Ref for score typing
  const indexRefAdvice = useRef(0); // Ref for advice typing

  const isTypingRefSummary = useRef(false); // Ref to track if summary is being typed
  const isTypingRefScore = useRef(false); // Ref to track if score is being typed
  const isTypingRefAdvice = useRef(false); // Ref to track if advice is being typed

  useEffect(() => {
    if (!summary) {
      setFetchError('No summary available.');
    } else {
      setFetchError(null); // Reset error if summary is available
      typeSummary(summary); // Start typing the summary
    }
  }, [summary]);

  useEffect(() => {
    if (overallScore !== undefined && !typedScore) {
      setTypedScore(''); // Ensure the score starts empty
      typeScore(`Overall Sentiment Score: ${overallScore}`); // Start typing the sentiment score after summary
    }
  }, [overallScore]);

  useEffect(() => {
    if (investmentAdvice && !typedAdvice) {
      setTypedAdvice(''); // Ensure the advice starts empty
      typeAdvice(investmentAdvice); // Start typing the investment advice after score
    }
  }, [investmentAdvice]);

  // Typing animation function for Summary
  const typeSummary = (content) => {
    if (isTypingRefSummary.current) return; // Prevent new typing until previous one finishes
    isTypingRefSummary.current = true;
    indexRefSummary.current = 0;
    setTypedSummary('');

    const interval = setInterval(() => {
      const nextChar = content.charAt(indexRefSummary.current);
      setTypedSummary((prev) => prev + nextChar);
      indexRefSummary.current++;

      if (indexRefSummary.current >= content.length) {
        clearInterval(interval);
        isTypingRefSummary.current = false;
        if (overallScore !== undefined) {
          typeScore(`Overall Sentiment Score: ${overallScore}`); // Start typing the sentiment score once summary is done
        }
      }
    }, 5); // Typing speed for summary
  };

  // Typing animation function for Sentiment Score
  const typeScore = (content) => {
    if (isTypingRefScore.current) return;
    isTypingRefScore.current = true;
    indexRefScore.current = 0;
    setTypedScore(''); // Ensure score starts as empty

    const interval = setInterval(() => {
      const nextChar = content.charAt(indexRefScore.current);
      setTypedScore((prev) => prev + nextChar);
      indexRefScore.current++;

      if (indexRefScore.current >= content.length) {
        clearInterval(interval);
        isTypingRefScore.current = false;
        typeAdvice(investmentAdvice); // Start typing the investment advice once score is done
      }
    }, 5); // Typing speed for score
  };

  // Typing animation function for Investment Advice
  const typeAdvice = (content) => {
    if (isTypingRefAdvice.current) return;
    isTypingRefAdvice.current = true;
    indexRefAdvice.current = 0;
    setTypedAdvice(''); // Ensure advice starts as empty

    const interval = setInterval(() => {
      const nextChar = content.charAt(indexRefAdvice.current);
      setTypedAdvice((prev) => prev + nextChar);
      indexRefAdvice.current++;

      if (indexRefAdvice.current >= content.length) {
        clearInterval(interval);
        isTypingRefAdvice.current = false;
      }
    }, 5); // Typing speed for advice
  };

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
          {/* Display Summary with typing animation */}
          {typedSummary ? (
            <div className="news-summary">
              <h3>Summary of Articles:</h3>
              <p>{typedSummary}</p>
            </div>
          ) : (
            <p>No summary available.</p>
          )}

          {/* Display Sentiment Score after Summary */}
          {typedScore && !isTypingRefSummary.current ? (
            <div className="overall-score">
              <h3>{typedScore}</h3>
            </div>
          ) : null}

          {/* Display Investment Advice after Sentiment Score */}
          {typedAdvice && !isTypingRefScore.current ? (
            <div className="investment-advice">
              <h3>Investment Advice:</h3>
              <p>{typedAdvice}</p>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

export default Summary;
