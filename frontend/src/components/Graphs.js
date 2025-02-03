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
        body: JSON.stringify({ ticker: companyName.toUpperCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        setGraphData({
          predicted_dates: data.predicted_dates,
          predicted_prices: data.predicted_prices,
          past_dates: data.past_dates,
          past_prices: data.past_prices,
          three_months_dates: data.three_months_dates,
          three_months_prices: data.three_months_prices,
          six_months_dates: data.six_months_dates,
          six_months_prices: data.six_months_prices,
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
                labels: graphData.predicted_dates.map(date => new Date(date).toDateString()),
                datasets: [
                  {
                    label: 'Predicted Prices',
                    data: graphData.predicted_prices,
                    borderColor: 'rgba(75,192,192,1)',
                    fill: false,
                  },
                ],
              }}
            />
          </div>

          {/* Past Stock Prices Graph */}
          <div className="graph-wrapper">
            <h3>Past Stock Prices</h3>
            <Line
              data={{
                
                labels: graphData.past_dates.map(date => new Date(date).toDateString()),
                datasets: [
                  {
                    label: 'Past Prices',
                    data: graphData.past_prices,
                    borderColor: 'rgba(255,99,132,1)',
                    fill: false,
                  },
                ],
              }}
            />
          </div>

          {/* Three Months Stock Prices Graph */}
          <div className="graph-wrapper">
            <h3>Stock Prices (Last 3 Months)</h3>
            <Line
              data={{
                
                labels: graphData.three_months_dates.map(date => new Date(date).toDateString()),
                datasets: [
                  {
                    label: 'Three Months Prices',
                    data: graphData.three_months_prices,
                    borderColor: 'rgba(54, 162, 235,1)',
                    fill: false,
                  },
                ],
              }}
            />
          </div>

          {/* Six Months Stock Prices Graph */}
          <div className="graph-wrapper">
            <h3>Stock Prices (Last 6 Months)</h3>
            <Line
              data={{
               
                labels: graphData.six_months_dates.map(date => new Date(date).toDateString()),
                datasets: [
                  {
                    label: 'Six Months Prices',
                    data: graphData.six_months_prices,
                    borderColor: 'rgba(153, 102, 255,1)',
                    fill: false,
                  },
                ],
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Graph;