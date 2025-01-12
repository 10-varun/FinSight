from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.WebScraper import scrape_screener, scrape_news
from scoring import process_articles  

app = Flask(__name__)
CORS(app)

@app.route('/api/news', methods=['POST'])
def get_news():
    data = request.get_json()
    company = data.get('company')

    if not company:
        return jsonify({'error': 'No company provided'}), 400

    news_articles = scrape_news(company)  

    result = process_articles(news_articles)

    net_cash_flow = scrape_screener(company) 

    return jsonify({
        'article_scores': result['article_scores'],
        'sum_of_scores': result['sum_of_scores'],
        'average_score': result['average_score'],
        'net_cash_flow': net_cash_flow
    })

if __name__ == '__main__':
    app.run(debug=True)
