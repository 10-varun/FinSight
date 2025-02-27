import React, { useState } from "react";
import "./History.css";

const sampleHistory = [
  { company: "TCS", score: 5.7, timestamp: "2025-02-24T16:46:00" },
  { company: "Infosys", score: 7.2, timestamp: "2025-02-23T14:15:00" },
  { company: "Reliance", score: 6.5, timestamp: "2025-02-22T11:30:00" },
  { company: "HDFC Bank", score: 4.9, timestamp: "2025-02-21T18:50:00" },
  { company: "Wipro", score: 8.1, timestamp: "2025-02-20T09:10:00" },
  { company: "TCS", score: 6.3, timestamp: "2025-02-19T13:25:00" },
  { company: "Infosys", score: 7.9, timestamp: "2025-02-18T10:55:00" },
  { company: "Reliance", score: 5.8, timestamp: "2025-02-17T17:40:00" },
  { company: "HDFC Bank", score: 4.5, timestamp: "2025-02-16T15:20:00" },
  { company: "Wipro", score: 7.6, timestamp: "2025-02-15T08:30:00" },
];

const summaries = {
  "TCS": "Tata Consultancy Services (TCS) is a global leader in IT services, consulting, and business solutions, operating in over 50 countries. It specializes in digital transformation, AI, cloud computing, cybersecurity, and blockchain, serving industries like finance, healthcare, retail, and manufacturing. TCS has a strong research and innovation culture, investing in emerging technologies and sustainability initiatives. It is known for its workforce development programs and global impact in driving digital efficiency. With a reputation for consistent financial growth and customer-centric solutions, TCS continues to shape the future of technology services while prioritizing corporate social responsibility and environmental sustainability.",
  
  "Infosys": "Infosys is a global IT services company renowned for its expertise in digital transformation, AI, automation, and cloud computing. Established in 1981, Infosys serves industries such as banking, healthcare, and retail, providing consulting, outsourcing, and enterprise solutions. It has a strong research focus, developing advanced technologies in machine learning, blockchain, and cybersecurity. Infosys prioritizes sustainability, employee upskilling, and innovation, fostering partnerships with leading global firms. With a commitment to operational excellence and a strong financial track record, Infosys continues to drive automation, efficiency, and digitalization across industries, making it a key player in the global technology ecosystem.",
  
  "Reliance": "Reliance Industries is India’s largest conglomerate, with business verticals spanning petrochemicals, telecommunications, retail, and digital services. Its telecom arm, Jio, disrupted India’s mobile industry, making data affordable and accessible. Reliance Retail is the country’s largest retail chain, expanding into e-commerce and consumer goods. The company is also investing heavily in renewable energy, green hydrogen, and AI-driven technology ventures. With a strong focus on sustainability and global expansion, Reliance continues to drive innovation in multiple sectors, playing a significant role in shaping India's economic landscape while pursuing a vision of digital transformation and environmental responsibility.",
  
  "HDFC Bank": "HDFC Bank is India’s leading private sector bank, offering a wide range of financial services, including retail banking, corporate finance, and wealth management. It is known for its digital banking innovations, providing seamless online and mobile banking experiences. The bank has a strong credit portfolio and customer-first approach, catering to both individuals and businesses. HDFC Bank has expanded its reach across urban and rural India, supporting financial inclusion and economic growth. With a focus on technological advancements, sustainability, and risk management, HDFC Bank remains a key player in India's banking sector, driving financial innovation and economic development.",
  
  "Wipro": "Wipro is a multinational IT services and consulting company specializing in cloud computing, AI, cybersecurity, and digital transformation. Founded in 1945, Wipro has evolved into a global leader, serving industries such as healthcare, energy, and finance. It invests heavily in automation, sustainability, and next-generation technologies, leveraging its strong research and development capabilities. Wipro’s commitment to digital innovation and environmental responsibility makes it a preferred partner for enterprises worldwide. With a workforce spanning multiple continents and a focus on customer-centric solutions, Wipro continues to drive business transformation, helping organizations adapt to evolving technological trends and market demands.",
  
  "HCL Technologies": "HCL Technologies is a global IT services company specializing in engineering solutions, R&D, and digital transformation. With expertise in AI, IoT, and automation, HCL serves industries such as aerospace, manufacturing, and financial services. It is known for its strong client-centric approach and emphasis on innovation, helping businesses accelerate their digital journeys. HCL invests in sustainability and workforce upskilling, ensuring its global teams remain at the forefront of technological advancements. The company’s strategic partnerships with major tech firms and its expanding presence across global markets have cemented its position as a leading player in the IT services industry.",
  
  "Bajaj Finance": "Bajaj Finance is one of India’s most prominent non-banking financial companies (NBFCs), offering a wide range of financial products, including loans, insurance, and investment solutions. It has revolutionized consumer financing by making credit accessible to millions through innovative lending models. Bajaj Finance is a leader in digital lending, using advanced AI and data analytics to streamline loan approvals. Its strong risk management framework and customer-first approach have made it a trusted brand. With a focus on expanding digital offerings and increasing financial inclusion, Bajaj Finance continues to shape India's financial landscape by offering convenient and tech-driven financial services.",
  
  "ICICI Bank": "ICICI Bank is one of India’s largest private sector banks, offering comprehensive financial services such as retail banking, corporate lending, investment banking, and insurance. Known for its digital-first approach, the bank has pioneered innovations in mobile banking, AI-driven customer support, and digital payments. ICICI Bank plays a vital role in India’s financial ecosystem, supporting businesses, entrepreneurs, and individuals with tailored financial products. Its strong international presence and commitment to financial inclusion further strengthen its market leadership. With a reputation for innovation, risk management, and sustainability, ICICI Bank continues to evolve as a key player in the banking sector.",
  
  "Hindustan Unilever": "Hindustan Unilever Limited (HUL) is India’s largest fast-moving consumer goods (FMCG) company, with a diverse portfolio of brands across beauty, home care, and nutrition. Its products, including Dove, Surf Excel, and Lux, are household names. HUL has a vast distribution network, reaching millions of consumers nationwide. It prioritizes sustainability by reducing plastic waste, conserving water, and promoting eco-friendly packaging. The company invests in product innovation, leveraging AI and consumer insights to develop new offerings. With a strong financial track record and a commitment to responsible business practices, HUL remains a dominant force in India's consumer goods industry.",
  
  "Kotak Mahindra Bank": "Kotak Mahindra Bank is a leading private sector bank in India, offering diverse financial services, including retail and corporate banking, wealth management, and insurance. It has built a reputation for customer-centric innovation, leveraging digital banking technologies to enhance user experience. The bank has a strong focus on financial inclusion, expanding its services to small businesses and underserved markets. With a disciplined risk management approach and strategic investments in AI-driven banking solutions, Kotak Mahindra Bank continues to grow as a trusted financial institution. Its commitment to sustainability and technology-driven banking solutions positions it as a future-ready financial leader."
};


const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const filteredHistory = sampleHistory.filter((entry) =>
    entry.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSummary = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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
                    <td className="score">{entry.score.toFixed(1)}</td>
                    <td className="timestamp">
                      {new Date(entry.timestamp).toLocaleTimeString()}{" "}
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </td>
                    <td className="actions">
                      <button
                        className="summary-btn"
                        onClick={() => toggleSummary(index)}
                      >
                        {expandedIndex === index ? "Hide Summary" : "View Summary"}
                      </button>
                      <button className="graph-btn">View Graph</button>
                    </td>
                  </tr>
                  {expandedIndex === index && (
                    <tr className="summary-row">
                      <td colSpan="4" className="summary-text">
                        {summaries[entry.company] || "No summary available."}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-results">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
