import time
import requests
import re

# Your provided API keys
API_KEY = "AIzaSyBcBs3n_CkYkxJ6NiRiUtxcZMconCSbnIE"
SEARCH_ENGINE_ID = "c4676cd5f4a3f4b5a"
NEWS_API_KEY = "a3b81112f1c94a31970a3af0bfba5137"
FINHUB_API_KEY = "cts3hf1r01qh9oes7cng-finhub"

# Function to fetch data with timeout and 5s delay before switching to next API
def fetch_with_retry(url, timeout=10):
    try:
        response = requests.get(url, timeout=timeout)
        print(f"Request to {url} - Status Code: {response.status_code}")  # Log status code

        if response.status_code == 200:
            print("Data successfully fetched!")
            return response.json()
        elif response.status_code == 429:  # Rate limit exceeded
            print(f"Rate limit reached. Retrying in 5 seconds.")
            time.sleep(20)  # 5 seconds delay before retrying or switching
        else:
            print(f"Error fetching data: {response.status_code} - {response.text}")  # Log error and response
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from {url}: {e}")
    return None

# Function to fetch news from Google Custom Search
def fetch_news_for_company_google(company_name, start_index=1, max_results=10):
    query = f"{company_name} stock news"
    url = f"https://www.googleapis.com/customsearch/v1?q={query}&key={API_KEY}&cx={SEARCH_ENGINE_ID}&dateRestrict=d7&start={start_index}"

    print(f"Google Custom Search URL: {url}")  # Log the URL being sent

    results = fetch_with_retry(url)
    if results:
        print("Results fetched from Google")  # Log when results are fetched
        return results.get('items', [])
    else:
        print("No results from Google.")
    return []

# Function to fetch news using NewsAPI as fallback
def fetch_news_for_company_newsapi(company_name, max_results=10):
    query = f"{company_name} stock news"
    url = f"https://newsapi.org/v2/everything?q={query}&apiKey={NEWS_API_KEY}&sortBy=publishedAt&pageSize={max_results}"

    print(f"NewsAPI URL: {url}")  # Log the URL being sent

    results = fetch_with_retry(url)
    if results:
        print("Results fetched from NewsAPI")  # Log when results are fetched
        return results.get('articles', [])
    else:
        print("No results from NewsAPI.")
    return []

# Function to fetch news using FinHub as fallback
def fetch_news_for_company_finhub(company_name, max_results=10):
    url = f"https://finnhub.io/api/v1/news?category=general&token={FINHUB_API_KEY}"

    print(f"FinHub URL: {url}")  # Log the URL being sent

    results = fetch_with_retry(url)
    if results:
        print("Results fetched from FinHub")  # Log when results are fetched
        return results
    else:
        print("No results from FinHub.")
    return []

# Main function to fetch and return articles
def fetch_and_return_articles(company_name, max_articles=20):
    data = []
    start_index = 1
    total_entries = 0

    while total_entries < max_articles:
        remaining_articles = max_articles - total_entries

        # Try fetching from Google Custom Search
        print(f"Trying Google Custom Search...")
        results = fetch_news_for_company_google(company_name, start_index, remaining_articles)
        
        if results:
            print(f"Found {len(results)} results from Google.")
        else:
            print("No results from Google, switching to NewsAPI.")
            results = fetch_news_for_company_newsapi(company_name, remaining_articles)
        
        if results:
            print(f"Found {len(results)} results from NewsAPI.")
        else:
            print("No results from NewsAPI, switching to FinHub.")
            results = fetch_news_for_company_finhub(company_name, remaining_articles)

        if results:
            for item in results:
                # Attempt to fetch the full article if available
                full_article = item.get('content', '')  # Check for 'content' field

                if not full_article:  # If no full article, fallback to description/snippet
                    full_article = item.get('description', '') if 'description' in item else item.get('snippet', '')

                # Remove timestamp-like text (e.g., "5 hours ago", "3 days ago", etc.)
                article_cleaned = re.sub(r'\d+\s*(days?|hours?)\s*ago', '', full_article)

                # Append cleaned article to the list
                data.append({'Summary': article_cleaned.strip()})

                # Print the cleaned article content
                print("\n--- Article Details ---")
                print(f"Article Content: {article_cleaned.strip()}")
                print("-----------------------")

                total_entries += 1
                if total_entries >= max_articles:
                    break

        print("\n=== End Summary ===")
        print(f"Total articles fetched: {len(data)}")
        for i, article in enumerate(data, 1):
            print(f"{i}. {article['Summary']}")

        start_index += 10

    print(f"Total fetched articles: {len(data)}")
    return data
