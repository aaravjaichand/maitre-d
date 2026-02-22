import Database from 'better-sqlite3';

/**
 * SQLite-based data store for maitre-d.
 * Uses WAL mode for concurrent read/write access.
 * Supports in-memory mode for tests.
 */
export class DataStore {
  private db: Database.Database;

  constructor(dbPath: string = ':memory:') {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
  }

  /** Initialize all tables. Safe to call multiple times (uses IF NOT EXISTS). */
  initialize(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS restaurants (
        id TEXT PRIMARY KEY,
        platform_id TEXT NOT NULL,
        platform_restaurant_id TEXT NOT NULL,
        name TEXT NOT NULL,
        cuisine TEXT,
        neighborhood TEXT,
        city TEXT,
        state TEXT,
        address TEXT,
        latitude REAL,
        longitude REAL,
        price_level INTEGER,
        rating REAL,
        image_url TEXT,
        url TEXT,
        metadata TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(platform_id, platform_restaurant_id)
      );

      CREATE TABLE IF NOT EXISTS watches (
        id TEXT PRIMARY KEY,
        restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
        restaurant_name TEXT NOT NULL,
        platform_id TEXT NOT NULL,
        date TEXT NOT NULL,
        date_range_start TEXT,
        date_range_end TEXT,
        party_size INTEGER NOT NULL,
        preferred_times TEXT,
        acceptable_times TEXT,
        seating_preferences TEXT,
        mode TEXT NOT NULL DEFAULT 'auto_book',
        poll_interval_ms INTEGER DEFAULT 30000,
        status TEXT NOT NULL DEFAULT 'active',
        result_reservation_id TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS snipes (
        id TEXT PRIMARY KEY,
        restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
        restaurant_name TEXT NOT NULL,
        platform_id TEXT NOT NULL,
        date TEXT NOT NULL,
        party_size INTEGER NOT NULL,
        drop_time TEXT NOT NULL,
        preferred_times TEXT,
        acceptable_times TEXT,
        seating_preferences TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        result_reservation_id TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS reservations (
        id TEXT PRIMARY KEY,
        platform_id TEXT NOT NULL,
        platform_reservation_id TEXT NOT NULL,
        restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
        restaurant_name TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        party_size INTEGER NOT NULL,
        seating_type TEXT,
        status TEXT NOT NULL DEFAULT 'confirmed',
        confirmation_id TEXT,
        manage_url TEXT,
        calendar_event_id TEXT,
        booked_at TEXT NOT NULL DEFAULT (datetime('now')),
        booked_by TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS preferences (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        cuisines TEXT DEFAULT '[]',
        cuisine_weights TEXT DEFAULT '{}',
        neighborhoods TEXT DEFAULT '[]',
        neighborhood_weights TEXT DEFAULT '{}',
        price_range TEXT,
        price_level_weights TEXT DEFAULT '{}',
        seating TEXT DEFAULT '[]',
        default_party_size INTEGER DEFAULT 2,
        default_time_pref TEXT,
        dining_style TEXT DEFAULT '[]',
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS drop_schedules (
        id TEXT PRIMARY KEY,
        restaurant_id TEXT NOT NULL REFERENCES restaurants(id),
        platform_id TEXT NOT NULL,
        pattern TEXT NOT NULL,
        days_ahead INTEGER NOT NULL,
        last_known_drop TEXT,
        source TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(restaurant_id, platform_id)
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        data TEXT,
        channels TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        sent_at TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_watches_status ON watches(status);
      CREATE INDEX IF NOT EXISTS idx_snipes_status ON snipes(status);
      CREATE INDEX IF NOT EXISTS idx_snipes_drop_time ON snipes(drop_time);
      CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
      CREATE INDEX IF NOT EXISTS idx_restaurants_platform ON restaurants(platform_id, platform_restaurant_id);
    `);
  }

  /** Get the underlying better-sqlite3 Database instance. */
  getDatabase(): Database.Database {
    return this.db;
  }

  /** Close the database connection. */
  close(): void {
    this.db.close();
  }
}
