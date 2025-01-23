import React, { useState } from 'react';
import './Graphs.css';
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Graph = () => {
  const [ticker, setTicker] = useState('');
  const [graphData, setGraphData] = useState(null);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    setError('');
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker: ticker.toUpperCase() }), // Use ticker directly
      });

      const data = await response.json();

      if (response.ok) {
        setGraphData({
          predicted_dates: data.predicted_dates,
          predicted_prices: data.predicted_prices,
          past_dates: data.past_dates,
          past_prices: data.past_prices,
        });
      } else {
        setError(data.error || 'Error fetching ticker symbol.');
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    }
  };

  return (
    <div className="graph-container">
      <h2>Graphs</h2>
      <input
        type="text"
        placeholder="Enter Stock Ticker"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
      />
      <button onClick={handlePredict}>Predict</button>
      {error && <div className="error">{error}</div>}
      {graphData && (
        <div>
          {/* Predicted Stock Prices Graph */}
          <div className="graph-wrapper">
            <h3>Predicted Stock Prices (Next 30 Days)</h3>
            <Line
              data={{
                labels: graphData.predicted_dates,
                datasets: [
                  {
                    label: 'Predicted Prices',
                    data: graphData.predicted_prices,
                    borderColor: 'rgba(75,192,192,1)',
                    fill: false,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: 'top' },
                },
                scales: {
                  x: {
                    ticks: {
                      callback: function (value) {
                        const date = new Date(this.getLabelForValue(value));
                        const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits
                        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
                        const year = date.getFullYear();
                        return `${day}/${month}/${year}`; // Format as DD/MM/YYYY
                      },
                    },
                    title: { display: true, text: 'Date' },
                  },
                  y: {
                    ticks: { callback: (value) => value },
                    title: { display: true, text: 'Price' },
                  },
                },
              }}
            />
          </div>

          {/* Past Stock Prices Graph */}
          <div className="graph-wrapper">
            <h3>Past Stock Prices</h3>
            <Line
              data={{
                labels: graphData.past_dates,
                datasets: [
                  {
                    label: 'Past Prices',
                    data: graphData.past_prices,
                    borderColor: 'rgba(255,99,132,1)',
                    fill: false,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: 'top' },
                },
                scales: {
                  x: {
                    ticks: {
                      callback: function (value) {
                        const date = new Date(this.getLabelForValue(value));
                        return date.toLocaleDateString();
                      },
                    },
                    title: { display: true, text: 'Date' },
                  },
                  y: {
                    ticks: { callback: (value) => value },
                    title: { display: true, text: 'Price' },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Graph;
