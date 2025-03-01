from flask import Flask, request, jsonify
import logging
from datetime import datetime, date, timezone
from flask_cors import CORS
from decimal import Decimal
from news import fetch_and_return_articles
from scoring import process_articles
from charts import get_stock_data
from stock_lstm import predict_stock_prices  
from supabase import create_client, Client 
import os
from dotenv import load_dotenv
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)
'''
# Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

'''
SUPABASE_URL = "https://yazzyrvtglasvevlraut.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhenp5cnZ0Z2xhc3ZldmxyYXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3ODE5NzgsImV4cCI6MjA1NDM1Nzk3OH0.NmZPqtJKzzsgORpQqbXwI6OCzCz_i6PBe0_YhwpywWU"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhenp5cnZ0Z2xhc3ZldmxyYXV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODc4MTk3OCwiZXhwIjoyMDU0MzU3OTc4fQ.EXnTpHqwk3lcr7BTtyXlyK0Ztzt2yk3AhZ9-y7N8Vn8"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


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
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        ticker = data.get('ticker')

        if not ticker:
            return jsonify({"error": "Ticker symbol is required"}), 400

       
        from datetime import datetime

        # Fetch all users from Supabase Auth
        user_data = supabase.auth.admin.list_users()

        # Ensure we have users
        if not user_data:
            return jsonify({"error": "No logged-in user found"}), 401

        # Sort users by last_sign_in_at (most recent first)
        sorted_users = sorted(
            user_data,
            key=lambda u: u.last_sign_in_at if u.last_sign_in_at else datetime.min.replace(tzinfo=timezone.utc),  
            reverse=True
        )

        # Get the latest signed-in user's email
        user_email = sorted_users[0].email if sorted_users else "Unknown Email"

        app.logger.info(f"✅ Last Signed-In User: {user_email}")





        
        existing_entry, _ = (
            supabase.table('stock_predictions')
            .select('*')
            .eq('company', ticker)
            .order('created_at', desc=True)
            .limit(1)
            .execute()
        )

        prediction_data = predict_stock_prices(ticker)

        if existing_entry and len(existing_entry[1]) > 0:
            last_entry = existing_entry[1][0]
            if prediction_data["predicted_prices"] == last_entry.get("predicted_prices", []):
                app.logger.info(f"⚠️ Duplicate prediction detected for {ticker}. Skipping insert.")
                return jsonify({"message": "This prediction already exists in the database."}), 200

        news_articles = fetch_and_return_articles(ticker)
        news_result = process_articles(news_articles) if news_articles else {"summary": None, "overall_score": None}

      
        app.logger.info(f"🔹 Saving new data for {ticker} (User: {user_email})...")
        save_to_supabase(ticker, prediction_data, news_result, user_email)

        return jsonify({
            "past_dates": prediction_data["past_dates"],
            "past_prices": prediction_data["past_prices"],
            "six_months_dates": prediction_data["six_months_dates"],
            "six_months_prices": prediction_data["six_months_prices"],
            "three_months_dates": prediction_data["three_months_dates"],
            "three_months_prices": prediction_data["three_months_prices"],
            "predicted_dates": prediction_data["predicted_dates"],
            "predicted_prices": prediction_data["predicted_prices"],
            "summary": news_result["summary"],
            "overall_score": news_result["overall_score"]
        }), 200

    except Exception as e:
        app.logger.exception("Error occurred while making prediction.")
        return jsonify({"error": str(e)}), 500



def serialize_data(data):
    """ Converts all date objects and Decimal values to JSON serializable types """
    for key in data:
        if isinstance(data[key], list):  # Convert list of dates
            data[key] = [d.isoformat() if isinstance(d, (datetime, date)) else d for d in data[key]]
        elif isinstance(data[key], Decimal):  # Convert Decimal to float
            data[key] = float(data[key])
    return data


def save_to_supabase(company, data, news_data, user_email):
    try:
        app.logger.debug(f"Saving data to Supabase for {company} (User: {user_email})")

        data = serialize_data(data)
        news_data = serialize_data(news_data)

        inserted_data, count = supabase.from_('stock_predictions').insert([
            {
                "company": company,
                "past_dates": data["past_dates"],
                "past_prices": data["past_prices"],
                "six_months_dates": data["six_months_dates"],
                "six_months_prices": data["six_months_prices"],
                "three_months_dates": data["three_months_dates"],
                "three_months_prices": data["three_months_prices"],
                "predicted_dates": data["predicted_dates"],
                "predicted_prices": data["predicted_prices"],
                "summary": news_data["summary"],
                "overall_score": news_data["overall_score"],
                "user_email": user_email,  
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        ]).execute()

        if count is None:
            app.logger.info("✅ Data successfully stored in Supabase, but count is unavailable.")
        else:
            app.logger.info(f"✅ {count} rows successfully stored in Supabase!")

    except Exception as e:
        app.logger.error(f"🔥 Error saving data to Supabase: {str(e)}")



if __name__ == '__main__':
    app.run(debug=True)