# glowroad.py
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from urllib.parse import urljoin
import time

def init_driver():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

def scrape_glowroad(url):
    driver = init_driver()
    driver.get(url)
    time.sleep(5)
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    driver.quit()

    products = []
    cards = soup.select('div.product-card')
    for card in cards:
        name = card.select_one('h2')
        price = card.select_one('.price')
        img_tag = card.select_one('img')
        link_tag = card.select_one('a')

        products.append({
            'name': name.text.strip() if name else 'N/A',
            'price': price.text.strip() if price else 'N/A',
            'image': img_tag['src'] if img_tag else None,
            'description': 'N/A',
            'rating': 'N/A',
            'link': urljoin('https://www.glowroad.com', link_tag['href']) if link_tag else url,
            'brand': 'GlowRoad',
            'return_policy': 'Refer to product page'
        })
    return products
