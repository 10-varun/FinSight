# **FINSIGHT Documentation**

## **Introduction**
FINSIGHT is an intelligent stock market insights platform designed to simplify the investment journey for both beginners and seasoned investors. The platform centralizes essential stock market data, financial news, and personalized recommendations, providing users with actionable insights to make informed decisions.

---

## **Project Overview**

### **Objective**
To create a user-friendly application that integrates historical stock data, real-time news sentiment analysis, and AI-driven recommendations for smarter investment decisions.

### **Key Features**
1. Centralized stock market data from trusted sources like NSE India and Economic Times.
2. Sentiment analysis of financial news headlines for real-time market insights.
3. Personalized investment recommendations based on historical data, sentiment analysis, and trends.
4. Portfolio management tools to track and analyze investment performance.
5. Visual representation of stock trends, sentiment scores, and recommendation confidence.

---

## **System Architecture**

### **1. Data Layer**
- **Stock Data Sources**: NSE Website, Economic Times, Finnhub API, Google API.
- **News Sources**: NewsAPI.
- **Data Processing**:
  - Text preprocessing using SpaCy.
  - Semantic embeddings with SentenceTransformer.
  - Numerical normalization using StandardScaler.

### **2. Processing Layer**
- **Sentiment Analysis Models**:
  - VADER for basic sentiment scoring.
  - FinBERT for financial context analysis.
- **Summarization Model**:
  - LaMini-Flan-T5-248M for generating concise and informative summaries of financial news.
- **Trend Prediction**:
  - Machine Learning Models: LSTM, GRU for time-series predictions.
- **Feature Integration**:
  - Combines numerical stock data with semantic news embeddings.

### **3. Application Layer**
- **Frontend**:
  - Built with React for dynamic interfaces.
  - Styled using HTML/CSS and Bootstrap.
- **Backend**:
  - Flask/FastAPI for API handling.
  - Axios for HTTP requests.
- **Deployment**:
  - Hosted on Vercel with model training on Google Colab.

---

## **Tech Stack**

### **Frontend**
- React, HTML/CSS, JavaScript, Bootstrap

### **Backend**
- Python, Flask/FastAPI

### **Data Scraping**
- NSE Website, Economic Times, Finnhub API, Google API, NewsAPI

### **Cloud and Hosting**
- Google Colab, Vercel

### **Version Control**
- GitHub

### **Libraries and Tools**
- SpaCy, SentenceTransformer, VADER, FinBERT, StandardScaler, LaMini-Flan-T5-248M

---

## **Key Functionalities**

### **1. Real-Time Stock Data Aggregation**
- Scrapes stock data from multiple sources.
- Updates trends dynamically for user convenience.

### **2. News Sentiment Analysis**
- Processes headlines using sentiment analysis tools (VADER, FinBERT).
- Categorizes sentiments into positive, neutral, and negative.

### **3. Summarization of Financial News**
- Utilizes the LaMini-Flan-T5-248M model to generate concise and informative summaries of financial news articles, allowing users to quickly understand key points.

### **4. Personalized Investment Recommendations**
- Analyzes historical trends, market sentiment, and user preferences.
- Suggests investment actions (e.g., invest, hold, avoid) with confidence scores based on sentiment analysis and market trends.

### **5. Portfolio Management**
- Tracks stock purchase price, current value, profit/loss, and percentage changes.
  
### **6. Visualizations**
- Interactive graphs for stock trends.
- Sentiment dashboards for quick market sentiment overviews.

---

## **Development Workflow**

### **1. Data Collection**
- Set up APIs for data aggregation (Finnhub, Google, NewsAPI).
- Automate scraping tasks for real-time updates.

### **2. Preprocessing**
- Clean and tokenize news data using SpaCy.
- Normalize numerical stock data for consistency.

### **3. Model Training**
- Train sentiment analysis models on labeled datasets.
- Fine-tune LaMini-Flan-T5-248M for financial news summarization.
- Fine-tune LSTM and GRU models for time-series predictions.

### **4. API Integration**
- Build Flask/FastAPI endpoints for model predictions.
- Handle user requests and serve real-time data.

### **5. Frontend Development**
- Create interactive dashboards and widgets with React.
- Use Chart.js for graph visualizations.

---

## **Deployment**
- **Hosting**: Vercel for the web application.
- **Model Training**: Google Colab for scalable training.
- **Version Control**: GitHub for code management and collaboration.

---

## **Future Enhancements**
1. Integration with global stock markets (e.g., NYSE, NASDAQ).
2. Enhanced AI-driven recommendations using reinforcement learning.
3. Mobile application development for on-the-go insights.
4. Advanced analytics for institutional investors.
5. Real-time alerts for market fluctuations.

---

## **Conclusion**
FINSIGHT is designed to simplify stock market investments by leveraging AI, advanced analytics, and user-centric design. It empowers users to make data-driven decisions confidently and aims to redefine how investors interact with the stock market.

## **Repository Information**

### **How to Contribute**
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your branch.
4. Create a pull request detailing your contributions.

### **Setup Instructions**
1. Clone the repository: `git clone <repository-url>`
2. Install dependencies:
   - Frontend: `npm install`
   - Backend: `pip install -r requirements.txt`
3. Start the development server:
   - Frontend: `npm start`
   - Backend: `python app.py`

### **License**
This project is licensed under the MIT License. See the `LICENSE` file for details.

For any questions or contributions, please visit the [GitHub repository](#).
