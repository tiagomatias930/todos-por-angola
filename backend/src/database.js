const initSqlJs = require("sql.js");
const path = require("path");
const fs = require("fs");

const DB_PATH = path.join(__dirname, "..", "data", "nova_angola.db");
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

let db = null;

async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // ── Schema ──────────────────────────────────────────────────────────
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id          TEXT PRIMARY KEY,
      nome        TEXT NOT NULL,
      email       TEXT NOT NULL UNIQUE,
      telefone    TEXT NOT NULL UNIQUE,
      password    TEXT NOT NULL,
      created_at  TEXT DEFAULT (datetime('now'))
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS risk_areas (
      id                  TEXT PRIMARY KEY,
      imagem              TEXT,
      chuva               TEXT,
      temperatura         TEXT,
      tempo               TEXT,
      enderecoFormatado   TEXT,
      lat                 REAL,
      log                 REAL,
      categoria           TEXT,
      respostas           TEXT,
      classificacao       TEXT,
      user_id             TEXT,
      created_at          TEXT DEFAULT (datetime('now'))
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS confirmations (
      id            TEXT PRIMARY KEY,
      risk_area_id  TEXT NOT NULL,
      user_id       TEXT NOT NULL,
      created_at    TEXT DEFAULT (datetime('now')),
      UNIQUE(risk_area_id, user_id)
    );
  `);

  persist();
  return db;
}

function persist() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

module.exports = { getDb, persist };
