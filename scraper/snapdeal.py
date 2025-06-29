# snapdeal.py
from bs4 import BeautifulSoup
from scraperapi import fetch_with_scraperapi

def scrape_snapdeal(url):
    html = fetch_with_scraperapi(url)
    if not html:
        return []

    soup = BeautifulSoup(html, 'html.parser')
    products = []
    cards = soup.select('div.product-tuple-description')
    for card in cards:
        name = card.select_one('p.product-title')
        price = card.select_one('span.product-price')
        link_tag = card.find_parent('a')

        products.append({
            'name': name.text.strip() if name else 'N/A',
            'price': price.text.strip() if price else 'N/A',
            'image': None,
            'description': 'N/A',
            'rating': 'N/A',
            'link': link_tag['href'] if link_tag else url,
            'brand': 'Snapdeal',
            'return_policy': 'Refer to product page'
        })
    return products
