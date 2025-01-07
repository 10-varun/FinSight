# to webscrape economic times

import requests
from bs4 import BeautifulSoup
from datetime import datetime

def scrape(url):
    articles = []
    response = requests.get(url)

    if response.status_code != 200:
        print("Filed to retrieve page")
        return articles

    soup = BeautifulSoup(response.content, 'html.parser')
    news = soup.find_all('div', class_='contentD')

    for item in news:
        headline = item.find('a').get_text(strip = True)
        timestamp = item.find('time').get_text(strip = True).replace(" IST", "")

        try:
            timestamp = datetime.strptime(timestamp, "%d %b, %Y, %I:%M %p")
        except ValueError:
            print("article skipped")
            continue
            
        articles.append({'Headline':headline, 'Timestamp':timestamp.strftime('%Y-%m-%d %H:%M:%S')})
        
    for article in articles:
        print(article['Headline'], article['Timestamp'])

company = input("enter company name:")
        
url = f"https://economictimes.indiatimes.com/topic/{company}-news"
articles = scrape(url)