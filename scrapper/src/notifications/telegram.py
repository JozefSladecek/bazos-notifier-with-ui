import os

import requests


def send_telegram_message(text: str) -> bool:
    """Send a message via the Telegram bot. Returns True on success, False on failure."""
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
        print(f"  WARNING: Failed to send Telegram notification: {e}")
        return False