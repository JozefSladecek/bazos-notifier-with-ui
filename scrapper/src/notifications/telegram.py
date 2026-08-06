import os

import requests


def format_telegram_message(listing, search_name):
    """Build the Telegram message content for a new listing.
    Returns a dict with 'text' and optional 'photo_url'."""
    lines = [
        f"🚗 Nový inzerát — {search_name}",
        "",
        f"{listing.title}",
        f"💰 {listing.price}",
    ]

    if listing.location:
        lines.append(f"📍 {listing.location}")

    if listing.url:
        lines.append("")
        lines.append(listing.url)

    return {
        "text": "\n".join(lines),
        "photo_url": listing.image_url,
    }

def send_telegram_message(text: str) -> bool:
    """Send a plain text message via the Telegram bot."""
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")

    if not token or not chat_id:
        print("  WARNING: Telegram not configured, skipping notification")
        return False

    url = f"https://api.telegram.org/bot{token}/sendMessage"

    try:
        response = requests.post(url, data={"chat_id": chat_id, "text": text})
        response.raise_for_status()
        return True
    except requests.RequestException as e:
        print(f"  WARNING: Failed to send Telegram message: {e}")
        return False


def send_telegram_photo(photo_url: str, caption: str) -> bool:
    """Send a photo with a caption via the Telegram bot."""
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")

    if not token or not chat_id:
        print("  WARNING: Telegram not configured, skipping notification")
        return False

    url = f"https://api.telegram.org/bot{token}/sendPhoto"

    try:
        response = requests.post(url, data={
            "chat_id": chat_id,
            "photo": photo_url,
            "caption": caption,
        })
        response.raise_for_status()
        return True
    except requests.RequestException as e:
        print(f"  WARNING: Failed to send Telegram photo: {e}")
        return send_telegram_message(caption)  # fallback for plain text


def send_telegram_notification(message: dict) -> bool:
    """Send a Telegram notification, using a photo if one is available, otherwise plain text."""
    if message.get("photo_url"):
        return send_telegram_photo(message["photo_url"], message["text"])
    else:
        return send_telegram_message(message["text"])