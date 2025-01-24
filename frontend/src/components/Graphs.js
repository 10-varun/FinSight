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
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Graph = ({ companyName }) => {
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
        body: JSON.stringify({ ticker: companyName.toUpperCase() }), // Use companyName prop here
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
    } catch {
      setError('Failed to fetch data. Please try again.');
    }
  };

  return (
    <div className="graph-container">
      <h2>Stock Predictions for {companyName}</h2>
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
                plugins: { legend: { display: true, position: 'top' } },
                scales: {
                  x: {
                    title: { display: true, text: 'Date' },
                    ticks: {
                      callback: (value, index) => {
                        const date = new Date(graphData.predicted_dates[index]);
                        return date.toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                        }); // Format: "25 Jan"
                      },
                    },
                  },
                  y: {
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
                plugins: { legend: { display: true, position: 'top' } },
                scales: {
                  x: {
                    title: { display: true, text: 'Date' },
                    ticks: {
                      callback: (value, index) => {
                        const date = new Date(graphData.past_dates[index]);
                        return date.toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }); // Format: "2 Jan 2025"
                      },
                    },
                  },
                  y: {
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
