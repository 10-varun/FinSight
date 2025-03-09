import { createContext, useState, useContext } from "react";

const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
  const [cachedGraphData, setCachedGraphData] = useState({});

  return (
    <GraphContext.Provider value={{ cachedGraphData, setCachedGraphData }}>
      {children}
    </GraphContext.Provider>
  );
};

export const useGraphData = () => useContext(GraphContext);
