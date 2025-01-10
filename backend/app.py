from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.WebScraper import scrape_screener, scrape_news  # Import functions

app = Flask(__name__)
CORS(app)

# API route for news and net cash flow
@app.route('/api/news', methods=['POST'])
def get_news():
    data = request.get_json()
    company = data.get('company')

    if not company:
        return jsonify({'error': 'No company provided'}), 400

    # Scraping news and net cash flow data
    news_articles = scrape_news(company)
    net_cash_flow = scrape_screener(company)

    return jsonify({
        'articles': news_articles,
        'net_cash_flow': net_cash_flow
    })

if __name__ == '__main__':
    app.run(debug=True)
