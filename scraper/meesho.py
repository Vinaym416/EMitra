# meesho.py
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from scraperapi import fetch_with_scraperapi

def scrape_meesho(url):
    html = fetch_with_scraperapi(url)
    if not html:
        return []

    soup = BeautifulSoup(html, 'html.parser')
    products = []
    cards = soup.select('a[href*="/products/"]')
    for card in cards:
        name = card.get('title') or card.get_text(strip=True)
        link = urljoin("https://www.meesho.com", card.get('href'))
        img_tag = card.select_one('img')
        price_tag = card.find_next('h5')

        products.append({
            'name': name,
            'price': price_tag.text.strip() if price_tag else 'N/A',
            'image': img_tag['src'] if img_tag else None,
            'description': 'N/A',
            'rating': 'N/A',
            'link': link,
            'brand': 'Meesho',
            'return_policy': 'Refer to product page'
        })
    return products
