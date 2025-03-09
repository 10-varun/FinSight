import React, { useState, useEffect } from 'react';
import { useGraphData } from '../context/GraphContext'; // ✅ Import Graph Context
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
  const [error, setError] = useState('');
  const [activeGraph, setActiveGraph] = useState('past');

  // ✅ Get cached data from context
  const { cachedGraphData, setCachedGraphData } = useGraphData();

  useEffect(() => {
    const fetchData = async () => {
      setError('');

      // ✅ If data exists in cache, use it instead of fetching again
      if (cachedGraphData[companyName]) {
        console.log(`🔄 Using cached data for: ${companyName}`);
        return;
      }

      try {
        console.log(`📊 Fetching graph data for: ${companyName}`);

        const response = await fetch('http://localhost:5000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticker: companyName.toUpperCase() }),
        });

        const data = await response.json();

        if (response.ok) {
          const newGraphData = {
            predicted_dates: data.predicted_dates || [],
            predicted_prices: data.predicted_prices || [],
            past_dates: data.past_dates || [],
            past_prices: data.past_prices || [],
            three_months_dates: data.three_months_dates || [],
            three_months_prices: data.three_months_prices || [],
            six_months_dates: data.six_months_dates || [],
            six_months_prices: data.six_months_prices || [],
          };

          setCachedGraphData((prevData) => ({
            ...prevData,
            [companyName]: newGraphData, // ✅ Store data in context
          }));
        } else {
          setError(data.error || 'Error fetching ticker symbol.');
        }
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
      }
    };

    if (companyName) {
      fetchData();
    }
  }, [companyName, cachedGraphData, setCachedGraphData]); // ✅ Rerun only when company changes

  // ✅ Use cached data
  const graphData = cachedGraphData[companyName];

  return (
    <div className="graph-container">
      <h2>Stock Predictions for {companyName}</h2>
      {error && <div className="error">{error}</div>}

      {/* ✅ Add Loading State */}
      {!graphData ? (
        <p>Loading graph data...</p>
      ) : (
        <>
          <div className="graph-wrapper">
            {activeGraph === 'past' && graphData.past_dates.length > 0 && (
              <>
                <h3>Past Stock Prices</h3>
                <Line
                  data={{
                    labels: graphData.past_dates.map(date => new Date(date).toDateString()),
                    datasets: [{ label: 'Past Prices', data: graphData.past_prices, borderColor: 'rgba(255,99,132,1)', fill: false }],
                  }}
                />
              </>
            )}

            {activeGraph === 'predicted' && graphData.predicted_dates.length > 0 && (
              <>
                <h3>Predicted Stock Prices (Next 30 Days)</h3>
                <Line
                  data={{
                    labels: graphData.predicted_dates.map(date => new Date(date).toDateString()),
                    datasets: [{ label: 'Predicted Prices', data: graphData.predicted_prices, borderColor: 'rgba(75,192,192,1)', fill: false }],
                  }}
                />
              </>
            )}

            {activeGraph === 'three_months' && graphData.three_months_dates.length > 0 && (
              <>
                <h3>Stock Prices (Last 3 Months)</h3>
                <Line
                  data={{
                    labels: graphData.three_months_dates.map(date => new Date(date).toDateString()),
                    datasets: [{ label: 'Three Months Prices', data: graphData.three_months_prices, borderColor: 'rgba(54, 162, 235,1)', fill: false }],
                  }}
                />
              </>
            )}

            {activeGraph === 'six_months' && graphData.six_months_dates.length > 0 && (
              <>
                <h3>Stock Prices (Last 6 Months)</h3>
                <Line
                  data={{
                    labels: graphData.six_months_dates.map(date => new Date(date).toDateString()),
                    datasets: [{ label: 'Six Months Prices', data: graphData.six_months_prices, borderColor: 'rgba(153, 102, 255,1)', fill: false }],
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
