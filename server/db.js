const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, process.env.DB_FILE || 'walutka.db');
const db = new sqlite3.Database(dbPath);

// Tworzenie tabel zgodnie z ERD
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS USERS (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS WALLET_BALANCE (
      balance_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      currency_code TEXT NOT NULL,
      amount REAL NOT NULL DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES USERS(user_id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS TRANSACTIONS (
      transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,                 -- DEPOSIT / BUY / SELL
      currency_from TEXT,
      currency_to TEXT,
      amount REAL NOT NULL,
      rate REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES USERS(user_id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS EXCHANGE_RATES (
      rate_id INTEGER PRIMARY KEY AUTOINCREMENT,
      currency_code TEXT NOT NULL,
      mid_rate REAL NOT NULL,
      effective_date DATE NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS EXCHANGE_RATES_HISTORY (
      history_id INTEGER PRIMARY KEY AUTOINCREMENT,
      currency_code TEXT NOT NULL,
      mid_rate REAL NOT NULL,
      rate_date DATE NOT NULL
    )
  `);
});

module.exports = db;
