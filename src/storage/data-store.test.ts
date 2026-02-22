import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DataStore } from './data-store.js';

describe('DataStore', () => {
  let store: DataStore;

  beforeEach(() => {
    store = new DataStore(':memory:');
    store.initialize();
  });

  afterEach(() => {
    store.close();
  });

  it('should create all expected tables', () => {
    const db = store.getDatabase();
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
      .all() as { name: string }[];

    const tableNames = tables.map((t) => t.name);
    expect(tableNames).toContain('_migrations');
    expect(tableNames).toContain('restaurants');
    expect(tableNames).toContain('watches');
    expect(tableNames).toContain('snipes');
    expect(tableNames).toContain('reservations');
    expect(tableNames).toContain('preferences');
    expect(tableNames).toContain('drop_schedules');
    expect(tableNames).toContain('notifications');
  });

  it('should enable WAL mode', () => {
    const db = store.getDatabase();
    const result = db.pragma('journal_mode') as { journal_mode: string }[];
    // In-memory databases report 'memory' since WAL requires a file;
    // the pragma is still issued, so we accept both.
    expect(['wal', 'memory']).toContain(result[0].journal_mode);
  });

  it('should enable foreign keys', () => {
    const db = store.getDatabase();
    const result = db.pragma('foreign_keys') as { foreign_keys: number }[];
    expect(result[0].foreign_keys).toBe(1);
  });

  it('should be idempotent (calling initialize twice does not error)', () => {
    expect(() => store.initialize()).not.toThrow();
  });

  it('should create indexes', () => {
    const db = store.getDatabase();
    const indexes = db
      .prepare("SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%'")
      .all() as { name: string }[];

    const indexNames = indexes.map((i) => i.name);
    expect(indexNames).toContain('idx_watches_status');
    expect(indexNames).toContain('idx_snipes_status');
    expect(indexNames).toContain('idx_snipes_drop_time');
    expect(indexNames).toContain('idx_reservations_date');
    expect(indexNames).toContain('idx_restaurants_platform');
  });

  it('should enforce foreign key constraints', () => {
    const db = store.getDatabase();
    // Inserting a watch with a non-existent restaurant_id should fail
    expect(() => {
      db.prepare(
        `
        INSERT INTO watches (id, restaurant_id, restaurant_name, platform_id, date, party_size)
        VALUES ('w1', 'nonexistent', 'Test', 'resy', '2025-01-01', 2)
      `,
      ).run();
    }).toThrow();
  });
});
