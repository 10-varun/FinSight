from flask import Flask, request, jsonify
import logging
from flask_cors import CORS  
from news import fetch_and_return_articles
from scoring import process_articles
from charts import get_stock_data

app = Flask(__name__)

CORS(app) 

logging.basicConfig(level=logging.DEBUG)

@app.route('/api/news', methods=['POST'])
def get_news():
    try:
        data = request.get_json()
        company = data.get('company')

        app.logger.debug(f"Received request with company: {company}")

        if not company:
            app.logger.error("Company name is missing")
            return jsonify({'error': 'Company name is required'}), 400

        app.logger.debug(f"Fetching data for company: {company}")
        news_articles = fetch_and_return_articles(company)

        if not news_articles:
            app.logger.warning(f"No articles found for {company}")
            return jsonify({'error': 'No news articles found for this company'}), 404

        result = process_articles(news_articles)

        return jsonify({
            'summary': result['summary'],
            'overall_score': result['overall_score'],
            'investment_advice': result['investment_advice']
        })

    except Exception as e:
        app.logger.exception("Error occurred while processing the request.")
        return jsonify({'error': str(e)}), 500

@app.route('/api/stock-data/<company_name>', methods=['GET'])
def get_stock_data_endpoint(company_name):
    try:
        app.logger.debug(f"Fetching stock data for company: {company_name}")
        stock_data = get_stock_data(company_name)
        print(stock_data)

        if 'error' in stock_data:
            return jsonify({'error': stock_data['error']}), 404

        return jsonify(stock_data)
    except Exception as e:
        app.logger.exception("Error occurred while fetching stock data.")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)