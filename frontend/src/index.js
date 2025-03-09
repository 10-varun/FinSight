import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GraphProvider } from "./context/GraphContext"; 


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GraphProvider> {/* ✅ Wrap the entire app */}
    <App />
  </GraphProvider>
);

reportWebVitals();
