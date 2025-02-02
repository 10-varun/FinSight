import yfinance as yf
import datetime
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
from yahooquery import search
import pandas as pd
# Load the trained model (you can adjust the path as needed)
model = tf.keras.models.load_model('./model/my_model.h5')

def predict_stock_prices(company_name):
    try:
        # Use Yahoo Finance's search API
        search_results = search(company_name)

        # Extract the first valid ticker symbol
        ticker = None
        if 'quotes' in search_results and search_results['quotes']:
            for result in search_results['quotes']:
                if 'symbol' in result and 'shortname' in result:
                    ticker = result['symbol']
                    break

        if not ticker:
            raise ValueError(f"No ticker found for the given company name: {company_name}. Search results: {search_results}")

        # Fetch stock data from Yahoo Finance for the past year
        data = yf.Ticker(ticker)
        one_year_data = data.history(period='1y')

        if one_year_data.empty:
            raise ValueError(f"No data found for ticker {ticker}. Please check the ticker validity.")

        # Save the data to a CSV file (optional)
        one_year_data.to_csv(f'./data/{ticker}_stock.csv')

        # Read the data from the CSV file
        df = pd.read_csv(f'./data/{ticker}_stock.csv')

        # Data preparation: Use only the 'Date' and 'Close' columns
        df = df[['Date', 'Close']]
        df['Date'] = pd.to_datetime(df['Date'], utc=True).dt.date

        # Extract 6-month and 3-month data
        six_months_ago = df['Date'].iloc[-1] - datetime.timedelta(days=180)
        three_months_ago = df['Date'].iloc[-1] - datetime.timedelta(days=90)

        df_six_months = df[df['Date'] >= six_months_ago]
        df_three_months = df[df['Date'] >= three_months_ago]

        # Normalize the 'Close' prices using MinMaxScaler
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(df['Close'].values.reshape(-1, 1))

        time_step = 100

        # Create dataset for LSTM input
        def create_dataset(dataset, time_step=1):
            dataX = []
            for i in range(len(dataset) - time_step - 1):
                dataX.append(dataset[i:(i + time_step), 0])
            return np.array(dataX)

        X_input = create_dataset(scaled_data, time_step)
        X_input = X_input[-1].reshape((1, time_step, 1))

        # Predict the next 30 days stock prices
        predicted_values = []
        for i in range(30):
            yhat = model.predict(X_input, verbose=0)
            predicted_values.append(yhat[0][0])
            X_input = np.append(X_input[:, 1:, :], yhat[0][0].reshape(1, 1, 1), axis=1)

        # Inverse transform the predictions to the original scale
        predictions = scaler.inverse_transform(np.array(predicted_values).reshape(-1, 1))

        # Prepare the dates for prediction
        last_date = df['Date'].iloc[-1]
        predicted_dates = [last_date + datetime.timedelta(days=i + 1) for i in range(30)]

        # Prepare the final DataFrame with predictions
        predicted_df = pd.DataFrame({
            'Date': predicted_dates,
            'Predicted Close': predictions.flatten()
        })

        # Return the result in a dictionary format
        return {
            "past_dates": df['Date'].tolist(),
            "past_prices": df['Close'].tolist(),
            "six_months_dates": df_six_months['Date'].tolist(),
            "six_months_prices": df_six_months['Close'].tolist(),
            "three_months_dates": df_three_months['Date'].tolist(),
            "three_months_prices": df_three_months['Close'].tolist(),
            "predicted_dates": predicted_df['Date'].tolist(),
            "predicted_prices": predicted_df['Predicted Close'].tolist()
        }

    except Exception as e:
        # Log the error and raise a clear message
        print(f"Error: {str(e)}")
        raise ValueError(f"Error occurred while predicting stock prices: {str(e)}")