import React, { useState, useEffect } from 'react';
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
  const [activeGraph, setActiveGraph] = useState('past');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, [companyName]); // This will run whenever the companyName changes

  return (
    <div className="graph-container">
      <h2>Stock Predictions for {companyName}</h2>
      {error && <div className="error">{error}</div>}
      {graphData && (
        <>
          <div className="graph-wrapper">
            {activeGraph === 'past' && (
              <>
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
              </>
            )}
            {activeGraph === 'predicted' && (
              <>
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
              </>
            )}
            {activeGraph === 'three_months' && (
              <>
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
              </>
            )}
            {activeGraph === 'six_months' && (
              <>
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
              </>
            )}
          </div>
          <div className="button-group">
            <button onClick={() => setActiveGraph('past')}>Past Prices</button>
            <button onClick={() => setActiveGraph('predicted')}>Predicted Prices</button>
            <button onClick={() => setActiveGraph('three_months')}>Last 3 Months</button>
            <button onClick={() => setActiveGraph('six_months')}>Last 6 Months</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Graph;