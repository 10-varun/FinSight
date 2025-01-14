from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

def get_stock_data(company):
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    company = company.upper().replace(" ", "")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    url = f"https://www.screener.in/company/{company}/consolidated/"
    driver.get(url)

    time.sleep(5)

    all_tables_data = {}

    try:
        tables = driver.find_elements(By.CLASS_NAME, 'data-table')
        print(f"Total tables found: {len(tables)}")  # Debugging line to show number of tables found

        for i, table in enumerate(tables):
            table_data = []
            rows = table.find_elements(By.TAG_NAME, 'tr')

            for row in rows:
                cells = row.find_elements(By.TAG_NAME, 'td')
                cell_text = [cell.text.strip() for cell in cells]
                table_data.append(cell_text)

            all_tables_data[f"Table_{i + 1}"] = table_data

            # Display the fetched table data for debugging
            print(f"\nTable {i + 1}:")
            for row in table_data:
                print(row)

    except Exception as e:
        print("Error:", e)

    driver.quit()
    return all_tables_data
