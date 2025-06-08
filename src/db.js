import { Database } from "bun:sqlite";
import path from "path";

const dbPath = path.join(process.cwd(), ".data", "links.db");

export const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    key_hash TEXT NOT NULL,
    url TEXT NOT NULL,
    user_ip TEXT NOT NULL,
    spoo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS hits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link_id TEXT NOT NULL,
    ip_data TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (link_id) REFERENCES links (id) ON DELETE CASCADE
  )
`);

export const linkQueries = {
  insert: db.prepare(
    "INSERT INTO links (id, key_hash, url, user_ip, spoo_url) VALUES (?, ?, ?, ?, ?)"
  ),
  findById: db.prepare("SELECT * FROM links WHERE id = ?"),
  deleteById: db.prepare("DELETE FROM links WHERE id = ?"),
  deleteHitsByLinkId: db.prepare("DELETE FROM hits WHERE link_id = ?"),
  insertHit: db.prepare("INSERT INTO hits (link_id, ip_data) VALUES (?, ?)"),
  getHits: db.prepare(
    "SELECT * FROM hits WHERE link_id = ? ORDER BY timestamp DESC"
  ),
};