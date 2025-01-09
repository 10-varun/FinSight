from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.WebScraper import scrape  

app = Flask(__name__)
CORS(app)

@app.route('/api/news', methods=['POST'])
def get_news():
    data = request.get_json()
    company = data.get('company')

    if not company:
        return jsonify({'error': 'No company provided'}), 400

    articles = scrape(company)
    return jsonify({'articles': articles})

if __name__ == '__main__':
    app.run(debug=True)
