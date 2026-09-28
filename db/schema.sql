CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    telegram_chat_id TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS searches (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    source TEXT NOT NULL,
    url TEXT,
    search_term TEXT,
    price_min INTEGER,
    price_max INTEGER,
    location TEXT,
    radius INTEGER,
    max_pages INTEGER NOT NULL DEFAULT 3,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
);

CREATE TABLE IF NOT EXISTS listings (
    id TEXT NOT NULL,
    source TEXT NOT NULL,
    search_id INTEGER REFERENCES searches(id) ON DELETE CASCADE,
    title TEXT,
    url TEXT,
    price TEXT,
    image_url TEXT,
    description TEXT,
    location TEXT,
    category TEXT,
    date_posted TEXT,
    view_count INTEGER,
    seller_id TEXT,
    first_seen TIMESTAMP NOT NULL DEFAULT NOW(),
    last_checked TIMESTAMP NOT NULL DEFAULT NOW(),
    notified BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id, source)
);

CREATE TABLE IF NOT EXISTS blocked_sellers (
    seller_id TEXT PRIMARY KEY,
    note TEXT,
    blocked_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listings_search_id ON listings(search_id);