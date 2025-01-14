import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import requests
from bs4 import BeautifulSoup
from datetime import datetime

# Scrape Screener
def scrape_screener(company):
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    company = company.upper().replace(" ", "")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    url = f"https://www.screener.in/company/{company}/consolidated/"
    driver.get(url)

    time.sleep(5)

    net_cash_flow = None

    try:
        tables = driver.find_elements(By.CLASS_NAME, 'data-table')
        if len(tables) >= 5:
            table = tables[4]  # 5th table (index 4)
            rows = table.find_elements(By.TAG_NAME, 'tr')

            for row in rows:
                cells = row.find_elements(By.TAG_NAME, 'td')
                cell_text = [cell.text.strip() for cell in cells]

                if 'Net Cash Flow' in cell_text:
                    net_cash_flow = cell_text[-1]
                    break
    except Exception as e:
        print("Error:", e)

    driver.quit()
    return net_cash_flow    

# Scrape Economic Times
def scrape_news(company):
    articles = []
    url = f"https://economictimes.indiatimes.com/topic/{company}-news"
    response = requests.get(url)

    if response.status_code != 200:
        return articles  

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
