"""
Send a single test message via Telegram bot to verify the setup works.

Usage (run from the scrapper/ project root):
    uv run python tests/test_telegram.py
"""

import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")


def main():
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")

    if not token or not chat_id:
        print("ERROR: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing in .env")
        sys.exit(1)

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    response = requests.post(url, data={
        "chat_id": chat_id,
        "text": "🚗 Test správa z Bazos alert bota!",
    })

    print(f"Status code: {response.status_code}")
    print(f"Response: {response.json()}")


if __name__ == "__main__":
    main()