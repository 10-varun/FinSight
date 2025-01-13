from flask import Flask, request, jsonify
import logging
from flask_cors import CORS  # Import CORS
from news import fetch_and_return_articles
from scoring import process_articles

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)  # This will allow all origins to access the API

# Add logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/api/news', methods=['POST'])
def get_news():
    try:
        data = request.get_json()
        company = data.get('company')

        # Log incoming request
        app.logger.debug(f"Received request with company: {company}")

        # Check if company is provided
        if not company:
            app.logger.error("Company name is missing")
            return jsonify({'error': 'Company name is required'}), 400
        
        # Fetch news articles
        app.logger.debug(f"Fetching data for company: {company}")
        news_articles = fetch_and_return_articles(company)

        # Check if articles are found
        if not news_articles:
            app.logger.warning(f"No articles found for {company}")
            return jsonify({'error': 'No news articles found for this company'}), 404
        
        # Process articles to analyze sentiment
        result = process_articles(news_articles)

        # Send the result back as JSON
        return jsonify({
            'summary': result['summary'],
            'overall_score': result['overall_score'],
            'investment_advice': result['investment_advice']
        })

    except Exception as e:
        app.logger.exception("Error occurred while processing the request.")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
