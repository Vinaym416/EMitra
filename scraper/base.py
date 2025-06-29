import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

proxies = {
    'http': 'http://51.79.50.22:9300',
    'https': 'http://51.79.50.22:9300'
}

def get_soup(url):
    try:
        response = requests.get(url, headers=headers, proxies=proxies, timeout=10)
        return BeautifulSoup(response.text, 'html.parser')
    except Exception as e:
        print(f"[ERROR] Failed to fetch {url} — {e}")
        return None
