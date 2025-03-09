from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time


company_to_nse = {
    "Reliance Industries Ltd": "RELIANCE",
    "Tata Consultancy Services Ltd": "TCS",
    "HDFC Bank Ltd": "HDFCBANK",
    "Infosys Ltd": "INFY",
    "Hindustan Unilever Ltd": "HINDUNILVR",
    "ICICI Bank Ltd": "ICICIBANK",
    "Bharti Airtel Ltd": "BHARTIARTL",
    "State Bank of India": "SBIN",
    "Kotak Mahindra Bank Ltd": "KOTAKBANK",
    "Bajaj Finance Ltd": "BAJFINANCE",
    "Axis Bank Ltd": "AXISBANK",
    "ITC Ltd": "ITC",
    "Larsen & Toubro Ltd": "LT",
    "HCL Technologies Ltd": "HCLTECH",
    "Asian Paints Ltd": "ASIANPAINT",
    "Maruti Suzuki India Ltd": "MARUTI",
    "Titan Company Ltd": "TITAN",
    "Bajaj Finserv Ltd": "BAJAJFINSV",
    "Wipro Ltd": "WIPRO",
    "UltraTech Cement Ltd": "ULTRACEMCO",
    "Sun Pharmaceutical Industries Ltd": "SUNPHARMA",
    "Nestle India Ltd": "NESTLEIND",
    "Power Grid Corporation of India Ltd": "POWERGRID",
    "Tech Mahindra Ltd": "TECHM",
    "Mahindra & Mahindra Ltd": "M&M",
    "Tata Steel Ltd": "TATASTEEL",
    "JSW Steel Ltd": "JSWSTEEL",
    "NTPC Ltd": "NTPC",
    "Tata Motors Ltd": "TATAMOTORS",
    "IndusInd Bank Ltd": "INDUSINDBK",
    "HDFC Life Insurance Company Ltd": "HDFCLIFE",
    "Adani Ports and Special Economic Zone Ltd": "ADANIPORTS",
    "Shree Cement Ltd": "SHREECEM",
    "Bajaj Auto Ltd": "BAJAJ-AUTO",
    "Hindalco Industries Ltd": "HINDALCO",
    "Oil & Natural Gas Corporation Ltd": "ONGC",
    "Bharat Petroleum Corporation Ltd": "BPCL",
    "Grasim Industries Ltd": "GRASIM",
    "SBI Life Insurance Company Ltd": "SBILIFE",
    "Britannia Industries Ltd": "BRITANNIA",
    "Godrej Consumer Products Ltd": "GODREJCP",
    "Dr. Reddy's Laboratories Ltd": "DRREDDY",
    "Indian Oil Corporation Ltd": "IOC",
    "Hero MotoCorp Ltd": "HEROMOTOCO",
    "Adani Enterprises Ltd": "ADANIENT",
    "Cipla Ltd": "CIPLA",
    "Divi's Laboratories Ltd": "DIVISLAB",
    "Eicher Motors Ltd": "EICHERMOT",
    "Dabur India Ltd": "DABUR",
    "Coal India Ltd": "COALINDIA",
    "GAIL (India) Ltd": "GAIL",
    "Adani Green Energy Ltd": "ADANIGREEN",
    "Siemens Ltd": "SIEMENS",
    "Lupin Ltd": "LUPIN",
    "Vedanta Ltd": "VEDL",
    "Tata Power Company Ltd": "TATAPOWER",
    "Bajaj Holdings & Investment Ltd": "BAJAJHLDNG",
    "Havells India Ltd": "HAVELLS",
    "Berger Paints India Ltd": "BERGEPAINT",
    "Ambuja Cements Ltd": "AMBUJACEM",
    "Marico Ltd": "MARICO",
    "Pidilite Industries Ltd": "PIDILITIND",
    "Tata Consumer Products Ltd": "TATACONSUM",
    "Biocon Ltd": "BIOCON",
    "Aurobindo Pharma Ltd": "AUROPHARMA",
    "Adani Transmission Ltd": "ADANITRANS",
    "DLF Ltd": "DLF",
    "Yes Bank Ltd": "YESBANK",
    "Torrent Pharmaceuticals Ltd": "TORNTPHARM",
    "Bosch Ltd": "BOSCHLTD",
    "Jubilant Foodworks Ltd": "JUBLFOOD",
    "InterGlobe Aviation Ltd": "INDIGO",
    "Balkrishna Industries Ltd": "BALKRISIND",
    "Motherson Sumi Systems Ltd": "MOTHERSON",
    "Muthoot Finance Ltd": "MUTHOOTFIN",
    "Bandhan Bank Ltd": "BANDHANBNK",
    "Hindustan Aeronautics Ltd": "HAL",
    "Gland Pharma Ltd": "GLAND",
    "United Spirits Ltd": "MCDOWELL-N",
    "Bharat Electronics Ltd": "BEL",
    "Colgate-Palmolive (India) Ltd": "COLPAL",
    "Jindal Steel & Power Ltd": "JINDALSTEL",
    "MRF Ltd": "MRF",
    "Cadila Healthcare Ltd": "ZYDUSLIFE",
    "SBI Cards and Payment Services Ltd": "SBICARD",
    "Punjab National Bank": "PNB",
    "Bharat Forge Ltd": "BHARATFORG",
    "Trent Ltd": "TRENT",
    "NMDC Ltd": "NMDC",
    "Aditya Birla Capital Ltd": "ABCAPITAL",
    "LIC Housing Finance Ltd": "LICHSGFIN",
    "Abbott India Ltd": "ABBOTINDIA",
    "Page Industries Ltd": "PAGEIND",
    "ICICI Prudential Life Insurance Company Ltd": "ICICIPRULI",
    "Voltas Ltd": "VOLTAS",
    "HDFC Asset Management Company Ltd": "HDFCAMC",
    "Alkem Laboratories Ltd": "ALKEM",
    "Info Edge (India) Ltd": "NAUKRI",
    "Cholamandalam Investment and Finance Company Ltd": "CHOLAFIN",
    "ICICI Lombard General Insurance Company Ltd": "ICICIGI",
    "Petronet LNG Ltd": "PETRONET",
    "Zee Entertainment Enterprises Ltd": "ZEEL"
}

def get_stock_data(company):
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")

    company_nse = company_to_nse.get(company)
    if not company_nse:
        print(f"Company name '{company}' not found in mapping.")
        company_nse=company

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    url = f"https://www.screener.in/company/{company_nse}/consolidated/"
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