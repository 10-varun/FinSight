from flask import Flask, request, jsonify
import logging
from flask_cors import CORS
from news import fetch_and_return_articles
from scoring import process_articles
from charts import get_stock_data
from stock_lstm import predict_stock_prices  # Importing the prediction function from stock_lstm.py

app = Flask(__name__)  # This is the only instantiation of Flask app

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

        if 'error' in stock_data:
            return jsonify({'error': stock_data['error']}), 404

        return jsonify(stock_data)
    except Exception as e:
        app.logger.exception("Error occurred while fetching stock data.")
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['POST'])  # New route for stock price prediction
def predict():
    try:
        # Get the JSON request data
        data = request.get_json()
        ticker = data.get('ticker')  # Get the ticker symbol from the request data
        
        if not ticker:
            return jsonify({"error": "Ticker symbol is required"}), 400

        # Call the stock prediction function
        prediction_data = predict_stock_prices(ticker)

        # Return the prediction data in the correct format
        response = {
            "past_dates": prediction_data["past_dates"],
            "past_prices": prediction_data["past_prices"],
            "predicted_dates": prediction_data["predicted_dates"],
            "predicted_prices": prediction_data["predicted_prices"]
        }

        return jsonify(response), 200

    except Exception as e:
        app.logger.exception("Error occurred while making prediction.")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
