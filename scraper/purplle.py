from bs4 import BeautifulSoup
from scraperapi import fetch_with_scraperapi
from urllib.parse import urljoin

def scrape_purplle(url):
    html = fetch_with_scraperapi(url)
    if not html:
        return []

    soup = BeautifulSoup(html, 'html.parser')
    products = []
    cards = soup.select('div.product-card')
    for card in cards:
        name = card.select_one('h2.product-name')
        price = card.select_one('span.product-price')
        img_tag = card.select_one('img')
        link_tag = card.find('a', href=True)

        products.append({
            'name': name.text.strip() if name else 'N/A',
            'price': price.text.strip() if price else 'N/A',
            'image': img_tag['src'] if img_tag else None,
            'description': 'N/A',
            'rating': 'N/A',
            'link': urljoin('https://www.purplle.com', link_tag['href']) if link_tag else url,
            'brand': 'Purplle',
            'return_policy': 'Refer to product page'
        })
    return products
