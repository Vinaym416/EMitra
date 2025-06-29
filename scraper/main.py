import json, time
from meesho import scrape_meesho
from snapdeal import scrape_snapdeal
from glowroad import scrape_glowroad
from nykaa import scrape_nykaa
from ajio import scrape_ajio
from purplle import scrape_purplle
from universal_smart_scraper import smart_scrape


MAX_PRODUCTS_PER_CATEGORY = 20  # limit for safety

platforms = {
    'Meesho': {
        'clothing': 'https://www.meesho.com/women-wear/pl/3b0',
        'cosmetics': 'https://www.meesho.com/beauty-and-health/pl/3wh'
    },
    'Snapdeal': {
        'clothing': 'https://www.snapdeal.com/products/womens-apparel',
        'footwear': 'https://www.snapdeal.com/products/womens-footwear'
    },
    'GlowRoad': {
        'clothing': 'https://www.glowroad.com/supplier/women-clothing/',
    },
    'Nykaa': {
        'cosmetics': 'https://www.nykaa.com/makeup/c/12'
    },
    'Ajio': {
        'clothing': 'https://www.ajio.com/women-western-wear/c/830316003',
        'footwear': 'https://www.ajio.com/women-footwear/c/830316008'
    },
    'Purplle': {
        'cosmetics': 'https://www.purplle.com/makeup',
        'skincare': 'https://www.purplle.com/skin-care'
    }
}

scraper_map = {
    'Meesho': scrape_meesho,
    'Snapdeal': scrape_snapdeal,
    'GlowRoad': scrape_glowroad,
    'Nykaa': scrape_nykaa,
    'Ajio': scrape_ajio,
    'Purplle': scrape_purplle
}

all_products = []

for platform, urls in platforms.items():
    scraper = scraper_map.get(platform, None)
    for category, url in urls.items():
        print(f'🔍 Scraping {platform} - {category}...')
        try:
            products = scraper(url) if scraper else smart_scrape(url)
            products = products[:MAX_PRODUCTS_PER_CATEGORY]
        except Exception as e:
            print(f'❌ {platform} scraper failed: {e}\n Falling back to universal scraper...')
            try:
                products = smart_scrape(url)
            except Exception as fallback_error:
                print(f' Fallback failed for {platform} - {category}: {fallback_error}')
                continue

        for product in products:
            product['platform'] = platform
            product['category'] = category
            all_products.append(product)
        time.sleep(1)

with open('products_dev.json', 'w', encoding='utf-8') as f:
    json.dump(all_products, f, indent=2, ensure_ascii=False)

print(f' Scraped {len(all_products)} products saved to products_dev.json')
