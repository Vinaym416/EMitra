# scraperapi.py
import requests
from dotenv import load_dotenv
import os

load_dotenv()
SCRAPERAPI_KEY = os.getenv("API_KEY")

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

def fetch_with_scraperapi(url):
    payload = {
        'api_key': SCRAPERAPI_KEY,
        'url': url
    }
    try:
        response = requests.get('https://api.scraperapi.com/', headers=headers, params=payload, timeout=15)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"[ERROR] ScraperAPI fetch failed for {url} — {e}")
        return None
