import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  telegramChatId: text("telegram_chat_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const searches = pgTable("searches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  source: text("source").notNull(),
  url: text("url"),
  searchTerm: text("search_term"),
  priceMin: integer("price_min"),
  priceMax: integer("price_max"),
  location: text("location"),
  radius: integer("radius"),
  maxPages: integer("max_pages").notNull().default(3),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  telegramChatId: text("telegram_chat_id"),
});

export const listings = pgTable("listings", {
  id: text("id").notNull(),
  source: text("source").notNull(),
  searchId: integer("search_id").references(() => searches.id, { onDelete: "cascade" }),
  title: text("title"),
  url: text("url"),
  price: text("price"),
  imageUrl: text("image_url"),
  description: text("description"),
  location: text("location"),
  category: text("category"),
  datePosted: text("date_posted"),
  viewCount: integer("view_count"),
  firstSeen: timestamp("first_seen").notNull().defaultNow(),
  sellerId: text("seller_id"),
  lastChecked: timestamp("last_checked").notNull().defaultNow(),
  notified: boolean("notified").notNull().default(false),
});

export const blockedSellers = pgTable("blocked_sellers", {
  sellerId: text("seller_id").primaryKey(),
  note: text("note"),
  blockedAt: timestamp("blocked_at").notNull().defaultNow(),
});