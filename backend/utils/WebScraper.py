import requests
from bs4 import BeautifulSoup
from datetime import datetime

def scrape(company):
    articles = []
    url = f"https://economictimes.indiatimes.com/topic/{company}-news"
    response = requests.get(url)

    if response.status_code != 200:
        return articles  # Return empty if page retrieval fails

    soup = BeautifulSoup(response.content, 'html.parser')
    news = soup.find_all('div', class_='contentD')

    for item in news:
        headline = item.find('a').get_text(strip=True)
        timestamp = item.find('time')

        if timestamp:
            timestamp = timestamp.get_text(strip=True).replace(" IST", "")
            try:
                timestamp = datetime.strptime(timestamp, "%d %b, %Y, %I:%M %p")
            except ValueError:
                continue
            articles.append({
                'Headline': headline,
                'Timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S')
            })

    return articles
