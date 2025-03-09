import React, { useState, useEffect } from "react";
import supabase from "./supabaseClient";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./History.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const History = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [graphIndex, setGraphIndex] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  // Fetch the currently logged-in user's email
  const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error.message);
      setError("Failed to get user");
      setLoading(false);
    } else if (user) {
      setUserEmail(user.email);
      fetchHistory(user.email);
    }
  };

  const fetchHistory = async (email) => {
    try {
      setLoading(true);
      let { data: stock_predictions, error } = await supabase
        .from("stock_predictions")
        .select("id, created_at, company, predicted_dates, predicted_prices, summary, overall_score, user_email")
        .eq("user_email", email) // Fetch history for the logged-in user
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("Fetched Data:", stock_predictions);

      setHistory(stock_predictions || []);
    } catch (err) {
      console.error("Fetch error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSummary = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
    setGraphIndex(null);
  };

  const toggleGraph = (index) => {
    setGraphIndex(graphIndex === index ? null : index);
    setExpandedIndex(null);
  };

  const filteredHistory = history.filter((entry) =>
    entry.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="history-container">
      <h2 className="history-title">Search History</h2>
      <input
        type="text"
        className="search-bar"
        placeholder="Search company..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p className="loading">Loading history...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="history-list-container">
          <table className="history-table">
            <thead>
              <tr className="history-header">
                <th>Company</th>
                <th className="score">Score</th>
                <th className="timestamp">Time</th>
                <th className="actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((entry, index) => (
                  <React.Fragment key={index}>
                    <tr className="history-item">
                      <td className="company-name">{entry.company}</td>
                      <td className="score">{entry.overall_score?.toFixed(2)}</td>
                      <td className="timestamp">
                        {new Date(entry.created_at).toLocaleTimeString()} {" "}
                        {new Date(entry.created_at).toLocaleDateString()}
                      </td>
                      <td className="actions">
                        <button className="summary-btn" onClick={() => toggleSummary(index)}>
                          {expandedIndex === index ? "Hide Summary" : "View Summary"}
                        </button>
                        <button className="graph-btn" onClick={() => toggleGraph(index)}>
                          {graphIndex === index ? "Hide Graph" : "View Graph"}
                        </button>
                      </td>
                    </tr>
                    {expandedIndex === index && (
                      <tr className="summary-row">
                        <td colSpan="4" className="summary-text">
                          {entry.summary || "No summary available."}
                        </td>
                      </tr>
                    )}
                    {graphIndex === index && (
                      <tr className="summary-row">
                        <td colSpan="4" className="summary-text">
                          <div className="chart-container">
                            <h3>Stock Price Trends for {entry.company}</h3>
                            <Line
                              data={{
                                labels: entry.predicted_dates.map((date) => new Date(date).toDateString()),
                                datasets: [
                                  {
                                    label: "Predicted Prices",
                                    data: entry.predicted_prices,
                                    borderColor: "rgba(75,192,192,1)",
                                    fill: false,
                                  },
                                ],
                              }}
                              options={{
                                maintainAspectRatio: false,
                                responsive: true,
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-results">No history found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;
