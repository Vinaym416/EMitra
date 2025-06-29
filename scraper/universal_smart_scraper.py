# universal_smart_scraper.py

import time
import json
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager


def init_driver():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113.0.0.0 Safari/537.36")
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)


def extract_products(soup, base_url):
    products = []
    seen = set()

    for block in soup.find_all(['a', 'div', 'section']):
        if id(block) in seen:
            continue
        seen.add(id(block))

        name = block.select_one('h2, h3, h4, .title, .name')
        price = block.select_one('span[class*="price"], .price, .product-price')
        img = block.select_one('img')
        link_tag = block.find('a', href=True)

        if name and price:
            products.append({
                'name': name.text.strip(),
                'price': price.text.strip(),
                'image': img['src'] if img and 'src' in img.attrs else None,
                'link': urljoin(base_url, link_tag['href']) if link_tag else base_url,
                'description': 'N/A',
                'rating': 'N/A',
                'brand': 'Unknown',
                'return_policy': 'Refer to product page'
            })
    return products



def scroll(driver, rounds=3):
    for _ in range(rounds):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(3)


def smart_scrape(url):
    driver = init_driver()
    driver.get(url)
    time.sleep(6)
    scroll(driver, rounds=3)
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    driver.quit()
    return extract_products(soup, url)


if __name__ == '__main__':
    target_url = input("Enter e-commerce category page URL: ").strip()
    results = smart_scrape(target_url)
    with open('universal_output.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"✅ Extracted {len(results)} products. Saved to universal_output.json")
