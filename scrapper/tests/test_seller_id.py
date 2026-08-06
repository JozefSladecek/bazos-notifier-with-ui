from src.scrapers import BazosScraper

scraper = BazosScraper("bazos_sk")
result = scraper.get_seller_id("https://auto.bazos.sk/inzerat/194227701/mercedes-benz-c63-amg-515-koni-v8-akrapovic-titanium.php")
print(f"Seller ID: {result}")