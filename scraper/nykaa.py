# nykaa.py
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

def init_driver():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

def scrape_nykaa(url):
    driver = init_driver()
    driver.get(url)
    time.sleep(5)
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    driver.quit()

    products = []
    cards = soup.select('div.css-xrzmfa')  # Update if Nykaa structure changes
    for card in cards:
        name = card.select_one('div.css-0')
        price = card.select_one('span.css-111z9ua')
        img_tag = card.select_one('img')
        link_tag = card.find('a', href=True)

        products.append({
            'name': name.text.strip() if name else 'N/A',
            'price': price.text.strip() if price else 'N/A',
            'image': img_tag['src'] if img_tag else None,
            'description': 'N/A',
            'rating': 'N/A',
            'link': f"https://www.nykaa.com{link_tag['href']}" if link_tag else url,
            'brand': 'Nykaa',
            'return_policy': 'Refer to product page'
        })
    return products
