import requests
import pandas as pd
from datetime import datetime, timedelta

# Your provided API key and Custom Search Engine ID
API_KEY = "AIzaSyDpvyEy-nl2xHTZR_o8BPw1JZFr4G55uLQ"
SEARCH_ENGINE_ID = "c4676cd5f4a3f4b5a"

# List of a single company (e.g., Infosys)
company_name = "Infosys"

# Function to fetch news for the company
def fetch_news_for_company(company_name, start_index=1):
    query = f"{company_name} stock news"
    # Fetch news from the last 7 days using dateRestrict
    url = f"https://www.googleapis.com/customsearch/v1?q={query}&key={API_KEY}&cx={SEARCH_ENGINE_ID}&dateRestrict=d7&start={start_index}"
    response = requests.get(url)
    return response.json()

# Collecting data for the company
data = []
start_index = 1  # Starting index for pagination
total_entries = 0

# Fetch news until we get 20 valid entries for the company
while total_entries < 20:
    results = fetch_news_for_company(company_name, start_index)

    # Extract and process the results from the Google Custom Search API
    if 'items' in results:
        for item in results['items']:
            title = item.get('title', '')

            # Filter: Include only headlines with more than 10 words
            if len(title.split()) > 10:
                # Append the data to the list
                data.append({
                    'Company Name': company_name,
                    'Headline': title,
                    'Date': datetime.now().strftime('%Y-%m-%d')
                })

                total_entries += 1
                if total_entries >= 20:
                    break

    # Increment the start index for pagination
    start_index += 10

# Create a DataFrame from the data
df = pd.DataFrame(data)

# Save to a CSV file
df.to_csv("infosys_headlines_last_week.csv", index=False)

# Display the DataFrame
print(df.head())