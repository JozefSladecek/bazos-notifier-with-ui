"""
Read active searches from the DB, scrape each one, and save new listings.

Usage (run from the scrapper/ project root):
    uv run python scripts/db_driven_scrape.py
"""
import os
import sys
from pathlib import Path

# Add the project root (parent of scripts/) to Python's import path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

import psycopg2.extras

from src.db.connect import get_connection
from src.scrapers import BazosScraper
from src.notifications.telegram import send_telegram_notification, format_telegram_message


def fetch_active_searches(cur):
    """Return all active search rows, with the owner's chat id."""
    cur.execute(
        """
        SELECT s.*, u.telegram_chat_id AS user_chat_id
        FROM searches s
        LEFT JOIN users u ON s.user_id = u.id
        WHERE s.active = true
        """
    )
    return cur.fetchall()


def build_search_config(search):
    """Turn a DB search row into the config dict BazosScraper expects."""
    return {
        "source": search["source"],
        "url": search["url"],
        "search_term": search["search_term"],
        "price_min": search["price_min"],
        "price_max": search["price_max"],
        "location": search["location"],
        # +1 page as a buffer, so we can reliably detect listings that
        # disappeared from Bazos (see save_listing/remove_stale_listings)
        "max_pages": (search["max_pages"] or 1) + 1,
    }


def scrape_search(search, scraper):
    """Run the scraper for a single search row. Returns a list of Listing objects."""
    config = build_search_config(search)
    return scraper.scrape(config)


def listing_exists(cur, listing):
    """Check whether this listing is already in the DB."""
    cur.execute(
        "SELECT 1 FROM listings WHERE id = %s AND source = %s",
        (listing.listing_id, listing.source),
    )
    return cur.fetchone() is not None


def touch_listing(cur, listing):
    """Update last_checked for a listing we've already seen."""
    cur.execute(
        "UPDATE listings SET last_checked = NOW() WHERE id = %s AND source = %s",
        (listing.listing_id, listing.source),
    )


def insert_listing(cur, listing, search_id):
    """Insert a brand new listing into the DB."""
    cur.execute(
        """
        INSERT INTO listings
        (id, source, search_id, title, url, price, image_url, description,
         location, category, date_posted, view_count, seller_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            listing.listing_id,
            listing.source,
            search_id,
            listing.title,
            listing.url,
            listing.price,
            listing.image_url,
            listing.description,
            listing.location,
            listing.category,
            listing.date_posted,
            listing.view_count,
            listing.seller_id,
        ),
    )


def is_seller_blocked(cur, seller_id):
    """Check whether this seller_id is on the blocklist."""
    if not seller_id:
        return False

    cur.execute(
        "SELECT 1 FROM blocked_sellers WHERE seller_id = %s",
        (seller_id,),
    )
    return cur.fetchone() is not None


def save_listing(cur, listing, search_id, search_name, scraper, chat_id):
    """Save one listing: insert if new, otherwise just update last_checked.
    Returns True if it was a new listing, False if it already existed."""
    if listing_exists(cur, listing):
        touch_listing(cur, listing)
        return False
    else:
        listing.seller_id = scraper.get_seller_id(listing.url)  # open detail only if new
        insert_listing(cur, listing, search_id)

        if is_seller_blocked(cur, listing.seller_id):
            print(f"  SKIPPED (blocked seller): {listing.title}")
        else:
            message = format_telegram_message(listing, search_name)
            send_telegram_notification(message, chat_id)

        return True

def find_stale_listings(cur, search_id, scraped_listings):
    """Find listings in the DB for this search that were NOT found in the current scrape.
    Returns a list of (id, source) tuples."""
    scraped_ids = {(listing.listing_id, listing.source) for listing in scraped_listings}  # current search

    cur.execute(
        "SELECT id, source FROM listings WHERE search_id = %s",
        (search_id,),
    )
    db_ids = {(row["id"], row["source"]) for row in cur.fetchall()} # search in db

    stale = db_ids - scraped_ids
    return list(stale)

def delete_stale_listings(cur, stale):
    """Delete listings that are no longer found on Bazos."""
    for listing_id, source in stale:
        cur.execute(
            "DELETE FROM listings WHERE id = %s AND source = %s",
            (listing_id, source),
        )

def process_search(cur, search):
    print(f"\n--- Search '{search['name']}' (id={search['id']}) ---")

    scraper = BazosScraper(search["source"])  # jedna inštancia pre celé hľadanie

    try:
        listings = scrape_search(search, scraper)
    except Exception as e:
        print(f"  ERROR scraping: {e}")
        return 0, 0

    print(f"  Found {len(listings)} listing(s) on the page")

    new_count = 0
    existing_count = 0

    chat_id = search["user_chat_id"] or os.environ.get("TELEGRAM_CHAT_ID")

    for listing in listings:
        is_new = save_listing(cur, listing, search["id"], search["name"], scraper, chat_id)
        if is_new:
            new_count += 1
            print(f"  NEW: {listing.title} - {listing.price}")
        else:
            existing_count += 1

    stale = find_stale_listings(cur, search["id"], listings)
    if stale:
        # print(f"  Found {len(stale)} stale listing(s):")
        delete_stale_listings(cur, stale)

    return new_count, existing_count


def main():
    conn = get_connection()
    conn.autocommit = True
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    print("Reading active searches from DB...")
    active_searches = fetch_active_searches(cur)
    print(f"Found {len(active_searches)} active search(es)")

    total_new = 0
    total_existing = 0

    for search in active_searches:
        new_count, existing_count = process_search(cur, search)
        total_new += new_count
        total_existing += existing_count

    cur.close()
    conn.close()

    print(f"\nDone. New listings: {total_new}, already existed: {total_existing}")


if __name__ == "__main__":
    main()