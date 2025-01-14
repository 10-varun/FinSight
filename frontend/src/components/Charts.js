import React from 'react';
import './Charts.css';

function Charts({ stockData }) {
  if (!stockData) {
    return <div>Loading stock data...</div>;
  }

  if (stockData.error) {
    return <div className="error-message">{stockData.error}</div>;
  }

  const tableNamesAndFields = {
    "Peer Comparison": ['S.No.', 'Name', 'CMP Rs.', 'P/E', 'Mar Cap Rs.Cr.', 'Div Yld %', 'NP Qtr Rs.Cr.', 'Qtr Profit Var %', 'Sales Qtr Rs.Cr.', 'Qtr Sales Var %', 'ROCE %'],
    "Quarterly Results": [" ", "Dec 2021", "Mar 2022", "Jun 2022", "Sep 2022", "Dec 2022", "Mar 2023", "Jun 2023", "Sep 2023", "Dec 2023", "Mar 2024", "Jun 2024", "Sep 2024", "Dec 2024"],
    "Profit & Loss": [" ", "Mar 2013", "Mar 2014", "Mar 2015", "Mar 2016", "Mar 2017", "Mar 2018", "Mar 2019", "Mar 2020", "Mar 2021", "Mar 2022", "Mar 2023", "Mar 2024", "TTM"],
    "Balance Sheet": [" ", "Mar 2013", "Mar 2014", "Mar 2015", "Mar 2016", "Mar 2017", "Mar 2018", "Mar 2019", "Mar 2020", "Mar 2021", "Mar 2022", "Mar 2023", "Mar 2024", "Sep 2024"],
    "Cash Flows": ["", "Mar 2013", "Mar 2014", "Mar 2015", "Mar 2016", "Mar 2017", "Mar 2018", "Mar 2019", "Mar 2020", "Mar 2021", "Mar 2022", "Mar 2023", "Mar 2024"],
    "Ratios": ["", "Mar 2013", "Mar 2014", "Mar 2015", "Mar 2016", "Mar 2017", "Mar 2018", "Mar 2019", "Mar 2020", "Mar 2021", "Mar 2022", "Mar 2023", "Mar 2024"],
    "Shareholding Pattern": ["", "Dec 2021", "Mar 2022", "Jun 2022", "Sep 2022", "Dec 2022", "Mar 2023", "Jun 2023", "Sep 2023", "Dec 2023", "Mar 2024", "Jun 2024", "Sep 2024"]
  };

  // Map stockData keys to the table names you want
  const tableMapping = {
    Table_1: "Peer Comparison",
    Table_2: "Quarterly Results",
    Table_3: "Profit & Loss",
    Table_4: "Balance Sheet",
    Table_5: "Cash Flows",
    Table_6: "Ratios",
    Table_7: "Shareholding Pattern"
  };

  // Remove the 8th table if present
  const filteredStockData = Object.keys(stockData).filter(tableName => tableName !== "Table_8");

  return (
    <div className="charts-container">
      <h2>Stock Data Tables</h2>
      {Object.keys(stockData).length === 0 ? (
        <div>No stock data available.</div>
      ) : (
        filteredStockData.map((tableName, index) => {
          const tableDisplayName = tableMapping[tableName] || "Unknown Table"; // Default to "Unknown Table" if no mapping exists
          return (
            <div key={index} className="table-container">
              <h3>{tableDisplayName}</h3>
              <table className="stock-table">
                <thead>
                  <tr>
                    {tableNamesAndFields[tableDisplayName]?.map((field, fieldIndex) => (
                      <th key={fieldIndex}>{field}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stockData[tableName].slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Charts;
